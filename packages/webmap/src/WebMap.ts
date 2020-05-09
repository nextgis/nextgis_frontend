/**
 * @module webmap
 *
 * Since it was not possible to split the code through mixins, inheritance was used.
 * The `ts-mixin` plugin worked fine, but led to errors in IE.
 *
 * Now inheritance is as follow:
 * BaseWebMap > WebMapLayers > WebMap
 *
 * Will need to be done this way:
 * class WebMap extend mixin(WebMapLayers, WebMapControls) {}
 *
 * This approach can also be considered
 *
 * class WebMap {
 *   layers: WebMapLayers;
 *   controls  WebMapControls
 * }
 *
 * and then
 *
 * const webMap = new WebMap(...);
 * webMap.layers.addLayer(...)
 *
 * looks good, but will add difficulty in inheriting from WebMap
 *
 * old:
 *
 * class NgwMap extends WebMap {
 *   addLayer(...) {
 *      super.addLayer(...)
 *   }
 * }
 *
 * new:
 *
 * class NgwLayers extends WebMapLayers {
 *   addLayer(...) {
 *     super.addLayer(...)
 *   }
 * }
 *
 * class NgwMap extends WebMap {
 *   layersClass = NgwLayers
 * }
 *
 * ...and there will be compatibility issues
 *
 */

import { WebMapEvents } from './interfaces/Events';

import {
  MapControl,
  CreateControlOptions,
  ButtonControlOptions,
  ToggleControlOptions,
  ToggleControl,
  MapControls,
} from './interfaces/MapControl';

import { ControlPositions } from './interfaces/MapAdapter';
import { WebMapLayers } from './WebMapLayers';

export class WebMap<
  M = any,
  L = any,
  C = any,
  E extends WebMapEvents = WebMapEvents
> extends WebMapLayers<M, L, C, E> {
  static controls: {
    [name: string]: (webMap: WebMap, options?: any) => any;
  } = {
    CONTROL: (
      webMap: WebMap,
      options: {
        control: MapControl;
        options?: CreateControlOptions;
      }
    ) => {
      return webMap.createControl(options.control, options.options);
    },
    BUTTON: (webMap: WebMap, options: ButtonControlOptions) => {
      return webMap.createButtonControl(options);
    },
    TOGGLE: (webMap: WebMap, options: ToggleControlOptions) => {
      return webMap.createToggleControl(options);
    },
  };

  private _loadControlQueue: (() => Promise<any>)[] = [];
  private _isControlLoading = false;

  async addControl<K extends keyof MapControls>(
    controlDef: K | C,
    position: ControlPositions,
    options?: MapControls[K]
  ): Promise<any> {
    let control: C | undefined;
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
        this._setControlQueue(promise);
      });
    }
  }

  /**
   * Creating a universal map layout control element. Can be used with any map adapter.
   *
   * @example
   * const control = webMap.createControl({
   *   onAdd() {
   *     return document.createElement('div');
   *   }
   * });
   */
  async createControl(
    control: MapControl,
    options?: CreateControlOptions
  ): Promise<C | undefined> {
    await this.onLoad('build-map');
    if (this.mapAdapter.createControl) {
      return this.mapAdapter.createControl(control, options);
    }
  }

  async createButtonControl(
    options: ButtonControlOptions
  ): Promise<C | undefined> {
    await this.onLoad('build-map');
    if (this.mapAdapter.createButtonControl) {
      return this.mapAdapter.createButtonControl(options);
    }
  }

  async createToggleControl(
    options: ToggleControlOptions
  ): Promise<(C & ToggleControl) | undefined> {
    await this.onLoad('build-map');
    if (this.mapAdapter.createToggleControl) {
      return this.mapAdapter.createToggleControl(options);
    } else {
      if (this.mapAdapter.createButtonControl) {
        return WebMap.utils.createToggleControl<C>(
          this.mapAdapter.createButtonControl,
          options
        );
      }
    }
  }

  removeControl(control: any) {
    if (control.remove) {
      control.remove();
    } else if (this.mapAdapter.removeControl) {
      this.mapAdapter.removeControl(control);
    }
  }

  getControl<K extends keyof MapControls>(
    control: K,
    options?: MapControls[K]
  ): C | undefined {
    const engine = this.mapAdapter.controlAdapters[control];
    if (engine) {
      return new engine(options);
    } else {
      const createFun = WebMap.controls[control];
      if (createFun) {
        return createFun(this, options);
      }
    }
  }

  protected async _addLayerProviders(): Promise<void> {
    try {
      for await (const kit of this._starterKits) {
        if (kit.getLayerAdapters) {
          const adapters = await kit.getLayerAdapters.call(kit);
          if (adapters) {
            for await (const adapter of adapters) {
              const newAdapter = await adapter.createAdapter(this);
              if (newAdapter) {
                this.mapAdapter.layerAdapters[adapter.name] = newAdapter;
              }
            }
          }
        }
      }
    } catch (er) {
      throw new Error(er);
    }
  }

  protected async _onLoadSync(): Promise<void> {
    for await (const kit of this._starterKits) {
      if (kit.onLoadSync) {
        try {
          await kit.onLoadSync.call(kit, this);
        } catch (er) {
          console.error(er);
        }
      }
    }
  }

  private _setControlQueue(cb: () => Promise<any>) {
    this._loadControlQueue.push(cb);
    if (!this._isControlLoading) {
      this._applyControls();
    }
  }

  private async _applyControls() {
    if (this._loadControlQueue.length) {
      this._isControlLoading = true;
      const controlCb = this._loadControlQueue[0];
      await controlCb();
      this._loadControlQueue.splice(0, 1);
      this._applyControls();
    } else {
      this._isControlLoading = false;
    }
  }
}
