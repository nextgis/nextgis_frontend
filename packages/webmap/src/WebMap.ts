/**
 * @module webmap
 */

import {
  AdapterOptions,
  DataLayerFilter,
  LayerAdapters,
  GetPaintFunction,
  GeoJsonAdapterOptions,
  AdapterConstructor
} from './interfaces/LayerAdapter';
import { LayerAdaptersOptions, LayerAdapter } from './interfaces/LayerAdapter';
import { MapAdapter, ControlPositions, FitOptions } from './interfaces/MapAdapter';
import { MapOptions, AppOptions, GetAttributionsOptions } from './interfaces/WebMapApp';
import { LngLatBoundsArray, Type, Cursor, LngLatArray, LayerDef } from './interfaces/BaseTypes';
import { RuntimeParams } from './interfaces/RuntimeParams';
import { StarterKit } from './interfaces/StarterKit';

import {
  MapControl,
  MapControls,
  CreateControlOptions,
  ButtonControlOptions,
  ToggleControlOptions,
  ToggleControl
} from './interfaces/MapControl';

import { createToggleControl } from './components/controls/ToggleControl';

import { Keys } from './components/keys/Keys';
import { Feature, GeoJsonObject } from 'geojson';

import StrictEventEmitter from 'strict-event-emitter-types';
import { EventEmitter } from 'events';
import { WebMapEvents } from './interfaces/Events';

import { onLoad } from './util/decorators';
import { deepmerge } from './util/deepmerge';

import { detectGeometryType, findMostFrequentGeomType } from './util/geometryTypes';
import { updateGeojsonAdapterOptions } from './util/updateGeojsonAdapterOptions';

