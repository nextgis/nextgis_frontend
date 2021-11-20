import {
  MapAdapter as MA,
  FitOptions,
  ControlPositions,
  LocateOptions,
  Locate,
  LocationEvents,
} from '../../../packages/webmap/src/interfaces/MapAdapter';

import { LayerAdapter } from '../../../packages/webmap/src/interfaces/LayerAdapter';
import { EventEmitter } from 'events';
import {
  MapControls,
  MapControl,
  CreateControlOptions,
  ButtonControlOptions,
  ToggleControlOptions,
} from '../../../packages/webmap/src/interfaces/MapControl';
import {
  MapOptions,
  ViewOptions,
} from '../../../packages/webmap/src/interfaces/MapOptions';

import { FakeGeoJsonLayerAdapter } from './FakeGeojsonLayerAdapter';
import { FakeLayerAdapter } from './FakeLayerAdapter';
import { LngLatArray, LngLatBoundsArray, Type } from '@nextgis/utils';

export class FakeMapAdapter<M = any, L = any, C = any> implements MA {
  static layerAdapters = {
    TILE: FakeLayerAdapter,
    IMAGE: FakeLayerAdapter,
    // MVT: MvtAdapter,
    // OSM: OsmAdapter,
    GEOJSON: FakeGeoJsonLayerAdapter,
  };

  layerAdapters = FakeMapAdapter.layerAdapters;

  map?: M;
  emitter = new EventEmitter();

  controlAdapters: { [name: string]: Type<C> } = {};

  private options: MapOptions = {};

  private _container?: HTMLElement;

  create(options: MapOptions = {}): void {
    this.options = options;
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
    this.map = {} as any;
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
  setLayerOrder(
    layer: L,
    order: number,
    layers?: { [name: string]: LayerAdapter },
  ): void {
    //
  }

  fitBounds(e: LngLatBoundsArray, options?: FitOptions): void {
    this.options.center = [e[2] - (e[2] - e[0]) / 2, e[3] - (e[3] - e[1]) / 2];
    this.options.zoom = 8; // for [102, 51, 104, 53]
    this.emitter.emit('zoomstart');
    this.emitter.emit('zoom');
    this.emitter.emit('zoomend');
  }

  setView(lngLat: LngLatArray, zoom?: number): void;
  setView(options: ViewOptions): void;
  setView(lngLatOrOpt: LngLatArray | ViewOptions, zoom?: number): void {
    if (Array.isArray(lngLatOrOpt)) {
      this.options.center = lngLatOrOpt;
      if (zoom) {
        this.setZoom(zoom);
      }
    }
  }

  getBounds(): LngLatBoundsArray | undefined {
    return this.options.bounds;
  }

  getZoom(): number | undefined {
    return this.options.zoom;
  }

  setZoom(zoom: number): void {
    if (this.options.maxZoom !== undefined) {
      zoom = zoom < this.options.maxZoom ? zoom : this.options.maxZoom;
    }
    this.options.zoom = zoom;
  }

  getCenter(): LngLatArray | undefined {
    return this.options.center;
  }

  setCenter(lngLat: LngLatArray): void {
    this.options.center = lngLat;
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
    options?: MapControls[K],
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
