/**
 * @module webmap
 */
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
import {
  LngLatBoundsArray,
  Type,
  Cursor,
  LngLatArray
} from './interfaces/BaseTypes';
import { RuntimeParams } from './interfaces/RuntimeParams';
import { StarterKit } from './interfaces/StarterKit';

import { createToggleControl } from './components/controls/ToggleControl';

import { Keys } from './components/keys/Keys';

import StrictEventEmitter from 'strict-event-emitter-types';
import { EventEmitter } from 'events';
import { WebMapEvents, BaseMapEvents } from './interfaces/Events';

import { onLoad } from './util/decorators';
import { propertiesFilter } from './util/propertiesFilter';
import { clearObject } from './util/clearObject';
import { getBoundsPolygon } from './util/getBoundsPolygon';

import {
  detectGeometryType,
  findMostFrequentGeomType
} from './util/geometryTypes';
import { updateGeoJsonAdapterOptions } from './util/updateGeoJsonAdapterOptions';

import { CenterState } from './components/mapStates/CenterState';
import { ZoomState } from './components/mapStates/ZoomState';
import { StateItem } from './components/mapStates/StateItem';
import { Feature, Polygon } from 'geojson';

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
export class BaseWebMap<
  M = any,
  L = any,
  C = any,
  E extends WebMapEvents = WebMapEvents
> {
  static keys: Keys = new Keys();
  static utils = {
    detectGeometryType,
    findMostFrequentGeomType,
    updateGeoJsonAdapterOptions,
    propertiesFilter,
    createToggleControl,
    getBoundsPolygon
  };
  static getPaintFunctions: { [name: string]: GetPaintFunction };
  static decorators = { onLoad };

  options: MapOptions = OPTIONS;
  // `WebMapEvents` must be `E` but its not work correct
  readonly emitter: StrictEventEmitter<
    EventEmitter,
    WebMapEvents
  > = new EventEmitter();
  readonly keys = BaseWebMap.keys;

  readonly mapAdapter: MapAdapter<M>;
  readonly runtimeParams: RuntimeParams[] = [];

  getPaintFunctions = BaseWebMap.getPaintFunctions;
  mapState: Type<StateItem>[] = [CenterState, ZoomState];

  /**
   * From runtime params
   */
  protected _initMapState: Record<string, any> = {};
  protected readonly _starterKits: StarterKit[];
  private _mapState: StateItem[] = [];
  private _extent?: LngLatBoundsArray;
  private readonly _eventsStatus: { [key in keyof E]?: boolean } = {};

  private readonly _mapEvents: Record<string, (...args: any[]) => void> = {};

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

  getBoundsPolygon(): Feature<Polygon> | undefined {
    const bounds = this.getBounds();
    if (bounds) {
      const feature = getBoundsPolygon(bounds);
      return feature;
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
    this.mapAdapter.fitBounds(bounds, options);
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
      const isLoaded =
        this.mapAdapter.isLoaded !== undefined
          ? this.mapAdapter.isLoaded
          : true;
      if (this.mapAdapter.map && isLoaded) {
        _resolve();
      } else {
        this.mapAdapter.emitter.once('create', () => {
          _resolve();
        });
      }
    });
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
    const stop = () => ({});
    return { stop };
  }

  protected _emitStatusEvent(eventName: keyof E, data?: any) {
    // ugly hack to disable type checking error
    const _eventName = eventName as keyof WebMapEvents;
    this._eventsStatus[_eventName] = true;
    this.emitter.emit(_eventName, data);
  }

  protected async _addLayerProviders(): Promise<void> {
    //
  }

  protected async _onLoadSync(): Promise<void> {
    //
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
      this.fitBounds(this._extent);
    } else if (center && zoom) {
      this.setView(center, zoom);
    } else if (bounds) {
      this.fitBounds(bounds);
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
    const events: (keyof BaseMapEvents)[] = [
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
        if (this._eventsStatus) {
          this.emitter.emit(x, data);
        }
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
