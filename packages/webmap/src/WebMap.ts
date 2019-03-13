/**
 * @module webmap
 */

import {
  AdapterOptions,
  DataLayerFilter,
  VectorLayerAdapter,
  LayerAdapters,
  GetPaintFunction,
  GeoJsonAdapterLayerPaint,
  GetPaintCallback,
  GeoJsonAdapterOptions
} from './interfaces/LayerAdapter';
import { LayerAdaptersOptions, LayerAdapter, OnLayerClickOptions } from './interfaces/LayerAdapter';
import { MapAdapter, MapClickEvent, ControlPositions, FitOptions, EventsAlias } from './interfaces/MapAdapter';
import { MapOptions, AppOptions, GetAttributionsOptions } from './interfaces/WebMapApp';
import { LngLatBoundsArray, Type, Cursor, LngLatArray, LayerDef } from './interfaces/BaseTypes';
import { RuntimeParams } from './interfaces/RuntimeParams';
import { StarterKit } from './interfaces/StarterKit';

import {
  MapControl,
  MapControls,
  CreateControlOptions,
  ButtonControlOptions,
  ToggleControlOptions
} from './interfaces/MapControl';

import { Keys } from './components/keys/Keys';
import { Feature, GeoJsonObject } from 'geojson';

import StrictEventEmitter from 'strict-event-emitter-types';
import { EventEmitter } from 'events';
import { WebMapEvents } from './interfaces/Events';

import { onLoad } from './util/decorators';
import { deepmerge } from './util/lang';
import { createButtonControl } from './components/controls/ButtonControl';
import { createToggleControl } from './components/controls/ToggleControl';

const OPTIONS: MapOptions = {
  minZoom: 0,
  maxZoom: 21
};

/**
 * @class WebMap
 */
export class WebMap<M = any, L = any, C = any, E extends WebMapEvents = WebMapEvents> {

  static getPaintFunctions?: { [name: string]: GetPaintFunction };

  options: MapOptions = OPTIONS;
  // `WebMapEvents` must be `E` but its not work correct
  readonly emitter: StrictEventEmitter<EventEmitter, WebMapEvents> = new EventEmitter();
  readonly keys: Keys = new Keys(); // TODO: make injectable cached
  readonly mapAdapter: MapAdapter<M>;
  readonly runtimeParams: RuntimeParams[] = [];

  getPaintFunctions = WebMap.getPaintFunctions;

  private readonly _eventsStatus: { [key in keyof E]?: boolean } = {};

  private _layersIds: number = 1;
  private _extent?: LngLatBoundsArray;
  private readonly _starterKits: StarterKit[];
  private readonly _baseLayers: string[] = [];
  private readonly _layers: { [x: string]: LayerAdapter } = {};
  private readonly _selectedLayers: string[] = [];

  constructor(appOptions: AppOptions) {
    this.mapAdapter = appOptions.mapAdapter;
    this._starterKits = appOptions.starterKits || [];
    if (appOptions.mapOptions) {
      this.options = deepmerge(OPTIONS || {}, appOptions.mapOptions);
    }
    this._addEventsListeners();
    if (appOptions.create) {
      this.create(this.options);
    }
  }

  /**
   * Manual way to create a map. On default
   * @example
   * ```javascript
   * const webMap = new WebMap(options);
   * // options.create === false
   * webMap.create(mapOptions).then(() => doSomething());
   * ```
   */
  async create(options?: MapOptions): Promise<this> {
    if (!this.getEventStatus('create')) {
      this.options = deepmerge(OPTIONS || {}, options);
      await this._setupMap();
      this._emitStatusEvent('create', this);
    }
    return this;
  }

  /**
   * Returns the HTML element that contains the map.
   * @returns The map's container
   */
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

  /**
   * Set the cursor icon to be displayed when hoverion on the map container.
   * @param cursor available cursor name from https://developer.mozilla.org/ru/docs/Web/CSS/cursor
   */
  setCursor(cursor: Cursor) {
    if (this.mapAdapter.setCursor) {
      this.mapAdapter.setCursor(cursor);
    }
  }

