/**
 * @module webmap
 */

import { AdapterOptions, DataLayerFilter, VectorLayerAdapter, LayerAdapters } from './interfaces/LayerAdapter';
import { LayerAdaptersOptions, LayerAdapter, OnLayerClickOptions } from './interfaces/LayerAdapter';
import { MapAdapter, MapClickEvent, ControlPositions, FitOptions } from './interfaces/MapAdapter';
import { MapOptions, AppOptions, GetAttributionsOptions } from './interfaces/WebMapApp';
import { LngLatBoundsArray, Pixel, Type, Cursor, LngLatArray } from './interfaces/BaseTypes';
import { RuntimeParams } from './interfaces/RuntimeParams';
import { StarterKit } from './interfaces/StarterKit';
import { Keys } from './components/keys/Keys';
import {
  MapControl,
  MapControls,
  CreateControlOptions,
  ButtonControlOptions,
  ToggleControlOptions
} from './interfaces/MapControl';

import { Feature, GeoJsonObject } from 'geojson';
import { EventEmitter } from 'events';

import { onLoad } from './utils/decorators';
import { deepmerge } from './utils/lang';
import { createButtonControl } from './components/controls/ButtonControl';
import { createToggleControl } from './components/controls/ToggleControl';

type LayerDef = string | LayerAdapter;

/**
 * @class WebMap
 */
export class WebMap<M = any, L = any, C = any> {

  options: MapOptions = {};

  displayProjection = 'EPSG:3857';
  lonlatProjection = 'EPSG:4326';

  emitter = new EventEmitter();
  keys: Keys = new Keys(); // TODO: make injectable cached
  mapAdapter: MapAdapter<M>;
  runtimeParams: RuntimeParams[] = [];

  _eventsStatus: { [eventName: string]: boolean } = {};

  private DPI = 1000 / 39.37 / 0.28;
  private IPM = 39.37;

  private _starterKits: StarterKit[];
  private _baseLayers: string[] = [];
  private _layers: { [x: string]: LayerAdapter } = {};
  private _layersIds: number = 1;
  private _selectedLayers: string[] = [];
  private _extent?: LngLatBoundsArray;

  constructor(appOptions: AppOptions) {
    this.mapAdapter = appOptions.mapAdapter;
    this._starterKits = appOptions.starterKits || [];

    this._addEventsListeners();
  }

  async create(options: MapOptions): Promise<this> {
    this.options = deepmerge(this.options || {}, options);
    await this._setupMap();
    return this;
  }

  getContainer(): HTMLElement | undefined {
    if (this.mapAdapter.getContainer) {
      return this.mapAdapter.getContainer();
    } else if (this.options.target) {
      if (this.options.target instanceof HTMLElement) {
        return this.options.target;
      } else if (typeof this.options.target === 'string') {
        const element = document.getElementById(this.options.target);
        if (element) {
          return element;
        }
      }
    }
  }

  setCursor(cursor: Cursor) {
    if (this.mapAdapter.setCursor) {
      this.mapAdapter.setCursor(cursor);
    }
  }

  onMapLoad(cb?: any): Promise<void> {
    const mapAdapterOnLoad = this.mapAdapter.onMapLoad;
    if (mapAdapterOnLoad) {
      return mapAdapterOnLoad.call(this.mapAdapter, cb);
    }
    return Promise.resolve(cb);
  }

  async addBaseLayer(
    provider: keyof LayerAdaptersOptions | Type<LayerAdapter>,
    options?: any): Promise<LayerAdapter> {

    const layer = await this.addLayer(provider, {
      maxZoom: this.options.maxZoom,
      minZoom: this.options.minZoom,
      ...options,
      baseLayer: true
    });
    const id = this.getLayerId(layer);
    if (layer && id) {
      this._baseLayers.push(id);
    }
    return layer;
  }

  isBaseLayer(layerName: string): boolean {
    return this._baseLayers.indexOf(layerName) !== -1;
  }

  setCenter(lngLat: LngLatArray): this {
    this.mapAdapter.setCenter(lngLat);
    return this;
  }

