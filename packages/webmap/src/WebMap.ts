/**
 * @module webmap
 */
// import { mix } from 'ts-mixer';
import { deepmerge } from '@nextgis/utils';
import { GetPaintFunction } from './interfaces/LayerAdapter';
import { LayerAdapter } from './interfaces/LayerAdapter';
import {
  MapAdapter,
  FitOptions,
  LocateOptions,
  LocationEvents,
  Locate
} from './interfaces/MapAdapter';
import { MapOptions, AppOptions } from './interfaces/WebMapApp';
import { LngLatBoundsArray, Cursor, LngLatArray } from './interfaces/BaseTypes';
import { RuntimeParams } from './interfaces/RuntimeParams';
import { StarterKit } from './interfaces/StarterKit';

import { createToggleControl } from './components/controls/ToggleControl';

import { Keys } from './components/keys/Keys';

import StrictEventEmitter from 'strict-event-emitter-types';
import { EventEmitter } from 'events';
import { WebMapEvents } from './interfaces/Events';

import { onLoad } from './util/decorators';
import { clearObject } from './util/clearObject';
import { detectGeometryType, findMostFrequentGeomType } from './util/geometryTypes';

import { CenterState } from './components/mapStates/CenterState';
import { ZoomState } from './components/mapStates/ZoomState';
import { StateItem } from './components/mapStates/StateItem';

import {
  LayerAdapters,
  AdapterConstructor,
  LayerAdaptersOptions,
  AdapterOptions,
  GeoJsonAdapterOptions,
  VectorLayerAdapter,
  DataLayerFilter,
  OnLayerClickOptions,
  PropertiesFilter,
  FilterOptions,
  LayerDefinition
} from './interfaces/LayerAdapter';
import { LayerDef, Type } from './interfaces/BaseTypes';

import { Feature, GeoJsonObject } from 'geojson';
import { preparePaint } from './util/preparePaint';
import { updateGeoJsonAdapterOptions } from './util/updateGeoJsonAdapterOptions';
import { GetAttributionsOptions, ToggleLayerOptions } from './interfaces/WebMapApp';
import { propertiesFilter } from './util/propertiesFilter';

import {
  MapControl,
  CreateControlOptions,
  ButtonControlOptions,
  ToggleControlOptions,
  ToggleControl,
  MapControls
} from './interfaces/MapControl';

import { ControlPositions } from './interfaces/MapAdapter';

const OPTIONS: MapOptions = {
  minZoom: 0,
  maxZoom: 21,
  paint: {
    color: 'blue',
    opacity: 1,
    radius: 8,
    weight: 1
  },
  selectedPaint: {
    color: 'darkblue',
    opacity: 1,
    radius: 12,
    weight: 1
  }
};

/**
 * @class WebMap
 */
export class WebMap<M = any, L = any, C = any, E extends WebMapEvents = WebMapEvents> {
  static keys: Keys = new Keys();
  static utils = {
    detectGeometryType,
    findMostFrequentGeomType,
    updateGeoJsonAdapterOptions,
    propertiesFilter,
    createToggleControl
  };
  static getPaintFunctions: { [name: string]: GetPaintFunction };
  static decorators = { onLoad };