  /**
   * Set the center of the current view.
   * @param lngLat Array of two numbers representing longitude and latitude of the center of the map view.
   *
   * @example
   * ```javascript
   * // Mount Everest 27° 59′ 17″ N, 86° 55′ 31″ E
   * webMap.setCenter([86.925278, 27.988056]);
   * ```
   */
  setCenter(lngLat: LngLatArray): this {
    this.mapAdapter.setCenter(lngLat);
    return this;
  }

  /**
   * Returns the map's geographical centerpoint.
   * @return lngLat Array of two numbers representing longitude and latitude of the center of the map view.
   *
   * @example
   * ```javascript
   * // Mount Everest 27° 59′ 17″ N, 86° 55′ 31″ E
   * webMap.getCenter(); // [86.925278, 27.988056]
   * ```
   */
  getCenter(): LngLatArray | undefined {
    return this.mapAdapter.getCenter();
  }

  /**
   * Zoom to a specific zoom level.
   * @param zoom The zoom level to set (0-24).
   */
  setZoom(zoom: number): this {
    this.mapAdapter.setZoom(zoom);
    return this;
  }

  /**
   * Returns the map's current zoom level.
   * @return The map's current zoom level (0-24).
   */
  getZoom(): number | undefined {
    return this.mapAdapter.getZoom();
  }

  /**
   * Sets the view of the map geographical center and zoom
   * @param lngLat Array of two numbers representing longitude and latitude of the center of the map view.
   * @param zoom The zoom level to set (0-24).
   *
   * @example
   * ```javascript
   * // Mount Everest 27° 59′ 17″ N, 86° 55′ 31″ E
   * webMap.setView([86.925278, 27.988056], 12)
   * ```
   */
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
  /**
   * Sets a map view that contains the given geographical bounds.
   * @param bounds Array of coordinates, measured in degrees, in [west, south, east, north] order.
   * @param options
   *
   * @example
   * ```javascript
   * // Whall world
   * webMap.fitBounds([0, -90, 180, 90]);
   * ```
   */
  fitBounds(bounds: LngLatBoundsArray, options?: FitOptions): this {
    this.mapAdapter.fit(bounds, options);
    return this;
  }

  /**
   * Try to fit map view by given layer bounds.
   * But not all layers have borders
   * @param layerDef
   */
  async fitLayer(layerDef: LayerDef) {
    const layer = this.getLayer(layerDef);
    if (layer && layer.getExtent) {
      const extent = await layer.getExtent();
      if (extent) {
        this.fitBounds(extent);
      }
    }
  }

  /**
   * Check if given layer is baselayer
   * @param layerName Check
   */
  isBaseLayer(layerDef: LayerDef): boolean | undefined {
    const layer = this.getLayer(layerDef);
    if (layer && layer.id) {
      return this._baseLayers.indexOf(layer.id) !== -1;
    }
    return undefined;
  }

  getLayerAdapters(): { [name: string]: Type<LayerAdapter> } {
    return this.mapAdapter.layerAdapters;
  }

  getLayerAdapter(name: string): Type<LayerAdapter> {
    return this.mapAdapter.layerAdapters[name];
  }

  /**
   * Helper method to return added layer object by any definition type.
   */
  getLayer(layerDef: LayerDef): LayerAdapter | undefined {
    if (typeof layerDef === 'string') {
      return this._layers[layerDef];
    }
    return layerDef;
  }

  /**
   * Helper method to return added layer identificator by any definition type.
   */
  getLayerId(layerDef: LayerDef): string | undefined {
    const layer = this.getLayer(layerDef);
    if (layer && layer.options) {
      return layer.options.id;
    } else {
      throw new Error('No id for layer');
    }
  }

  /**
   * Return array of all added layer identificators.
   */
  getLayers(): string[] {
    return Object.keys(this._layers);
  }

  /**
   * Check if the given layer on the map
   */
  isLayerVisible(layerDef: LayerDef): boolean {
    const layer = this.getLayer(layerDef);
    return layer && layer.options.visibility !== undefined ? layer.options.visibility : false;
  }