  getCenter(): LngLatArray | undefined {
    return this.mapAdapter.getCenter();
  }

  setZoom(zoom: number): this {
    this.mapAdapter.setZoom(zoom);
    return this;
  }

  getZoom(): number | undefined {
    return this.mapAdapter.getZoom();
  }

  setView(lngLat?: LngLatArray, zoom?: number) {
    if (this.mapAdapter.setView && lngLat && zoom) {
      this.mapAdapter.setView(lngLat, zoom);
    } else {
      if (lngLat) {
        this.mapAdapter.setCenter(lngLat);
      }
      if (zoom) {
        this.mapAdapter.setZoom(zoom);
      }
    }
  }

  // [west, south, east, north];
  fitBounds(e: LngLatBoundsArray, options?: FitOptions): this {
    this.mapAdapter.fit(e, options);
    return this;
  }

  async fitLayer(layerDef: LayerDef) {
    const layer = this.getLayer(layerDef);
    if (layer && layer.getExtent) {
      const extent = await layer.getExtent();
      if (extent) {
        this.fitBounds(extent);
      }
    }
  }

  getLayerAdapters(): { [name: string]: Type<LayerAdapter> } {
    return this.mapAdapter.layerAdapters;
  }

  getLayerAdapter(name: string): Type<LayerAdapter> {
    return this.mapAdapter.layerAdapters[name];
  }

  getLayer(layerDef: LayerDef): LayerAdapter | undefined {
    if (typeof layerDef === 'string') {
      return this._layers[layerDef];
    }
    return layerDef;
  }

  getLayerId(layerDef: LayerDef): string | undefined {
    const layer = this.getLayer(layerDef);
    if (layer && layer.options) {
      return layer.options.id;
    } else {
      throw new Error('No id for layer');
    }
  }

  getLayers(): string[] {
    return Object.keys(this._layers);
  }

  isLayerVisible(layerDef: LayerDef): boolean {
    const layer = this.getLayer(layerDef);
    return layer && layer.options.visibility !== undefined ? layer.options.visibility : false;
  }

  /**
   * @deprecated use isLayerVisible instead
   */
  isLayerOnTheMap(layerDef: LayerDef): boolean {
    return this.isLayerVisible(layerDef);
  }

  @onLoad('build-map')
  createControl(control: MapControl, options?: CreateControlOptions): C | undefined {
    if (this.mapAdapter.createControl) {
      return this.mapAdapter.createControl(control, options);
    }
  }

  @onLoad('build-map')
  createButtonControl(options: ButtonControlOptions): C | undefined {
    return createButtonControl(this, options);
  }

  @onLoad('build-map')
  createToggleControl(options: ToggleControlOptions) {
    if (this.mapAdapter.createToggleControl) {
      return this.mapAdapter.createToggleControl(options);
    } else {
      return createToggleControl(this, options);
    }
  }

  removeControl(control: any) {
    if (control.remove) {
      control.remove();
    } else if (this.mapAdapter.removeControl) {
      this.mapAdapter.removeControl(control);
    }
  }

