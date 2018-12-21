import { MapOptions, AppOptions } from './interfaces/WebMapApp';
import { AppSettings, StarterKit } from './interfaces/AppSettings';
import { WebLayerEntry } from './WebLayerEntry';
import { Keys } from './components/keys/Keys';
import { EventEmitter } from 'events';
import { MapAdapter, MapClickEvent, ControlPositions, FitOptions } from './interfaces/MapAdapter';
import { RuntimeParams } from './interfaces/RuntimeParams';
import { deepmerge } from './utils/lang';
import { LayerAdapters, LayerAdapter, OnLayerClickOptions } from './interfaces/LayerAdapter';
import { Type } from './utils/Type';
import { MapControl, MapControls, CreateControlOptions, CreateButtonControlOptions } from './interfaces/MapControl';

export interface LayerMem<L = any> {
  id: string;
  layer: L;
  onMap: boolean;
  order?: number;
  baseLayer?: boolean;
  adapter: LayerAdapter;
}

export class WebMap<M = any, L = any, C = any> {

  options: MapOptions;

  displayProjection = 'EPSG:3857';
  lonlatProjection = 'EPSG:4326';

  settings: AppSettings;
  layers: WebLayerEntry;
  emitter = new EventEmitter();
  keys: Keys = new Keys(); // TODO: make injectable cached
  mapAdapter: MapAdapter<M>;
  runtimeParams: RuntimeParams[];

  private DPI = 1000 / 39.37 / 0.28;
  private IPM = 39.37;

  private settingsIsLoading = false;
  private _starterKits: StarterKit[];
  private _baseLayers: string[] = [];
  private _extent: [number, number, number, number];
  private _layers: { [x: string]: LayerMem } = {};
  private _layersIds: number = 1;

  private _selectedLayers: string[] = [];

  constructor(appOptions: AppOptions) {
    this.mapAdapter = appOptions.mapAdapter;
    this._starterKits = appOptions.starterKits || [];

    this._addEventsListeners();
  }

  async create(options: MapOptions): Promise<this> {

    this.options = deepmerge(this.options || {}, options);

    if (!this.settings && this._starterKits.length) {
      try {
        await this.getSettings();
      } catch (er) {
        console.error(er);
      }
    }
    await this._setupMap();
    return this;
  }

  async getSettings(): Promise<AppSettings | Error> {
    if (this.settings) {
      return Promise.resolve(this.settings);
    }
    if (this.settingsIsLoading) {

      return new Promise<AppSettings>((resolve) => {
        const onLoad = (x) => {
          resolve(x);
          this.emitter.removeListener('load-settings', onLoad);
        };
        this.emitter.on('load-settings', onLoad);
      });
    } else {
      this.settingsIsLoading = true;
      let settings: AppSettings | boolean;
      try {
        settings = {};

        for (const kit of this._starterKits.filter((x) => x.getSettings)) {
          const setting = await kit.getSettings.call(kit, this);
          if (setting) {
            Object.assign(settings, setting);
          }
        }
      } catch (er) {
        this.settingsIsLoading = false;
        throw new Error(er);
      }
      if (settings) {
        this.settings = settings;
        this.settingsIsLoading = false;
        this.emitter.emit('load-settings', settings);
        return settings;
      }
    }
  }

  // region MapAdapter methods
  onMapLoad(cb?: any): Promise<void> {
    const mapAdapterOnLoad = this.mapAdapter.onMapLoad;
    if (mapAdapterOnLoad) {
      return mapAdapterOnLoad.call(this.mapAdapter, cb);
    }
    return Promise.resolve(cb);
  }

  async addBaseLayer(
    provider: keyof LayerAdapters | Type<LayerAdapter>,
    options?: any): Promise<LayerAdapter> {

    const layer = await this.addLayer(provider, { ...options }, true);
    if (layer) {
      this._baseLayers.push(layer.name);
    }
    return layer;
  }

  isBaseLayer(layerName: string): boolean {
    return this._baseLayers.indexOf(layerName) !== -1;
  }

  setCenter(lngLat: [number, number]): this {
    this.mapAdapter.setCenter(lngLat);
    return this;
  }