  /**
   * Shortcut method to create base layer
   * @param adapter
   * @param options
   */
  async addBaseLayer<K extends keyof LayerAdapters, O extends AdapterOptions = AdapterOptions>(
    adapter: K | Type<LayerAdapters[K]>,
    options: O | LayerAdaptersOptions[K]): Promise<LayerAdapter> {

    const layer = await this.addLayer(adapter, {
      ...options,
      baseLayer: true
    });

    return layer;
  }

  /**
   * Registration of map layer.
   *
   * @param adapter The name of layer adapter from [MapAdapter.layerAdapters](webmap#MapAdapter.layerAdapters).
   *                May be custom object or class implemented by [BaseLayerAdapter](webmap#BaseLayerAdapter).
   * @param options Specific options for given adapter
   *
   * @example
   * ```javascript
   * webMap.addLayer('TILE', options);
   * webMap.addLayer(CustomLayerAdapter, options);
   * ```
   */
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
      const order = this._layersIds++;

      this._updateGeoJsonOptions(options as GeoJsonAdapterOptions);

      const { maxZoom, minZoom } = this.options;

      options = {
        id: String(order),
        order,
        maxZoom,
        minZoom,
        ...options
      };
      // options.visibility is a layer global state, but each layer on init is not visible
      const visibility = options.visibility;
      options.visibility = false;

      if (options.baseLayer) {
        options.order = 0;
      }

      const _adapter = new adapterEngine(this.mapAdapter.map, options);
      this.emitter.emit('layer:pre-add', _adapter);
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

