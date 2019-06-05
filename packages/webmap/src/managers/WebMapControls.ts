/**
 * @module webmap
 */
import { WebMap } from '../WebMap';
import {
  MapControl,
  CreateControlOptions,
  ButtonControlOptions,
  ToggleControlOptions,
  ToggleControl,
  MapControls
} from '../interfaces/MapControl';
import { createButtonControl } from '../components/controls/ButtonControl';
import { createToggleControl } from '../components/controls/ToggleControl';
import { ControlPositions } from '../interfaces/MapAdapter';

export class WebMapControls<C = any> {
  constructor(private webMap: WebMap) { }

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
  async createControl(control: MapControl, options?: CreateControlOptions): Promise<C | undefined> {
    await this.webMap.onLoad('build-map');
    if (this.webMap.mapAdapter.createControl) {
      return this.webMap.mapAdapter.createControl(control, options);
    }
  }

  async createButtonControl(options: ButtonControlOptions): Promise<C | undefined> {
    await this.webMap.onLoad('build-map');
    return createButtonControl(this.webMap, options);
  }

  async createToggleControl(options: ToggleControlOptions): Promise<(C & ToggleControl) | undefined> {
    await this.webMap.onLoad('build-map');
    if (this.webMap.mapAdapter.createToggleControl) {
      return this.webMap.mapAdapter.createToggleControl(options);
    } else {
      return createToggleControl<C>(this.webMap, options);
    }
  }

  removeControl(control: any) {
    if (control.remove) {
      control.remove();
    } else if (this.webMap.mapAdapter.removeControl) {
      this.webMap.mapAdapter.removeControl(control);
    }
  }

  getControl<K extends keyof MapControls>(control: K, options?: MapControls[K]): C | undefined {
    const engine = this.webMap.mapAdapter.controlAdapters[control];
    if (engine) {
      return new engine(options);
    }
  }

  async addControl<K extends keyof MapControls>(
    controlDef: K | C,
    position: ControlPositions,
    options?: MapControls[K]) {

    let control: C | undefined;
    if (typeof controlDef === 'string') {
      control = this.getControl(controlDef, options);
    } else {
      control = controlDef as C;
    }
    if (control) {
      const _control = await control;
      return this.webMap.mapAdapter.addControl(_control, position);
    }
  }
}
