import { MapOptions, AppOptions } from './interfaces/WebMapApp';
import { AppSettings, StarterKit } from './interfaces/AppSettings';
import { BaseMapAdapter } from './interfaces/MapAdapter';
import { WebLayerEntry } from './WebLayerEntry';
import { Keys } from './components/keys/Keys';
import { EventEmitter } from 'events';
import { MapAdapter, MapClickEvent } from './interfaces/MapAdapter';
import { RuntimeParams } from './interfaces/RuntimeParams';
import { deepmerge } from './utils/lang';
import { LayerAdapters, LayerAdapter } from './interfaces/LayerAdapter';
import { Type } from './utils/Type';

interface LayerMem {
  layer: any;
  onMap: boolean;
  order?: number;
  baseLayer?: boolean;
}

export class WebMap<M = any> implements BaseMapAdapter {

  options: MapOptions;

  displayProjection = 'EPSG:3857';
  lonlatProjection = 'EPSG:4326';

  settings: AppSettings;
  layers: WebLayerEntry;
  emitter = new EventEmitter();
  keys: Keys = new Keys(); // TODO: make injectable cashed
  map: MapAdapter<M>;
  runtimeParams: RuntimeParams[];

  private settingsIsLoading = false;
  private _starterKits: StarterKit[];
  private _baseLayers: string[] = [];
  private _extent: [number, number, number, number];
  private _layers: { [x: string]: LayerMem } = {};

  constructor(appOptions: AppOptions) {
    this.map = appOptions.mapAdapter;
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

  async addBaseLayer(
    layerName: string,
    provider: keyof LayerAdapters | Type<LayerAdapter>,
    options?: any): Promise<LayerAdapter> {

    const layer = await this.map.addLayer(provider, { ...options, ...{ id: layerName } }, true);
    if (layer) {
      this._baseLayers.push(layer.name);
    }
    return layer;
  }

  isBaseLayer(layerName: string): boolean {
    return this._baseLayers.indexOf(layerName) !== -1;
  }

  // region MapAdapter methods
  setCenter(lngLat: [number, number]): this {
    this.map.setCenter(lngLat);
    return this;
  }

  setZoom(zoom: number): this {
    this.map.setZoom(zoom);
    return this;
  }

  // [extent_left, extent_bottom, extent_right, extent_top];
  fit(e: [number, number, number, number]): this {
    this.map.fit(e);
    return this;
  }

  getLayerAdapter(name: string): Type<LayerAdapter> {
    return this.map.layerAdapters[name];
  }

  getLayer(layerName: string) {
    return this._layers[layerName] !== undefined;
  }

  getLayers(): string[] {
    return Object.keys(this._layers);
  }

  isLayerOnTheMap(layerName: string): boolean {
    const layerMem = this._layers[layerName];
    return layerMem.onMap;
  }

  addControl(controlDef, position, options) {
    return this.map.addControl(controlDef, position, options);
  }

  addLayer(adapterDef, options?, baselayer?: boolean) {

    let adapterEngine;
    if (typeof adapterDef === 'string') {
      adapterEngine = this.getLayerAdapter(adapterDef);
    } else {
      adapterEngine = adapterDef;
    }
    if (adapterEngine) {
      const adapter = new adapterEngine(this.map, options);
      const layer = adapter.addLayer(options);

      const addlayerFun = adapter.addLayer(options);
      const toResolve = (l) => {
        const layerId = adapter.name;
        const layerOpts: LayerMem = { layer: l, onMap: false };
        if (baselayer) {
          layerOpts.baseLayer = true;
          this._baseLayers.push(layerId);
        } else {
          layerOpts.order = options.order || this._order++;
        }
        this._layers[layerId] = layerOpts;
        // this._length++;

        return adapter;
      };
      return addlayerFun.then ? addlayerFun.then((l) => toResolve(l)) : Promise.resolve(toResolve(layer));
    }
    return Promise.reject('No adapter');
  }

  removeLayer(layerName: string) {
    // ignore
  }

  showLayer(layerName: string) {
    this.toggleLayer(layerName, true);
  }

  hideLayer(layerName: string) {
    this.toggleLayer(layerName, false);
  }

  setLayerOpacity(layerName: string, value: number) {
    // ignore
  }

  getScaleForResolution(res, mpu) {
    return parseFloat(res) * (mpu * this.IPM * this.DPI);
  }

  getResolutionForScale(scale, mpu) {
    return parseFloat(scale) / (mpu * this.IPM * this.DPI);
  }

  toggleLayer(layerName: string, status: boolean) {
    const action = (source: Map, l: LayerMem) => {
      if (status) {
        if (source instanceof Map) {
          l.layer.addTo(source);
          // TODO: set order for any layer
          if (l.layer.setZIndex) {
            const order = l.baseLayer ? 0 : this._length - l.order;
            l.layer.setZIndex(order);
          }
        }
      } else {
        source.removeLayer(l.layer);
      }
      l.onMap = status;
    };
    const layer = this._layers[layerName];
    if (layer && layer.onMap !== status) {
      if (this.map) {
        action(this.map, layer);
      } else {
        this.emitter.once('create', (data) => {
          action(data.map, layer);
        });
      }
    }
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
    this.map.displayProjection = this.displayProjection;
    this.map.lonlatProjection = this.lonlatProjection;

    this.map.create(this.options);

    this._addTreeLayers();
    await this._addLayerProviders();

    this._zoomToInitialExtent();
    this.emitter.emit('build-map', this.map);
    return this;
  }

  private async _addTreeLayers() {
    try {
      const settings = await this.getSettings() as AppSettings;
      if (settings) {
        const rootLayer = settings.root_item;
        if (rootLayer) {
          this.layers = new WebLayerEntry(this.map, rootLayer);
          this.emitter.emit('add-layers', this.layers);
        }
      }
    } catch (er) {
      console.error(er);
    }
  }

  private _zoomToInitialExtent() {
    if (this._extent) {
      this.map.fit(this._extent);
    } else {
      const { center, zoom } = this.options;

      if (center) {
        this.map.setCenter(center);
      }
      if (zoom) {
        this.map.setZoom(zoom);
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
            const newAdapter = await adapter.createAdapter(this.map);
            if (newAdapter) {
              this.map.layerAdapters[adapter.name] = newAdapter;
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
  private _addEventsListeners() {
    // propagate map click event
    this.map.emitter.on('click', (ev: MapClickEvent) => this._onMapClick(ev));
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
