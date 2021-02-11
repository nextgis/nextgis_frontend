import { EventEmitter } from 'events';
import StrictEventEmitter from 'strict-event-emitter-types';
import { Feature, Polygon } from 'geojson';

import {
  deepmerge,
  defined,
  Type,
  getBoundsFeature,
  TileJson,
} from '@nextgis/utils';
import { GetPaintFunction } from '@nextgis/paint';
import CancelablePromise from '@nextgis/cancelable-promise';
import { deprecatedMapClick } from '@nextgis/utils';

import { LngLatBoundsArray, Cursor, LngLatArray } from './interfaces/BaseTypes';
import {
  Locate,
  MapAdapter,
  FitOptions,
  LocateOptions,
  LocationEvents,
  MapClickEvent,
} from './interfaces/MapAdapter';
import { StarterKit } from './interfaces/StarterKit';
import { LayerAdapter } from './interfaces/LayerAdapter';
import { RuntimeParams } from './interfaces/RuntimeParams';
import { MapOptions } from './interfaces/MapOptions';
import { WebMapEvents, MainMapEvents } from './interfaces/Events';

import { Keys } from './components/keys/Keys';
import { CenterState } from './components/mapStates/CenterState';
import { StateItem } from './components/mapStates/StateItem';
import { ZoomState } from './components/mapStates/ZoomState';

import { clearObject } from './utils/clearObject';

type EmitStatusEventData = any;

let ID = 0;

/**
 * @internal
 */
export const WEB_MAP_CONTAINER: Record<number, any> = {};

const OPTIONS: MapOptions = {
  minZoom: 0,
  maxZoom: 21,
  paint: {
    color: 'blue',
    opacity: 0.4,
    strokeOpacity: 1,
    stroke: true,
    radius: 8,
    weight: 1,
  },
  selectedPaint: {
    color: 'darkblue',
    opacity: 0.4,
    strokeOpacity: 1,
    stroke: true,
    radius: 12,
    weight: 1,
  },
  create: true,
};

interface AddEventsListenersOptions {
  include: (keyof MainMapEvents)[];
}

/**
 * @public
 */
export class WebMapMain<
  M = any,
  E extends WebMapEvents = WebMapEvents,
  O extends MapOptions = MapOptions