  setZoom(zoom: number): this {
    this.mapAdapter.setZoom(zoom);
    return this;
  }

  getZoom(): number {
    return this.mapAdapter.getZoom();
  }

  setView(lngLat: [number, number], zoom) {
    if (this.mapAdapter.setView) {
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

  // [extent_left, extent_bottom, extent_right, extent_top];
  fit(e: [number, number, number, number], options?: FitOptions): this {
    this.mapAdapter.fit(e, options);
    return this;
  }

  getLayerAdapters(): { [name: string]: Type<LayerAdapter> } {
    return this.mapAdapter.layerAdapters;
  }

  getLayerAdapter(name: string): Type<LayerAdapter> {
    return this.mapAdapter.layerAdapters[name];
  }

  getLayer(layerName: string): LayerMem {
    return this._layers[layerName];
  }

  getLayers(): string[] {
    return Object.keys(this._layers);
  }

  isLayerOnTheMap(layerName: string): boolean {
    const layerMem = this._layers[layerName];
    return layerMem && layerMem.onMap;
  }

  createControl(control: MapControl, options: CreateControlOptions): C {
    if (this.mapAdapter.createControl) {
      return this.mapAdapter.createControl(control, options);
    }
  }

  createButtonControl(options: CreateButtonControlOptions) {
    if (this.mapAdapter.createControl) {
      return this.mapAdapter.createButtonControl(options);
    }
  }

  addControl<K extends keyof MapControls>(
    controlDef: K | MapControl,
    position: ControlPositions,
    options?: MapControls[K]) {

    return this.mapAdapter.addControl(controlDef, position, options);
  }

  async addLayer<K extends keyof LayerAdapters>(
    layerAdapter: K | Type<LayerAdapter>,
    options?: LayerAdapters[K], baselayer?: boolean): Promise<LayerAdapter> {

    let adapterEngine;
    if (typeof layerAdapter === 'string') {
      adapterEngine = this.getLayerAdapter((layerAdapter as string));
    } else {
      adapterEngine = layerAdapter;
    }
    if (adapterEngine) {
      options.onLayerClick = (e) => this._onLayerClick(e);
      const adapter = new adapterEngine(this.mapAdapter.map, options);
      const order = this._layersIds++;
      await this.onMapLoad();

      const layer = await adapter.addLayer(options);

      const layerId = adapter.name;
      const layerOpts: LayerMem = { id: layerId, layer, adapter, onMap: false };
      if (baselayer) {
        layerOpts.baseLayer = true;
        layerOpts.order = 0;
        this._baseLayers.push(layerId);
      } else {
        layerOpts.order = options.order || order;
      }
      this._layers[layerId] = layerOpts;

      return adapter;

    }
    return Promise.reject('No adapter');
  }

  removeLayer(layerName: string) {
    const layerMem = this._layers[layerName];
    if (layerMem) {
      this.mapAdapter.removeLayer(layerMem.layer);
      if (layerMem.baseLayer) {
        const index = this._baseLayers.indexOf(layerName);
        if (index) {
          this._baseLayers.splice(index, 1);
        }
      }
      delete this._layers[layerName];
    }
  }

  showLayer(layerName: string) {
    this.toggleLayer(layerName, true);
  }

  hideLayer(layerName: string) {
    this.toggleLayer(layerName, false);
  }

  setLayerOpacity(layerName: string, value: number) {
    if (this.mapAdapter.setLayerOpacity) {
      const layer = this.getLayer(layerName);
      if (layer) {
        this.mapAdapter.setLayerOpacity(layer.layer, value);
      }
    }
  }

  getScaleForResolution(res, mpu) {
    return parseFloat(res) * (mpu * this.IPM * this.DPI);
  }

  getResolutionForScale(scale, mpu) {
    return parseFloat(scale) / (mpu * this.IPM * this.DPI);
  }

  toggleLayer(layerName: string, status?: boolean) {
    const layer = this._layers[layerName];
    if (status === undefined) {
      status = !layer.onMap;
    }
    const action = (source, l: LayerMem) => {
      l.onMap = status;
      if (status && source) {
        const order = l.baseLayer ? 0 : l.order;
        this.mapAdapter.setLayerOrder(l.layer, order, this._layers);
        if (l.adapter && l.adapter.showLayer) {
          l.adapter.showLayer.call(l.adapter, l.layer);
        } else {
          this.mapAdapter.showLayer(l.layer);
        }
      } else {
        if (l.adapter && l.adapter.hideLayer) {
          l.adapter.hideLayer.call(l.adapter, l.layer);
        } else {
          this.mapAdapter.hideLayer(l.layer);
        }
      }
    };
    if (layer && layer.onMap !== status) {
      if (this.mapAdapter.map) {
        action(this.mapAdapter, layer);
      } else {
        this.mapAdapter.emitter.once('create', (data) => {
          action(data.map, layer);
        });
      }
    }
  }

  requestGeomString(pixel, pixelRadius) {
    return this.mapAdapter.requestGeomString(pixel, pixelRadius);
  }

  onMapClick(evt) {
    const coord = evt.containerPoint;
    const latLng = evt.latlng;
    this.emitter.emit('click', {
      latLng,
      pixel: { left: coord.x, top: coord.y },
      source: evt,
    });
  }

  selectLayer(layerId: string) {
    const layerMem = this.getLayer(layerId);
    if (layerMem && layerMem.adapter.select) {
      layerMem.adapter.select();
    }
    this._selectedLayers.push(layerId);
  }

  unSelectLayer(layerId: string) {
    const layerMem = this.getLayer(layerId);
    if (layerMem && layerMem.adapter.unselect) {
      layerMem.adapter.unselect();
    }
    const index = this._selectedLayers.indexOf(layerId);
    if (index !== -1) {
      this._selectedLayers.splice(index, 1);
    }
  }

  filterLayer(layerId: string, filter: ({ feature, layer }) => boolean) {
    const layer = this.getLayer(layerId);
    if (layer && layer.adapter.filter) {
      layer.adapter.filter(filter);
    }
  }
  // endregion

  // region MAP
  private async _setupMap() {
    if (this.settings) {
      const { extent_bottom, extent_left, extent_top, extent_right } = this.settings;
      if (extent_bottom && extent_left && extent_top && extent_right) {
        this._extent = [extent_left, extent_bottom, extent_right, extent_top];
        const extent = this._extent;
        if (extent[3] > 82) {
          extent[3] = 82;
        }
        if (extent[1] < -82) {
          extent[1] = -82;
        }
      }
    }
    this.mapAdapter.displayProjection = this.displayProjection;
    this.mapAdapter.lonlatProjection = this.lonlatProjection;

    this.mapAdapter.create(this.options);

    this._addTreeLayers();
    await this._addLayerProviders();

    this._zoomToInitialExtent();
    this.emitter.emit('build-map', this.mapAdapter);
    return this;
  }

  private async _addTreeLayers() {
    try {
      const settings = await this.getSettings() as AppSettings;
      if (settings) {
        const rootLayer = settings.root_item;
        if (rootLayer) {
          this.layers = new WebLayerEntry(this, rootLayer);
          this.emitter.emit('add-layers', this.layers);
        }
      }
    } catch (er) {
      console.error(er);
    }
  }

  private _zoomToInitialExtent() {
    if (this._extent) {
      this.mapAdapter.fit(this._extent);
    } else {
      const { center, zoom } = this.options;

      if (center) {
        this.mapAdapter.setCenter(center);
      }
      if (zoom) {
        this.mapAdapter.setZoom(zoom);
      }
    }
  }

  private async _addLayerProviders() {
    try {

      for await (const kit of this._starterKits.filter((x) => x.getLayerAdapters)) {
        const adapters = await kit.getLayerAdapters.call(kit);
        if (adapters) {
          for await (const adapter of adapters) {
            // this.map.layerAdapters[adapter.name] = adapter;
            const newAdapter = await adapter.createAdapter(this.mapAdapter);
            if (newAdapter) {
              this.mapAdapter.layerAdapters[adapter.name] = newAdapter;
            }
          }
        }
      }
    } catch (er) {
      throw new Error(er);
    }
  }
  // endregion

  // region Events
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
  // endregion

}