        if (visibility) {
          this.showLayer(layerId);
        }
      }
      this.emitter.emit('layer:add', _adapter);
      return _adapter;

    }
    return Promise.reject('No adapter');
  }

  /**
   * Remove all layer from map and memory.
   */
  removeLayers(cb?: (layer: string) => boolean) {
    for (const l in this._layers) {
      if (this._layers.hasOwnProperty(l)) {
        let allow = true;
        if (cb) {
          allow = cb(l);
        }
        if (allow) {
          this.removeLayer(l);
          delete this._layers[l];
        }
      }
    }
  }

  /**
   * Remove specific layer from map and memory by its definition.
   * @param layerDef
   */
  removeLayer(layerDef: LayerDef) {
    const layer = this.getLayer(layerDef);
    const layerId = layer && this.getLayerId(layer);
    if (layer && layerId) {
      this.emitter.emit('layer:pre-remove', layer);
      this.mapAdapter.removeLayer(layer.layer);
      if (layer.options.baseLayer) {
        const index = this._baseLayers.indexOf(layerId);
        if (index) {
          this._baseLayers.splice(index, 1);
        }
      }
      delete this._layers[layerId];
      this.emitter.emit('layer:remove', layer);
    }
  }

  /**
   * Show added layer on the map by it definition.
   */
  showLayer(layerDef: LayerDef) {
    this.toggleLayer(layerDef, true);
  }

  /**
   * Hide added layer on the map by it definition.
   */
  hideLayer(layerDef: LayerDef) {
    this.toggleLayer(layerDef, false);
  }

  /**
   * Change added layer visibility on the map by given status or inverse current status.
   *
   * @example
   * ```javascript
   * webMap.addLayer('TILE', {id: 'my_layer', url: ''}).then((layer) => {
   *   webMap.toggleLayer(layer, true);
   *   webMap.toggleLayer('my_layer', false);
   *   webMap.toggleLayer('my_layer');
   *   webMap.isLayerVisible(layer); // true
   * });
   * ```
   */
  toggleLayer(layerDef: LayerDef, status?: boolean) {
    const layer = this.getLayer(layerDef);
    const onMap = layer && layer.options.visibility;
    const toStatus = status !== undefined ? status : !onMap;

    const action = (source: any, l: LayerAdapter) => {
      l.options.visibility = toStatus;

      const preEventName = toStatus ? 'layer:pre-show' : 'layer:pre-hide';
      const eventName = toStatus ? 'layer:show' : 'layer:hide';

      this.emitter.emit(preEventName, l);
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
      this.emitter.emit(eventName, l);
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

  setLayerOpacity(layerName: string, value: number) {
    if (this.mapAdapter.setLayerOpacity) {
      const layer = this.getLayer(layerName);
      if (layer) {
        this.mapAdapter.setLayerOpacity(layer.layer, value);
      }
    }
  }

  // requestGeomString(pixel: Pixel, pixelRadius: number) {
  //   if (this.mapAdapter.requestGeomString) {
  //     return this.mapAdapter.requestGeomString(pixel, pixelRadius);
  //   }
  // }

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
  createToggleControl(options: ToggleControlOptions): C | undefined {
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

  getEventStatus(eventName: keyof E): boolean {
    // ugly hack to disable type checking error
    const _eventName = eventName as keyof WebMapEvents;
    const status = this._eventsStatus[_eventName];
    return status !== undefined ? status : false;
  }

  onMapClick(evt: MapClickEvent) {
    this.emitter.emit('click', evt);
  }

  protected _emitStatusEvent(eventName: keyof E, data?: any) {
    // ugly hack to disable type checking error
    const _eventName = eventName as keyof WebMapEvents;
    this._eventsStatus[_eventName] = true;
    this.emitter.emit(_eventName, data);
  }

  protected onMapLoad(cb?: (mapAdapter: MapAdapter) => void): Promise<MapAdapter> {
    return new Promise((resolve) => {
      const _resolve = () => {
        const mapAdapter = this.mapAdapter;
        if (cb) {
          cb(mapAdapter);
        }
        if (mapAdapter) {
          resolve(mapAdapter);
        }
      };
      if (this.mapAdapter.map) {
        _resolve();
      } else {
        this.mapAdapter.emitter.once('create', () => {
          _resolve();
        });
      }
    });
  }

  private async _setupMap() {

    this.mapAdapter.create(this.options);
    this._zoomToInitialExtent();

    await this._addLayerProviders();
    await this._onLoadSync();

    this._emitStatusEvent('build-map', this.mapAdapter);
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

  private _updateGeoJsonOptions(options: GeoJsonAdapterOptions) {
    const onLayerClickFromOpt = options.onLayerClick;
    options.onLayerClick = (e) => {
      if (onLayerClickFromOpt) {
        onLayerClickFromOpt(e);
      }
      return this._onLayerClick(e);
    };
    if (options.paint) {
      options.paint = this._updatePaintOptionFromCallback(options.paint);
    }
    if (options.selectedPaint) {
      options.selectedPaint = this._updatePaintOptionFromCallback(options.selectedPaint);
    }
  }

  private _updatePaintOptionFromCallback(paint: GeoJsonAdapterLayerPaint | GetPaintCallback) {
    if (typeof paint !== 'function' && paint.type === 'get-paint') {
      if (typeof paint.from === 'function') {
        paint = paint.from(paint.options);
      } else if (typeof paint.from === 'string' && this.getPaintFunctions) {
        const from = this.getPaintFunctions[paint.from];
        if (from) {
          paint = from(paint.options);
        }
      }
    }
    return paint;
  }

  private async _onLayerClick(options: OnLayerClickOptions) {
    this.emitter.emit('layer:click', options);
    return Promise.resolve(options);
  }

  private _addEventsListeners() {
    // propagate map click event
    const specialEvents: Array<keyof WebMapEvents> = this.mapAdapter.specialEvents || ['click'];

    specialEvents.forEach((x) => {
      this.mapAdapter.emitter.on(x, (data) => {
        this.emitter.emit(x, data);
      });
    });
    this.onMapLoad().then(() => {
      // universal events
      const events: EventsAlias = this.mapAdapter.universalEvents || [
        'zoomstart',
        'zoom',
        'zoomend',
        'movestart',
        'move',
        'moveend',
      ];
      events.forEach((e) => {
        let nativeName: string;
        let webMapName: keyof WebMapEvents;
        if (Array.isArray(e)) {
          nativeName = e[0];
          webMapName = e[1];
        } else {
          nativeName = webMapName = e;
        }
        const map = this.mapAdapter.map && this.mapAdapter.map;
        // @ts-ignore
        const mapEmitter = map && map.on;

        if (mapEmitter) {
          mapEmitter.call(map, nativeName, (data: any) => {
            this.emitter.emit(webMapName, this);
          });
        }
      });
    });
  }

}