  getControl<K extends keyof MapControls>(control: K, options?: MapControls[K]): C | undefined {
    const engine = this.mapAdapter.controlAdapters[control];
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
      return this.mapAdapter.addControl(_control, position);
    }
  }

  async addLayer<K extends keyof LayerAdapters, O extends AdapterOptions = AdapterOptions>(
    adapter: K | Type<LayerAdapters[K]>,
    options: O | LayerAdaptersOptions[K]): Promise<LayerAdapter> {

    let adapterEngine: Type<LayerAdapter>;
    if (typeof adapter === 'string') {
      adapterEngine = this.getLayerAdapter(adapter);
    } else {
      adapterEngine = adapter as Type<LayerAdapter>;
    }
    if (adapterEngine) {
      const onLayerClickFromOpt = options.onLayerClick;
      options.onLayerClick = (e) => {
        if (onLayerClickFromOpt) {
          onLayerClickFromOpt(e);
        }
        return this._onLayerClick(e);
      };
      const order = this._layersIds++;

      options = {
        id: String(order),
        visibility: false,
        order,
        ...options
      };
      if (options.baseLayer) {
        options.order = 0;
      }

      const _adapter = new adapterEngine(this.mapAdapter.map, options);

      await this.onMapLoad();
      const layer = await _adapter.addLayer(options);
      // checking that the original layer was inserted into the adapter anyway
      _adapter.layer = layer;
      // think about how to move `id` to the adapter's constructor,
      // but that it is not required in the options
      _adapter.id = _adapter.options.id;

      const layerId = _adapter.options.id;
      if (layerId) {
        if (options.baseLayer) {
          this._baseLayers.push(layerId);
        }
        this._layers[layerId] = _adapter;

        if (options.visibility) {
          this.showLayer(layerId);
        }
      }

      return _adapter;

    }
    return Promise.reject('No adapter');
  }

  removeLayers() {
    for (const l in this._layers) {
      if (this._layers.hasOwnProperty(l)) {
        this.removeLayer(l);
      }
    }
    this._layers = {};
  }

  removeLayer(layerDef: LayerDef) {
    const layer = this.getLayer(layerDef);
    const layerId = layer && this.getLayerId(layer);
    if (layer && layerId) {
      this.mapAdapter.removeLayer(layer.layer);
      if (layer.options.baseLayer) {
        const index = this._baseLayers.indexOf(layerId);
        if (index) {
          this._baseLayers.splice(index, 1);
        }
      }
      delete this._layers[layerId];
    }
  }

  showLayer(layerDef: LayerDef) {
    this.toggleLayer(layerDef, true);
  }

  hideLayer(layerDef: LayerDef) {
    this.toggleLayer(layerDef, false);
  }

  setLayerOpacity(layerName: string, value: number) {
    if (this.mapAdapter.setLayerOpacity) {
      const layer = this.getLayer(layerName);
      if (layer) {
        this.mapAdapter.setLayerOpacity(layer.layer, value);
      }
    }
  }

  getScaleForResolution(res: number, mpu: number = 1): number {
    return res * (mpu * this.IPM * this.DPI);
  }

  getResolutionForScale(scale: number, mpu: number = 1): number {
    return scale / (mpu * this.IPM * this.DPI);
  }

  toggleLayer(layerDef: LayerDef, status?: boolean) {
    const layer = this.getLayer(layerDef);
    const onMap = layer && layer.options.visibility;
    const toStatus = status !== undefined ? status : !onMap;

    const action = (source: any, l: LayerAdapter) => {
      l.options.visibility = toStatus;
      if (toStatus && source) {
        const order = l.options.baseLayer ? 0 : l.options.order;
        if (l.showLayer) {
          l.showLayer.call(l, l.layer);
        } else {
          this.mapAdapter.showLayer(l.layer);
        }
        if (order !== undefined) {
          this.mapAdapter.setLayerOrder(l.layer, order, this._layers);
        }
      } else {
        if (l.hideLayer) {
          l.hideLayer.call(l, l.layer);
        } else {
          this.mapAdapter.hideLayer(l.layer);
        }
      }
    };
    if (layer && layer.options.visibility !== toStatus) {
      if (this.mapAdapter.map) {
        action(this.mapAdapter, layer);
      } else {
        this.mapAdapter.emitter.once('create', (data) => {
          action(data.map, layer);
        });
      }
    }
  }

  requestGeomString(pixel: Pixel, pixelRadius: number) {
    if (this.mapAdapter.requestGeomString) {
      return this.mapAdapter.requestGeomString(pixel, pixelRadius);
    }
  }

  onMapClick(evt: MapClickEvent) {
    this.emitter.emit('click', evt);
  }

  selectLayer(layerDef: LayerDef) {
    const layerMem = this.getLayer(layerDef);
    if (layerMem) {
      const adapter = layerMem as VectorLayerAdapter;
      if (adapter && adapter.select) {
        adapter.select();
      }
      const layerId = this.getLayerId(layerMem);
      if (layerId) {
        this._selectedLayers.push(layerId);
      }
    }
  }

  unSelectLayer(layerDef: LayerDef) {
    const layerMem = this.getLayer(layerDef);
    if (layerMem) {
      const adapter = layerMem && layerMem as VectorLayerAdapter;
      if (adapter.unselect) {
        adapter.unselect();
      }
      const layerId = this.getLayerId(layerMem);
      if (layerId) {
        const index = this._selectedLayers.indexOf(layerId);
        if (index !== -1) {
          this._selectedLayers.splice(index, 1);
        }
      }
    }
  }

  filterLayer(layerDef: LayerDef, filter: DataLayerFilter<Feature, L>) {
    const layerMem = this.getLayer(layerDef);
    const adapter = layerMem as VectorLayerAdapter;
    if (adapter.filter) {
      adapter.filter(filter);
    }
  }

  setLayerData(layerDef: LayerDef, data: GeoJsonObject) {
    const layerMem = this.getLayer(layerDef);
    const adapter = layerMem as VectorLayerAdapter;
    if (adapter.setData) {
      adapter.setData(data);
    }
  }

  addLayerData(layerDef: LayerDef, data: GeoJsonObject) {
    const layerMem = this.getLayer(layerDef);
    const adapter = layerMem as VectorLayerAdapter;
    if (adapter.addData) {
      adapter.addData(data);
    }
  }

  clearLayerData(layerDef: LayerDef, cb?: (feature: Feature) => boolean) {
    const layerMem = this.getLayer(layerDef);
    const adapter = layerMem as VectorLayerAdapter;
    if (adapter.clearLayer) {
      adapter.clearLayer(cb);
    }
  }

  getAttributions(options: GetAttributionsOptions): string[] {
    const attributions: string[] = [];
    for (const l in this._layers) {
      if (this._layers.hasOwnProperty(l)) {
        const layerMem = this._layers[l];
        const onlyVisible = options.onlyVisible !== undefined ? options.onlyVisible : true;
        const useLayerAttr = onlyVisible ? layerMem.options.visibility : true;
        if (useLayerAttr) {
          const attr = layerMem.options && layerMem.options.attribution;
          if (attr) {
            attributions.push(attr);
          }
        }
      }
    }
    return attributions;
  }

  private async _setupMap() {

    this.mapAdapter.displayProjection = this.displayProjection;
    this.mapAdapter.lonlatProjection = this.lonlatProjection;

    this.mapAdapter.create(this.options);
    this._zoomToInitialExtent();

    await this._addLayerProviders();
    await this._onLoadSync();

    this._emitLoadEvent('build-map', this.mapAdapter);
    return this;
  }

  private _zoomToInitialExtent() {
    if (this._extent) {
      this.mapAdapter.fit(this._extent);
    } else if (this.options.bounds) {
      this.fitBounds(this.options.bounds);
    } else {
      const { center, zoom } = this.options;
      this.setView(center, zoom);
    }
  }

  private async _addLayerProviders() {
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

  private async _onLoadSync() {
    try {
      for await (const kit of this._starterKits) {
        if (kit.onLoadSync) {
          await kit.onLoadSync.call(kit, this);
        }
      }
    } catch (er) {
      console.error(er);
    }
  }

  private _emitLoadEvent(event: string, data: any) {
    this._eventsStatus[event] = true;
    this.emitter.emit(event, data);
  }

  private async _onLayerClick(options: OnLayerClickOptions) {
    this.emitter.emit('layer:click', options);
    return Promise.resolve(options);
  }

  private _addEventsListeners() {
    // propagate map click event
    this.mapAdapter.emitter.on('click', (ev: MapClickEvent) => this._onMapClick(ev));
  }

  private _onMapClick(ev: MapClickEvent) {
    this.emitter.emit('click', ev);
    this._starterKits.forEach((x) => {
      if (x.onMapClick) {
        x.onMapClick(ev, this);
      }
    });
  }

}