  static controls: { [name: string]: (webMap: WebMap, options?: any) => any } = {
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
    }
  };

  // trick to ensure the correct call of WebMap methods in mixins
  webMap = this;

  options: MapOptions = OPTIONS;
  // `WebMapEvents` must be `E` but its not work correct
  readonly emitter: StrictEventEmitter<EventEmitter, WebMapEvents> = new EventEmitter();
  readonly keys = WebMap.keys;

  readonly mapAdapter: MapAdapter<M>;
  readonly runtimeParams: RuntimeParams[] = [];

  getPaintFunctions = WebMap.getPaintFunctions;
  mapState: Array<Type<StateItem>> = [CenterState, ZoomState];

  /**
   * From runtime params
   */
  protected _initMapState: Record<string, any> = {};
  private _mapState: StateItem[] = [];
  private _extent?: LngLatBoundsArray;
  private readonly _eventsStatus: { [key in keyof E]?: boolean } = {};
  private readonly _starterKits: StarterKit[];
  private readonly _mapEvents: Record<string, (...args: any[]) => void> = {};

  private _layersIds = 1;
  private readonly _baseLayers: string[] = [];
  private readonly _layers: { [id: string]: LayerAdapter } = {};
  private readonly _selectedLayers: string[] = [];

  constructor(appOptions: AppOptions) {
    this.mapAdapter = appOptions.mapAdapter;
    this._starterKits = appOptions.starterKits || [];
    if (appOptions.mapOptions) {
      this.options = deepmerge(OPTIONS || {}, appOptions.mapOptions);
    }
    if (appOptions.runtimeParams) {
      this.runtimeParams = appOptions.runtimeParams;
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
   * webMap.create(mapOptions).then(() => doSomething());
   * ```
   */
  async create(options?: MapOptions): Promise<this> {
    if (!this.getEventStatus('create')) {
      this.options = deepmerge(OPTIONS || {}, options);
      await this._setInitMapState(this.mapState);
      await this._setupMap();
      this._emitStatusEvent('create', this);
    }
    return this;
  }

  setRuntimeParams(params: RuntimeParams) {
    this.runtimeParams.push(params);
  }

  /**
   * Destroys WebMap, MapAdapter, clears all layers and turn off all event listeners
   */
  destroy() {
    this._removeEventsListeners();
    clearObject(this._emitStatusEvent);
    if (this.mapAdapter.destroy) {
      this.mapAdapter.destroy();
    }
  }

  getState(): Record<string, any> {
    const state: Record<string, any> = {};
    this._mapState.forEach(x => {
      state[x.name] = x.getValue();
    });
    return state;
  }

  getRuntimeParams(): Record<string, any> {
    const state: Record<string, any> = {};
    this._mapState.forEach(x => {
      for (const r of this.runtimeParams) {
        const val = r.get(x.name);
        if (val !== undefined) {
          state[x.name] = x.parse(val);
          break;
        }
      }
    });
    return state;
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
   * Set the cursor icon to be displayed when hover icon on the map container.
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

  getBounds(): LngLatBoundsArray | undefined {
    if (this.mapAdapter.getBounds) {
      return this.mapAdapter.getBounds();
    }
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
   * Checking the status of any asynchronous operation
   * @param event The name of the event whose status is checked
   *
   * @example
   * ```javascript
   * var webMap = new WebMap(options);
   * webMap.getEventStatus('create'); // false
   * webMap.emitter.on('create', function () {
   *   webMap.getEventStatus('create'); // true
   * })
   * ```
   */
  getEventStatus(event: keyof E): boolean {
    // ugly hack to disable type checking error
    const _eventName = event as keyof WebMapEvents;
    const status = this._eventsStatus[_eventName];
    return status !== undefined ? status : false;
  }

  /**
   * helper method to wait for events to load. By default, card creation is tracked
   * @param event The name of the event whose status is checked
   *
   * @example
   * ```javascript
   * var webMap = new WebMap(options);
   * webMap.onLoad().then(function () {
   *   webMap.getEventStatus('create'); // true
   * })
   *
   * // use async/await syntax
   * async function () {
   *   await webMap.onLoad();
   *   doSomething();
   * }
   *
   * ```
   */
  onLoad(event: keyof WebMapEvents = 'create'): Promise<this> {
    return new Promise(res => {
      if (this.getEventStatus(event)) {
        res(this);
      } else {
        this.emitter.once(event, () => {
          res(this);
        });
      }
    });
  }

  onMapLoad(cb?: (mapAdapter: MapAdapter) => void): Promise<MapAdapter> {
    return new Promise(res => {
      const _resolve = () => {
        const mapAdapter = this.mapAdapter;
        if (cb) {
          cb(mapAdapter);
        }
        if (mapAdapter) {
          res(mapAdapter);
        }
      };
      const isLoaded = this.mapAdapter.isLoaded !== undefined ? this.mapAdapter.isLoaded : true;
      if (this.mapAdapter.map && isLoaded) {
        _resolve();
      } else {
        this.mapAdapter.emitter.once('create', () => {
          _resolve();
        });
      }
    });
  }

  getActiveBaseLayer() {
    const visibleLayerBaseLayer = this.getBaseLayers().find(x => {
      return this.isLayerVisible(x);
    });
    if (visibleLayerBaseLayer) {
      return this.getLayer(visibleLayerBaseLayer);
    }
  }

  getLayerAdapters(): { [name: string]: Type<LayerAdapter> } {
    return this.mapAdapter.layerAdapters;
  }

  getLayerAdapter(name: string): Type<LayerAdapter> {
    const adapter = this.mapAdapter.layerAdapters[name];
    return adapter;
  }

  locate(opt: LocateOptions, events?: LocationEvents): Locate {
    if (this.mapAdapter && this.mapAdapter.locate) {
      return this.mapAdapter.locate(opt, events);
    }
    const stop = () => {};
    return { stop };
  }

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
      const _control = await control;
      return this.webMap.mapAdapter.addControl(_control, position);
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
  async createControl(control: MapControl, options?: CreateControlOptions): Promise<C | undefined> {
    await this.webMap.onLoad('build-map');
    if (this.webMap.mapAdapter.createControl) {
      return this.webMap.mapAdapter.createControl(control, options);
    }
  }

  async createButtonControl(options: ButtonControlOptions): Promise<C | undefined> {
    await this.webMap.onLoad('build-map');
    if (this.webMap.mapAdapter.createButtonControl) {
      return this.webMap.mapAdapter.createButtonControl(options);
    }
  }

  async createToggleControl(
    options: ToggleControlOptions
  ): Promise<(C & ToggleControl) | undefined> {
    await this.webMap.onLoad('build-map');
    if (this.webMap.mapAdapter.createToggleControl) {
      return this.webMap.mapAdapter.createToggleControl(options);
    } else {
      if (this.webMap.mapAdapter.createButtonControl) {
        return WebMap.utils.createToggleControl<C>(
          this.webMap.mapAdapter.createButtonControl,
          options
        );
      }
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
    } else {
      const createFun = WebMap.controls[control];
      if (createFun) {
        return createFun(this.webMap, options);
      }
    }
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
        this.webMap.fitBounds(extent);
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

  getBaseLayers() {
    return this._baseLayers;
  }

  /**
   * Helper method to return added layer object by any definition type.
   */
  getLayer<LA extends LayerAdapter = LayerAdapter>(layerDef: LayerDef): LA | undefined {
    if (typeof layerDef === 'string') {
      return this._layers[layerDef] as LA;
    }
    return layerDef as LA;
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

  findLayer<T extends LayerAdapter = LayerAdapter>(filter: (adapter: T) => boolean): T | undefined {
    for (const l in this._layers) {
      const layerAdapter = this._layers[l] as T;
      const isFit = filter(layerAdapter);
      if (isFit) {
        return layerAdapter;
      }
    }
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
    options: O | LayerAdaptersOptions[K]
  ): Promise<LayerAdapter> {
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
   * webMap.addLayer('TILE', options).then((layer) => webMap.showLayer(layer));
   *
   * webMap.addLayer(CustomLayerAdapter, options);
   * ```
   */
  async addLayer<K extends keyof LayerAdapters, O extends AdapterOptions = AdapterOptions>(
    adapter: K | Type<LayerAdapters[K]> | Promise<Type<LayerAdapters[K]> | undefined>,
    options: O | LayerAdaptersOptions[K],
    order?: number
  ): Promise<LayerAdapter> {
    const _order = order || this._layersIds++;
    let adapterEngine: Type<LayerAdapter> | undefined;
    if (typeof adapter === 'string') {
      adapterEngine = this.webMap.getLayerAdapter(adapter);
    } else if (typeof adapter === 'function') {
      adapterEngine = adapter as Type<LayerAdapter>;
    } else if ('then' in (adapter as Promise<Type<LayerAdapters[K]> | undefined>)) {
      adapterEngine = (await adapter) as Type<LayerAdapters[K]>;
    }

    const geoJsonOptions = options as GeoJsonAdapterOptions;

    this._updateGeoJsonOptions(geoJsonOptions);

    const { maxZoom, minZoom } = this.webMap.options;

    options = {
      id: String(_order),
      order: _order,
      maxZoom,
      minZoom,
      ...options
    };
    // options.visibility is a layer global state, but each layer on init is not visible
    const visibility = options.visibility;
    options.visibility = false;

    // TODO: check usage in adapter constructor and safe remove
    if (options.baseLayer) {
      options.order = 0;
    }
    if (this.webMap.options.onBeforeAddLayer) {
      const modified = this.webMap.options.onBeforeAddLayer({ options, adapter: adapterEngine });
      if (modified) {
        if (modified.options) {
          options = modified.options;
        }
        if (modified.adapter) {
          adapterEngine = modified.adapter;
        }
      }
    }
    if (adapterEngine !== undefined) {
      const _adapter = new adapterEngine(this.webMap.mapAdapter.map, options);

      if (_adapter.options.baseLayer) {
        options.baseLayer = true;
        options.order = 0;
      }

      let layerId = _adapter.options.id;
      if (layerId) {
        this._layers[layerId] = _adapter;
      }
      this.webMap.emitter.emit('layer:preadd', _adapter);
      await this.webMap.onMapLoad();
      const layer = await _adapter.addLayer(options);

      // checking that the original layer was inserted into the adapter anyway
      _adapter.layer = layer;
      // think about how to move `id` to the adapter's constructor,
      // but that it is not required in the options
      _adapter.id = _adapter.options.id;

      layerId = _adapter.options.id;
      if (layerId) {
        if (geoJsonOptions.filter) {
          this.filterLayer(_adapter, geoJsonOptions.filter);
        }
        if (options.baseLayer) {
          this._baseLayers.push(layerId);
        }
        this._layers[layerId] = _adapter;

        if (visibility) {
          this.showLayer(layerId);
        }
      }
      const opacity = options.opacity;
      if (opacity !== undefined && opacity <= 1) {
        this.setLayerOpacity(_adapter, opacity);
      }
      if (options.fit && _adapter.getExtent) {
        const extent = await _adapter.getExtent();
        if (extent) {
          await this.webMap.fitBounds(extent);
        }
      }
      this.webMap.emitter.emit('layer:add', _adapter);
      return _adapter;
    }
    return Promise.reject('No adapter');
  }

  async addLayerFromAsyncAdapter<
    K extends keyof LayerAdapters,
    O extends AdapterOptions = AdapterOptions
  >(
    adapter: AdapterConstructor,
    options: O | LayerAdaptersOptions[K],
    order?: number
  ): Promise<LayerAdapter> {
    const _order = order || this._layersIds++;
    const adapterConstructor = adapter as AdapterConstructor;
    const adapterConstructorPromise = adapterConstructor();
    const adapterEngine = await adapterConstructorPromise;
    if (adapterEngine) {
      return this.addLayer(adapterEngine, options, _order);
    }
    return Promise.reject('No adapter');
  }

  /**
   * Remove all layer from map and memory.
   */
  removeLayers(allowCb?: (layer: string, adapter: LayerAdapter) => boolean) {
    for (const l in this._layers) {
      let allow = true;
      if (allowCb) {
        allow = allowCb(l, this._layers[l]);
      }
      if (allow) {
        this.removeLayer(l);
        delete this._layers[l];
      }
    }
  }

  /**
   * Remove all layers but not remove basemap.
   */
  removeOverlays() {
    this.removeLayers((layerId, layer) => !layer.options.baseLayer);
  }

  /**
   * Remove specific layer from map and memory by its definition.
   * @param layerDef
   */
  removeLayer(layerDef: LayerDef) {
    const layer = this.getLayer(layerDef);
    const layerId = layer && this.getLayerId(layer);
    if (layer && layerId) {
      this.webMap.emitter.emit('layer:preremove', layer);
      if (layer.beforeRemove) {
        layer.beforeRemove();
      }
      if (layer.beforeRemove) {
        layer.beforeRemove();
      }
      if (layer.removeLayer) {
        layer.removeLayer();
      } else {
        this.webMap.mapAdapter.removeLayer(layer.layer);
      }
      if (layer.options && layer.options.baseLayer) {
        const index = this._baseLayers.indexOf(layerId);
        if (index) {
          this._baseLayers.splice(index, 1);
        }
      }
      delete this._layers[layerId];
      this.webMap.emitter.emit('layer:remove', layer);
    }
  }

  /**
   * Create layer from GeoJson data. Set style and behavior for selection.
   *
   * @example
   * ```javascript
   * // Add simple layer
   * webMap.addGeoJsonLayer({ data: geojson, paint: { color: 'red' } });
   *
   * // Add styled by feature property layer with selection behavior
   * webMap.addGeoJsonLayer({
   *   data: geojson,
   *   paint: function (feature) {
   *     return { color: feature.properties.color, opacity: 0.5 }
   *   },
   *  selectedPaint: function (feature) {
   *    return { color: feature.properties.selcolor, opacity: 1 }
   *  },
   *  selectable: true,
   *  multiselect: true
   * });
   *
   * // Add marker layer styled with use [Icons](icons)
   * webMap.addGeoJsonLayer({ data: geojson, paint: webMap.getIcon({ color: 'orange' })});
   *
   * // work with added layer
   * const layer = webMap.addGeoJsonLayer({ data: geojson, id: 'my_layer_name'});
   * // access layer by id
   * webMap.showLayer('my_layer_name');
   * // or access layer by instance
   * webMap.showLayer(layer);
   * ```
   */
  // @onMapLoad()
  async addGeoJsonLayer<K extends keyof LayerAdaptersOptions>(
    opt: GeoJsonAdapterOptions,
    adapter?: K | Type<LayerAdapter>
  ) {
    opt = opt || {};
    opt.multiselect = opt.multiselect !== undefined ? opt.multiselect : false;
    opt.unselectOnSecondClick =
      opt.unselectOnSecondClick !== undefined ? opt.unselectOnSecondClick : true;
    if (!adapter) {
      opt = updateGeoJsonAdapterOptions(opt);
    }
    opt.paint = opt.paint || {};
    const layer = await this.addLayer(adapter || 'GEOJSON', opt);
    this.showLayer(layer);
    return layer;
  }

  /**
   * Show added layer on the map by it definition.
   */
  showLayer(layerDef: LayerDef, options: ToggleLayerOptions = {}) {
    this.toggleLayer(layerDef, true, options);
  }

  /**
   * Hide added layer on the map by it definition.
   */
  hideLayer(layerDef: LayerDef, options: ToggleLayerOptions = {}) {
    this.toggleLayer(layerDef, false, options);
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
  toggleLayer(layerDef: LayerDef, status?: boolean, options: ToggleLayerOptions = {}) {
    const layer = this.getLayer(layerDef);
    const onMap = layer && layer.options.visibility;
    const toStatus = status !== undefined ? status : !onMap;
    const silent = options.silent !== undefined ? options.silent : false;
    const action = (source: any, l: LayerAdapter) => {
      l.options.visibility = toStatus;

      const preEventName = toStatus ? 'layer:preshow' : 'layer:prehide';
      const eventName = toStatus ? 'layer:show' : 'layer:hide';
      if (!silent) {
        this.webMap.emitter.emit(preEventName, l);
      }
      if (toStatus && source) {
        const order = l.options.baseLayer ? 0 : l.options.order;

        // do not show baselayer if another on the map
        if (order === 0 && this._baseLayers.length) {
          const anotherVisibleLayerBaseLayer = this._baseLayers.find(x => {
            return x !== l.id && this.isLayerVisible(x);
          });
          if (anotherVisibleLayerBaseLayer) {
            this.hideLayer(anotherVisibleLayerBaseLayer);
          }
        }

        if (l.showLayer) {
          l.showLayer.call(l, l.layer);
        } else {
          this.webMap.mapAdapter.showLayer(l.layer);
        }
        if (order !== undefined) {
          this.webMap.mapAdapter.setLayerOrder(l.layer, order, this._layers);
        }
      } else {
        if (l.hideLayer) {
          l.hideLayer.call(l, l.layer);
        } else {
          this.webMap.mapAdapter.hideLayer(l.layer);
        }
      }
      if (!silent) {
        this.webMap.emitter.emit(eventName, l);
      }
    };
    if (layer && layer.options.visibility !== toStatus) {
      if (this.webMap.mapAdapter.map) {
        action(this.webMap.mapAdapter, layer);
      } else {
        this.webMap.mapAdapter.emitter.once('create', adapter => {
          action(adapter.map, layer);
        });
      }
    }
  }

  updateLayer(layerDef: LayerDef) {
    const layer = this.getLayer(layerDef);
    if (layer && this.isLayerVisible(layer)) {
      this.hideLayer(layer, { silent: true });
      this.showLayer(layer, { silent: true });
    }
  }

  /**
   * Set transparency for a given layer by number from 0 to 1
   */
  setLayerOpacity(layerDef: LayerDef, value: number) {
    const layer = this.getLayer(layerDef);
    if (layer) {
      if (this.webMap.mapAdapter.setLayerOpacity) {
        if (layer) {
          this.webMap.mapAdapter.setLayerOpacity(layer.layer, value);
        }
      }
    }
  }

  // requestGeomString(pixel: Pixel, pixelRadius: number) {
  //   if (this.mapAdapter.requestGeomString) {
  //     return this.mapAdapter.requestGeomString(pixel, pixelRadius);
  //   }
  // }

  /**
   * Mark the layer as selected.
   * If the adapter is a vector layer and supports data selection,
   * you can pass a callback function to specify which data will be selected.
   *
   * @example
   * ```javascript
   * const layer = webMap.addLayer('GEOJSON', {data: geojson}).then((layer) => {
   *   webMap.selectLayer(layer, ({feature}) => feature.id === '42');
   * });
   * ```
   * @param layerDef
   * @param findFeatureFun
   */
  selectLayer(layerDef: LayerDef, findFeatureFun?: DataLayerFilter) {
    const layer = this.getLayer(layerDef);
    if (layer) {
      const adapter = layer as VectorLayerAdapter;
      if (adapter && adapter.select) {
        adapter.select(findFeatureFun);
      }
      const layerId = this.getLayerId(layer);
      if (layerId) {
        this._selectedLayers.push(layerId);
      }
    }
  }

  /**
   * Unselect the given layer.
   * If the adapter is a vector layer and supports data selection,
   * you can pass a callback function to specify which data will be unselected.
   *
   * @example
   * ```javascript
   * const layer = webMap.addLayer('GEOJSON', {data: geojson}).then((layer) => {
   *   webMap.unSelectLayer(layer, ({feature}) => feature.id === '42');
   * });
   * ```
   *
   * @param layerDef
   * @param findFeatureFun
   */
  unSelectLayer(layerDef: LayerDef, findFeatureFun?: DataLayerFilter) {
    const layer = this.getLayer(layerDef);
    if (layer) {
      const adapter = layer && (layer as VectorLayerAdapter);
      if (adapter.unselect) {
        adapter.unselect(findFeatureFun);
      }
      const layerId = this.getLayerId(layer);
      if (layerId) {
        const index = this._selectedLayers.indexOf(layerId);
        if (index !== -1) {
          this._selectedLayers.splice(index, 1);
        }
      }
    }
  }

  /**
   * Hide features from a vector layer using a callback function.
   *
   * @example
   * ```javascript
   * const layer = webMap.addLayer('GEOJSON', {data: geojson}).then((layer) => {
   *   webMap.filterLayer(layer, ({feature}) => feature.id === '42');
   * });
   * ```
   *
   * @param layerDef
   * @param filter
   */
  filterLayer(
    layerDef: LayerDef,
    filter: DataLayerFilter<Feature, L>
  ): LayerDefinition<Feature, L>[] {
    const layer = this.getLayer(layerDef);
    const adapter = layer as VectorLayerAdapter;
    if (adapter.filter) {
      return adapter.filter(filter);
    }
    return [];
  }

  propertiesFilter(layerDef: LayerDef, filters: PropertiesFilter, options?: FilterOptions) {
    const layer = this.getLayer(layerDef);
    const adapter = layer as VectorLayerAdapter;
    if (adapter.propertiesFilter) {
      adapter.propertiesFilter(filters, options);
    } else if (adapter.filter) {
      this.filterLayer(adapter, e => {
        if (e.feature && e.feature.properties) {
          return propertiesFilter(e.feature.properties, filters);
        }
        return true;
      });
    }
  }

  removeLayerFilter(layerDef: LayerDef) {
    const layer = this.getLayer(layerDef);
    const adapter = layer as VectorLayerAdapter;
    if (adapter.removeFilter) {
      adapter.removeFilter();
    } else if (adapter.filter) {
      adapter.filter(() => {
        return true;
      });
    }
  }

  /**
   * Sets the GeoJSON data for given vector layer.
   *
   * @example
   * ```javascript
   * const layer = webMap.addLayer('GEOJSON').then((layer) => {
   *   webMap.setLayerData(layer, geojson);
   * });
   * ```
   */
  setLayerData(layerDef: LayerDef, data: GeoJsonObject) {
    const vectorAdapter = this.getLayer(layerDef);
    const adapter = vectorAdapter as VectorLayerAdapter;
    if (adapter) {
      if (adapter.setData) {
        adapter.setData(data);
      } else if (adapter.clearLayer && adapter.addData) {
        adapter.clearLayer();
        adapter.addData(data);
      }
    }
  }

  /**
   * Push new the GeoJSON features into given vector layer.
   *
   * @example
   * ```javascript
   * const layer = webMap.addLayer('GEOJSON', {data: geojson_features_5}).then((layer) => {
   *   console.log(layer.getLayers().length) // > 5;
   *   webMap.addLayerData(layer, geojson_features_3);
   *   console.log(layer.getLayers().length) // > 8;
   * });
   * ```
   */
  addLayerData(layerDef: LayerDef, data: GeoJsonObject) {
    const layerMem = this.getLayer(layerDef);
    const adapter = layerMem as VectorLayerAdapter;
    if (adapter.addData) {
      adapter.addData(data);
    }
  }

  /**
   * Remove from vector layer all features.
   * it is possible to remove only some objects if you specify a callback function.
   *
   * @example
   * ```javascript
   * const layer = webMap.addLayer('GEOJSON', {data: geojson}).then((layer) => {
   *   webMap.clearLayerData(layer, (feture) => feture.id === 42);
   *   webMap.clearLayerData(layer);
   * });
   * ```
   */
  clearLayerData(layerDef: LayerDef, cb?: (feature: Feature) => boolean) {
    const layerMem = this.getLayer(layerDef);
    const adapter = layerMem as VectorLayerAdapter;
    if (adapter && adapter.clearLayer) {
      adapter.clearLayer(cb);
    }
  }

  getAttributions(options: GetAttributionsOptions): string[] {
    const attributions: string[] = [];
    for (const l in this._layers) {
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

    return attributions;
  }

  private async _onLayerClick(options: OnLayerClickOptions) {
    this.webMap.emitter.emit('layer:click', options);
    return Promise.resolve(options);
  }

  private _updateGeoJsonOptions(options: GeoJsonAdapterOptions) {
    const onLayerClickFromOpt = options.onLayerClick;
    options.onLayerClick = e => {
      if (onLayerClickFromOpt) {
        onLayerClickFromOpt(e);
      }
      return this._onLayerClick(e);
    };
    if (!options.nativePaint) {
      if (this.webMap.options.paint) {
        options.paint = preparePaint(
          options.paint || {},
          this.webMap.options.paint,
          this.webMap.getPaintFunctions
        );
      }
      if (options.selectedPaint && this.webMap.options.selectedPaint) {
        options.selectedPaint = preparePaint(
          options.selectedPaint,
          this.webMap.options.selectedPaint,
          this.webMap.getPaintFunctions
        );
      }
    }
  }

  protected _emitStatusEvent(eventName: keyof E, data?: any) {
    // ugly hack to disable type checking error
    const _eventName = eventName as keyof WebMapEvents;
    this._eventsStatus[_eventName] = true;
    this.emitter.emit(_eventName, data);
  }

  private async _setupMap() {
    await this.mapAdapter.create(this.options);
    this._zoomToInitialExtent();

    await this._addLayerProviders();
    await this._onLoadSync();

    this._emitStatusEvent('build-map', this.mapAdapter);
    return this;
  }

  private _zoomToInitialExtent() {
    const { center, zoom, bounds } = this.options;
    if (this._extent) {
      this.mapAdapter.fit(this._extent);
    } else if (center && bounds) {
      this.setView(center, zoom);
    } else if (bounds) {
      this.fitBounds(bounds);
    }
  }

  private async _addLayerProviders(): Promise<void> {
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

  private async _onLoadSync(): Promise<void> {
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

  private _setInitMapState(states: Type<StateItem>[]) {
    for (const X of states) {
      const state = new X(this);
      this._mapState.push(state);
      for (const r of this.runtimeParams) {
        const str = r.get(state.name);
        if (str !== undefined) {
          const val = state.parse(str);
          // state.setValue(val);
          this._initMapState[state.name] = val;
          this.options[state.name] = val;
          break;
        }
      }
    }
  }

  private _addEventsListeners(): void {
    const events: (keyof WebMapEvents)[] = [
      'click',
      'zoomstart',
      'zoom',
      'zoomend',
      'movestart',
      'move',
      'moveend'
    ];

    events.forEach(x => {
      this._mapEvents[x] = data => {
        if (this.runtimeParams.length) {
          const mapStatusEvent = this._mapState.find(y => y.event === x);
          if (mapStatusEvent) {
            const value = mapStatusEvent.toString(mapStatusEvent.getValue());
            this.runtimeParams.forEach(r => {
              r.set(mapStatusEvent.name, value);
            });
          }
        }
        if (this._eventsStatus) this.emitter.emit(x, data);
      };
      this.mapAdapter.emitter.on(x, this._mapEvents[x]);
    });
  }

  private _removeEventsListeners(): void {
    Object.entries(this._mapEvents).forEach(([x, event]) => {
      this.mapAdapter.emitter.off(x, event);
    });
  }
}
