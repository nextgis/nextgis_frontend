import { WebMapLayers } from './WebMapLayers';
import { createToggleControl } from './components/controls/createToggleControl';

import type { WebMapMain } from './WebMapMain';
import type { MapOptions } from './interfaces/MapOptions';
import type { WebMapEvents } from './interfaces/Events';
import type {
  MapControl,
  CreateControlOptions,
  ButtonControlOptions,
  ToggleControlOptions,
  ToggleControl,
  MapControls,
} from './interfaces/MapControl';
import type { ControlPosition } from './interfaces/MapAdapter';

/**
 * Collection of methods for managing map controls
 */
export class WebMapControls<
    M = any,
    L = any,
    C extends object = any,
    E extends WebMapEvents = WebMapEvents,
    O extends MapOptions = MapOptions,
  >
  extends WebMapLayers<M, L, E, O>
  implements WebMapLayers, WebMapMain
{
  static controls: {
    [name: string]: (webMap: WebMapControls, options?: any) => any;
  } = {
    CONTROL: (
      webMap: WebMapControls,
      options: {
        control: MapControl;
        options?: CreateControlOptions;
      },
    ) => {
      return webMap.createControl(options.control, options.options);
    },
    BUTTON: (webMap: WebMapControls, options: ButtonControlOptions) => {
      return webMap.createButtonControl(options);
    },
    TOGGLE: (webMap: WebMapControls, options: ToggleControlOptions) => {
      return webMap.createToggleControl(options);
    },
  };

  private _loadControlQueue: {
    [key in ControlPosition]: (() => Promise<any>)[];
  } = {
    'top-right': [],
    'bottom-right': [],
    'top-left': [],
    'bottom-left': [],
  };
  private _isControlLoading: { [key in ControlPosition]: boolean } = {
    'top-right': false,
    'bottom-right': false,
    'top-left': false,
    'bottom-left': false,
  };

  async addControl<K extends keyof MapControls>(
    controlDef: K | C,
    position: ControlPosition,
    options?: MapControls[K],
  ): Promise<any> {
    let control: C | undefined;
    position = position ?? 'top-left';
    if (typeof controlDef === 'string') {
      control = this.getControl(controlDef, options);
    } else {
      control = controlDef as C;
    }
    if (control) {
      return new Promise<() => Promise<any>>((resolve) => {
        const promise = async () => {
          const _control = await control;
          const c = this.mapAdapter.addControl(_control, position);
          resolve(c);
        };
        this._setControlQueue(position, promise);
      });
    }
  }

  /**
   * Creating a universal map layout control element. Can be used with any map adapter.
   *
   * @example
   * ```javascript
   * const control = webMap.createControl({
   *   onAdd() {
   *     return document.createElement('div');
   *   }
   * });
   * ```
   */
  async createControl(
    control: MapControl,
    options?: CreateControlOptions,
  ): Promise<C | undefined> {
    await this.onLoad('build-map');
    if (this.mapAdapter.createControl) {
      return this.mapAdapter.createControl(control, options);
    }
  }

  async createButtonControl(
    options: ButtonControlOptions,
  ): Promise<C | undefined> {
    await this.onLoad('build-map');
    if (this.mapAdapter.createButtonControl) {
      return this.mapAdapter.createButtonControl(options);
    }
  }

  /**
   * Create any toggler control button
   * @param options - Options for control layout customization and assigning a callback function
   *
   * @example
   * ```javascript
   * const toggleControl = ngwMap.createToggleControl({
   *   getStatus: () => webMap.isLayerVisible('any-layer-id'),
   *   onClick: (status) => ngwMap.toggleLayer('webmap', status),
   *   html: {
   *     on: 'ON',
   *     off: 'OFF'
   *   },
   *   title: 'Toggle layer visibility'
   * });
   * webMap.addControl(toggleControl, 'top-right');
   * ```
   * {@link http://code.nextgis.com/demo-examples-toggle-control | Toggle button control example}
   */
  async createToggleControl(
    options: ToggleControlOptions,
  ): Promise<(C & ToggleControl) | undefined> {
    await this.onLoad('build-map');
    if (this.mapAdapter.createToggleControl) {
      return this.mapAdapter.createToggleControl(options);
    } else {
      if (this.mapAdapter.createButtonControl) {
        return createToggleControl<C>(
          this.mapAdapter.createButtonControl,
          options,
        );
      }
    }
  }

  /**
   *
   * @param control - Instance of WEB-GIS framework control.
   *                  What is returned by the {@Link WebMapControls.createControl | create} method
   */
  removeControl(control: C): void {
    if ('remove' in control) {
      // @ts-ignore TODO: ugly code, rewrite
      control.remove();
    } else if (this.mapAdapter.removeControl) {
      Promise.resolve(control).then((c) => {
        this.mapAdapter.removeControl(c);
      });
    }
  }

  /**
   * Get instance of registered control
   * @param control - Any registered control string name
   * @param options - Custom control options
   */
  getControl<K extends keyof MapControls>(
    control: K,
    options?: MapControls[K],
  ): C | undefined {
    const engine = this.mapAdapter.controlAdapters[control];
    if (engine) {
      return new engine(options);
    } else {
      const createFun = WebMapControls.controls[control];
      if (createFun) {
        return createFun(this, options);
      }
    }
  }

  getControlContainer(): HTMLElement | undefined {
    if (this.mapAdapter.getControlContainer) {
      return this.mapAdapter.getControlContainer();
    }
  }

  private _setControlQueue(position: ControlPosition, cb: () => Promise<any>) {
    this._loadControlQueue[position].push(cb);
    if (!this._isControlLoading[position]) {
      this._applyControls(position);
    }
  }

  private async _applyControls(position: ControlPosition) {
    if (this._loadControlQueue[position].length) {
      this._isControlLoading[position] = true;
      const controlCb = this._loadControlQueue[position][0];
      await controlCb();
      this._loadControlQueue[position].splice(0, 1);
      this._applyControls(position);
    } else {
      this._isControlLoading[position] = false;
    }
  }
}