import { WebMapLayers } from './WebMapLayers';
import { WebMapControls } from './WebMapControls';

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
    updateGeojsonAdapterOptions,
    createToggleControl
  };
  static getPaintFunctions: { [name: string]: GetPaintFunction };
  static decorators = { onLoad };
  static controls = WebMapControls.controls;

  options: MapOptions = OPTIONS;
  // `WebMapEvents` must be `E` but its not work correct
  readonly emitter: StrictEventEmitter<EventEmitter, WebMapEvents> = new EventEmitter();
  readonly keys = WebMap.keys;
  readonly mapAdapter: MapAdapter<M>;
  readonly runtimeParams: RuntimeParams[] = [];

  getPaintFunctions = WebMap.getPaintFunctions;

  private readonly layers: WebMapLayers<L>;
  private readonly controls: WebMapControls<C>;

  private _extent?: LngLatBoundsArray;
  private readonly _eventsStatus: { [key in keyof E]?: boolean } = {};
  private readonly _starterKits: StarterKit[];

  constructor(appOptions: AppOptions) {
    this.layers = new WebMapLayers<L>(this);
    this.controls = new WebMapControls<C>(this);
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

  getEventStatus(eventName: keyof E): boolean {
    // ugly hack to disable type checking error
    const _eventName = eventName as keyof WebMapEvents;
    const status = this._eventsStatus[_eventName];
    return status !== undefined ? status : false;
  }

  onLoad(event: keyof WebMapEvents = 'create'): Promise<this> {
    return new Promise((res) => {
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
    return new Promise((res) => {
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

  /**
   * Try to fit map view by given layer bounds.
   * But not all layers have borders
   * @param layerDef
   */
  async fitLayer(layerDef: LayerDef) {
    this.layers.fitLayer(layerDef);
  }

  /**
   * Check if given layer is baselayer
   * @param layerName Check
   */
  isBaseLayer(layerDef: LayerDef): boolean | undefined {
    return this.layers.isBaseLayer(layerDef);
  }

  getActiveBaseLayer() {
    const visibleLayerBaseLayer = this.getBaseLayers().find((x) => {
      return this.isLayerVisible(x);
    });
    if (visibleLayerBaseLayer) {
      return this.getLayer(visibleLayerBaseLayer);
    }
  }

  getBaseLayers() {
    return this.layers.getBaseLayers();
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
    return this.layers.getLayer(layerDef);
  }

  /**
   * Helper method to return added layer identificator by any definition type.
   */
  getLayerId(layerDef: LayerDef): string | undefined {
    return this.layers.getLayerId(layerDef);
  }

  /**
   * Return array of all added layer identificators.
   */
  getLayers(): string[] {
    return this.layers.getLayers();
  }

  findLayer<T extends LayerAdapter = LayerAdapter>(filter: (adapter: T) => boolean): T | undefined {
    return this.layers.findLayer<T>(filter);
  }

  /**
   * Check if the given layer on the map
   */
  isLayerVisible(layerDef: LayerDef): boolean {
    return this.layers.isLayerVisible(layerDef);
  }

  /**
   * Shortcut method to create base layer
   * @param adapter
   * @param options
   */
  async addBaseLayer<K extends keyof LayerAdapters, O extends AdapterOptions = AdapterOptions>(
    adapter: K | Type<LayerAdapters[K]>,
    options: O | LayerAdaptersOptions[K]): Promise<LayerAdapter> {

    return this.layers.addBaseLayer<K, O>(adapter, options);
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
    order?: number): Promise<LayerAdapter> {

    return this.layers.addLayer<K, O>(adapter, options, order);
  }

  async addLayerFromAsyncAdapter<K extends keyof LayerAdapters, O extends AdapterOptions = AdapterOptions>(
    adapter: AdapterConstructor,
    options: O | LayerAdaptersOptions[K],
    order?: number
  ): Promise<LayerAdapter> {
    return this.layers.addLayerFromAsyncAdapter<K, O>(adapter, options, order);
  }

  /**
   * Remove all layer from map and memory.
   */
  removeLayers(allowCb?: (layer: string, adapter: LayerAdapter) => boolean) {
    this.layers.removeLayers(allowCb);
  }

  /**
   * Remove all layers but not remove basemap.
   */
  removeOverlays() {
    this.layers.removeOverlays();
  }

  /**
   * Remove specific layer from map and memory by its definition.
   * @param layerDef
   */
  removeLayer(layerDef: LayerDef) {
    this.layers.removeLayer(layerDef);
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
    adapter?: K | Type<LayerAdapter>) {

    return this.layers.addGeoJsonLayer(opt, adapter);
  }

  /**
   * Show added layer on the map by it definition.
   */
  showLayer(layerDef: LayerDef) {
    return this.layers.showLayer(layerDef);
  }

  /**
   * Hide added layer on the map by it definition.
   */
  hideLayer(layerDef: LayerDef) {
    this.layers.hideLayer(layerDef);
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
    this.layers.toggleLayer(layerDef, status);
  }

  updateLayer(layerDef: LayerDef) {
    this.layers.updateLayer(layerDef);
  }

  /**
   * Set transparency for a given layer by number from 0 to 1
   */
  setLayerOpacity(layerDef: LayerDef, value: number) {
    this.layers.setLayerOpacity(layerDef, value);
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
    this.layers.selectLayer(layerDef, findFeatureFun);
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
    this.layers.unSelectLayer(layerDef, findFeatureFun);
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
  filterLayer(layerDef: LayerDef, filter: DataLayerFilter<Feature, L>) {
    this.layers.filterLayer(layerDef, filter);
  }

  removeLayerFilter(layerDef: LayerDef) {
    this.layers.removeLayerFilter(layerDef);
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
    this.layers.setLayerData(layerDef, data);
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
    this.layers.addLayerData(layerDef, data);
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
    this.layers.clearLayerData(layerDef, cb);
  }

  getAttributions(options: GetAttributionsOptions): string[] {
    return this.layers.getAttributions(options);
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
    return this.controls.createControl(control, options);
  }

  async createButtonControl(options: ButtonControlOptions): Promise<C | undefined> {
    return this.controls.createButtonControl(options);
  }

  async createToggleControl(options: ToggleControlOptions): Promise<(C & ToggleControl) | undefined> {
    return this.controls.createToggleControl(options);
  }

  removeControl(control: any) {
    this.controls.removeControl(control);
  }

  getControl<K extends keyof MapControls>(control: K, options?: MapControls[K]): C | undefined {
    return this.controls.getControl<K>(control, options);
  }

  async addControl<K extends keyof MapControls>(
    controlDef: K | C,
    position: ControlPositions,
    options?: MapControls[K]) {

    return this.controls.addControl<K>(controlDef, position, options);
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

  private _addEventsListeners() {
    // propagate map click event
    const events: Array<keyof WebMapEvents> = [
      'click',
      'zoomstart',
      'zoom',
      'zoomend',
      'movestart',
      'move',
      'moveend'
    ];

    events.forEach((x) => {
      this.mapAdapter.emitter.on(x, (data) => {
        this.emitter.emit(x, data);
      });
    });
    this.onMapLoad().then(() => {
      // universal events
    });
  }

}