> {
  static keys: Keys = new Keys();

  static getPaintFunctions: { [name: string]: GetPaintFunction };

  options: O = OPTIONS as O;
  // `WebMapEvents` must be `E` but its not work correct
  readonly emitter: StrictEventEmitter<
    EventEmitter,
    WebMapEvents
  > = new EventEmitter();
  readonly keys = WebMapMain.keys;

  readonly mapAdapter: MapAdapter<M>;
  readonly runtimeParams: RuntimeParams[] = [];

  getPaintFunctions = WebMapMain.getPaintFunctions;
  mapState: Type<StateItem>[] = [CenterState, ZoomState];
  id = ID++;

  /**
   * From runtime params
   */
  protected _initMapState: Record<string, any> = {};
  protected readonly _starterKits: StarterKit[];
  private _mapState: StateItem[] = [];
  private _extent?: LngLatBoundsArray;
  private readonly _eventsStatus: { [key in keyof E]?: boolean } = {};
  private _coordFromMapClickPromise?: CancelablePromise<LngLatArray>;

  private readonly _mapEvents: {
    [key in keyof MainMapEvents]?: (...args: any[]) => void;
  } = {};

  constructor(mapOptions: O) {
    WEB_MAP_CONTAINER[this.id] = this;
    this.mapAdapter = mapOptions.mapAdapter as MapAdapter<M>;
    this._starterKits = mapOptions.starterKits || [];
    if (mapOptions) {
      this.options = deepmerge((OPTIONS as O) || {}, mapOptions) as O;
    }
    if (this.options.runtimeParams) {
      this.runtimeParams = this.options.runtimeParams;
    }
    this._addEventsListeners();

    if (this.options.tileJson) {
      this._setTileJsonOptions(this.options.tileJson);
    }
    if (this.options.create) {
      this.create();
    }
  }

  getId(): number {
    return this.id;
  }

  /**
   * Manual way to create a map (If {@link MapOptions.create} is `false`).
   * @example
   * ```javascript
   * const webMap = new WebMap(options);
   * webMap.create().then(() => doSomething());
   * ```
   */
  async create(): Promise<this> {
    if (!this.getEventStatus('create')) {
      await this._setInitMapState(this.mapState);
      await this._setupMap();
      this._emitStatusEvent('create', this);
    }
    return this;
  }

  setRuntimeParams(params: RuntimeParams): void {
    this.runtimeParams.push(params);
  }

  /**
   * Destroys WebMap, MapAdapter, clears all layers and turn off all event listeners
   */
  destroy(): void {
    this._removeEventListeners();
    clearObject(this._emitStatusEvent);
    if (this.mapAdapter.destroy) {
      this.mapAdapter.destroy();
    }
  }

  getState(): Record<string, any> {
    const state: Record<string, any> = {};
    this._mapState.forEach((x) => {
      state[x.name] = x.getValue();
    });
    return state;
  }

  getRuntimeParams(): Record<string, any> {
    const state: Record<string, any> = {};
    this._mapState.forEach((x) => {
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
   * @param cursor - Available cursor name from https://developer.mozilla.org/ru/docs/Web/CSS/cursor
   */
  setCursor(cursor: Cursor): void {
    if (this.mapAdapter.setCursor) {
      this.mapAdapter.setCursor(cursor);
    }
  }

  getCursor(): Cursor | undefined {
    if (this.mapAdapter.getCursor) {
      return this.mapAdapter.getCursor() as Cursor;
    }
    const container = this.getContainer();
    if (container) {
      return container.style.cursor as Cursor;
    }
  }

  /**
   * Set the center of the current view.
   * @param lngLat - Array of two numbers representing longitude and latitude of the center of the map view.
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
      const feature = getBoundsFeature(bounds);
      return feature;
    }
  }

  /**
   * Zoom to a specific zoom level.
   * @param zoom - The zoom level to set (0-24).
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

  zoomIn(): void {
    if (this.mapAdapter.zoomIn) {
      this.mapAdapter.zoomIn();
    } else {
      const zoom = this.getZoom();
      if (zoom) {
        const toZoom = zoom + 1;
        this.setZoom(toZoom);
      }
    }
  }

  zoomOut(): void {
    if (this.mapAdapter.zoomOut) {
      this.mapAdapter.zoomOut();
    } else {
      const zoom = this.getZoom();
      if (zoom) {
        const toZoom = zoom - 1;
        this.setZoom(toZoom);
      }
    }
  }

  /**
   * Sets the view of the map geographical center and zoom
   * @param lngLat - Array of two numbers representing longitude and latitude of the center of the map view.
   * @param zoom - The zoom level to set (0-24).
   *
   * @example
   * ```javascript
   * // Mount Everest 27° 59′ 17″ N, 86° 55′ 31″ E
   * webMap.setView([86.925278, 27.988056], 12)
   * ```
   */
  setView(lngLat?: LngLatArray, zoom?: number): void {
    if (this.mapAdapter.setView && lngLat && defined(zoom)) {
      this.mapAdapter.setView(lngLat, zoom);
    } else {
      if (lngLat) {
        this.mapAdapter.setCenter(lngLat);
      }
      if (defined(zoom)) {
        this.mapAdapter.setZoom(zoom);
      }
    }
  }

  /**
   * Sets a map view that contains the given geographical bounds.
   * @param bounds - Array of coordinates, measured in degrees, in [west, south, east, north] order.
   *
   * @example
   * ```javascript
   * // Whole world
   * webMap.fitBounds([0, -90, 180, 90]);
   * ```
   */
  fitBounds(bounds: LngLatBoundsArray, options?: FitOptions): this {
    if (bounds.every((x) => defined(x))) {
      if (bounds[1] < -85.06) {
        bounds[1] = -85.06;
      }
      if (bounds[3] > 85.06) {
        bounds[3] = 85.06;
      }
      this.mapAdapter.fitBounds(bounds, options);
    }
    return this;
  }

  /**
   * Checking the status of any asynchronous operation
   * @param event - The name of the event whose status is checked
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
    return status ?? false;
  }

  /**
   * helper method to wait for events to load. By default, card creation is tracked
   * @param event - The name of the event whose status is checked
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
      const isLoaded = this.mapAdapter.isLoaded ?? true;
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

  stopGetCoordFromMapClick(): void {
    if (this._coordFromMapClickPromise) {
      this._coordFromMapClickPromise.cancel();
    }
  }

  getCoordFromMapClick(): CancelablePromise<LngLatArray> {
    if (!this._coordFromMapClickPromise) {
      this._coordFromMapClickPromise = new CancelablePromise(
        (resolve, reject, onCancel) => {
          const cursor: Cursor = this.getCursor() || 'grab';
          this._removeEventListeners({ include: ['click'] });
          this.setCursor('crosshair');
          const onCancel_ = (): void => {
            this.setCursor(cursor);
            this._addEventsListeners({ include: ['click'] });
            this.mapAdapter.emitter.off('click', onMapClick);
            this._coordFromMapClickPromise = undefined;
          };
          const onMapClick = (e: MapClickEvent) => {
            onCancel_();
            deprecatedMapClick(e);
            resolve(e.lngLat);
          };
          this.mapAdapter.emitter.once('click', onMapClick);
          onCancel(onCancel_);
        }
      );
    } else {
      return this.getCoordFromMapClick();
    }
    return this._coordFromMapClickPromise;
  }

  protected _emitStatusEvent(
    eventName: keyof E,
    data?: EmitStatusEventData
  ): void {
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

  private async _setupMap(): Promise<this> {
    if (!this.mapAdapter) {
      throw new Error('WebMap `mapAdapter` option is not set');
    }
    await this.mapAdapter.create(this.options);
    this._zoomToInitialExtent();

    await this._addLayerProviders();
    await this._onLoadSync();

    this._emitStatusEvent('build-map', this.mapAdapter);
    return this;
  }

  private _setTileJsonOptions(tileJson: TileJson): void {
    if (tileJson.center) {
      this.options.center = tileJson.center;
    }
    if (tileJson.bounds) {
      this.options.bounds = tileJson.bounds;
    }
    if (defined(tileJson.maxzoom)) {
      this.options.maxZoom = tileJson.maxzoom;
      this.options.zoom = tileJson.maxzoom;
    }
    if (defined(tileJson.minzoom)) {
      this.options.minZoom = tileJson.minzoom;
      this.options.zoom = tileJson.minzoom;
    }
    if (defined(tileJson.maxzoom) && defined(tileJson.minzoom)) {
      this.options.zoom = (tileJson.maxzoom + tileJson.minzoom) / 2;
    }
  }

  private _zoomToInitialExtent(): void {
    const { center, zoom, bounds } = this.options;
    if (this._extent) {
      this.fitBounds(this._extent);
    } else if (center && zoom) {
      this.setView(center, zoom);
    } else if (bounds) {
      this.fitBounds(bounds);
    }
  }

  private _setInitMapState(states: Type<StateItem>[]): void {
    for (const X of states) {
      const state = new X(this);
      this._mapState.push(state);
      for (const r of this.runtimeParams) {
        const str = r.get(state.name);
        if (str !== undefined) {
          const val = state.parse(str);
          // state.setValue(val);
          this._initMapState[state.name] = val;
          Object.defineProperty(this.options, state.name, {
            value: val,
            configurable: true,
            enumerable: true,
          });
          break;
        }
      }
    }
  }

  private _addEventsListeners(opt?: AddEventsListenersOptions): void {
    let events: (keyof MainMapEvents)[] = [
      'preclick',
      'click',
      'zoomstart',
      'zoom',
      'zoomend',
      'movestart',
      'move',
      'moveend',
    ];

    if (opt && opt.include) {
      events = events.filter((x) => opt.include.includes(x));
    }
    events.forEach((x) => {
      this._mapEvents[x] = (data): void => {
        if (this.runtimeParams.length) {
          const mapStatusEvent = this._mapState.find((y) => y.event === x);
          if (mapStatusEvent) {
            const value = mapStatusEvent.toString(mapStatusEvent.getValue());
            this.runtimeParams.forEach((r) => {
              r.set(mapStatusEvent.name, value);
            });
          }
        }
        if (this._eventsStatus) {
          this.emitter.emit(x, data);
        }
      };
      const mapEvent = this._mapEvents[x];
      if (mapEvent) {
        this.mapAdapter.emitter.on(x, mapEvent);
      }
    });
  }

  private _removeEventListeners(opt?: AddEventsListenersOptions): void {
    let events = Object.entries(this._mapEvents) as [
      keyof MainMapEvents,
      ((...args: any[]) => void) | undefined
    ][];
    if (opt && opt.include) {
      events = events.filter((x) => opt.include.includes(x[0]));
    }
    events.forEach(([x, event]) => {
      if (event) {
        this.mapAdapter.emitter.removeListener(x as keyof MainMapEvents, event);
      }
    });
  }
}
