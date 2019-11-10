import {
  MapAdapter as MA,
  FitOptions,
  ControlPositions,
  LocateOptions,
  Locate,
  LocationEvents
} from '../interfaces/MapAdapter';

import { LayerAdapter } from '../interfaces/LayerAdapter';
import { Type } from '../interfaces/BaseTypes';
import { EventEmitter } from 'events';
import {
  MapControls,
  MapControl,
  CreateControlOptions,
  ButtonControlOptions,
  ToggleControlOptions
} from '../interfaces/MapControl';
import { MapOptions } from '../interfaces/WebMapApp';
import { LngLatArray, LngLatBoundsArray } from '../interfaces/BaseTypes';

export class FakeMapAdapter<M = any, L = any, C extends any = any> implements MA {
  // isLoaded?: boolean = true;
  map?: M;
  emitter = new EventEmitter();

  layerAdapters: { [name: string]: Type<LayerAdapter<M, L, any>> } = {};

  controlAdapters: { [name: string]: Type<C> } = {};

  private _bounds?: LngLatBoundsArray;
  private _zoom?: number;
  private _center?: LngLatArray;
  private _container?: HTMLElement;

  create(options: MapOptions = { target: 'map' }): void {
    if (typeof options.target === 'string') {
      const elem = document.getElementById(options.target) as HTMLElement;
      if (elem) {
        this._container = elem;
      }
    } else if (options.target instanceof HTMLElement) {
      this._container = options.target;
    }
    if (this._container) {
      this._container.innerHTML = '<div></div>';
    }
    this.emitter.emit('create');
  }

  destroy(): void {
    this.map = undefined;
  }

  removeLayer(layer: L): any {
    //
  }

  beforeRemove(): void {
    //
  }

  setLayerOpacity(layer: L, opacity: number): void {
    //
  }
  showLayer(layer: L): void {
    //
  }
  hideLayer(layer: L): void {
    //
  }
  setLayerOrder(layer: L, order: number, layers?: { [name: string]: LayerAdapter }): void {
    //
  }

  fit(extent: LngLatBoundsArray, options?: FitOptions): void {
    //
  }

  setView(lngLat: LngLatArray, zoom?: number): void {
    //
  }

  getBounds(): LngLatBoundsArray | undefined {
    return this._bounds;
  }

  getZoom(): number | undefined {
    return this._zoom;
  }

  setZoom(zoom: number): void {
    this._zoom = zoom;
  }

  getCenter(): LngLatArray | undefined {
    return this._center;
  }

  setCenter(lngLat: LngLatArray): void {
    this._center = lngLat;
  }

  getContainer(): HTMLElement | undefined {
    return this._container;
  }

  setCursor(cursor: string): void {
    //
  }

  createControl(control: MapControl, options?: CreateControlOptions): C {
    return {} as C;
  }

  createButtonControl?(options: ButtonControlOptions): C {
    return {} as C;
  }
  createToggleControl?(options: ToggleControlOptions): C {
    return {} as C;
  }

  addControl<K extends keyof MapControls>(
    controlName: K | any,
    position: ControlPositions,
    options?: MapControls[K]
  ): any {
    //
  }

  removeControl(control: any): void {
    //
  }

  onMapClick(evt: any): void {
    //
  }

  locate(opt: LocateOptions, events?: LocationEvents): Locate {
    return { stop: () => false };
  }
}
