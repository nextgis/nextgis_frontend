import {
  checkExtent,
  deepmerge,
  defined,
  getBoundsFeature,
} from '@nextgis/utils';
import { deprecatedMapClick } from '@nextgis/utils';
import { EventEmitter } from 'events';

import { Keys } from './components/keys/Keys';
import { BoundState, CenterState, ZoomState } from './components/mapStates';
import { clearObject } from './utils/clearObject';

import type { GetPaintFunction } from '@nextgis/paint';
import type {
  LngLatArray,
  LngLatBoundsArray,
  TileJson,
  Type,
} from '@nextgis/utils';
import type { Feature, Polygon } from 'geojson';
import type StrictEventEmitter from 'strict-event-emitter-types';

import type { StateItem } from './components/mapStates/StateItem';
import type { Cursor } from './interfaces/BaseTypes';
import type { MainMapEvents, WebMapEvents } from './interfaces/Events';
import type { LayerAdapter } from './interfaces/LayerAdapter';
import type {
  FitOptions,
  Locate,
  LocateOptions,
  LocationEvents,
  MapAdapter,
  MapClickEvent,
} from './interfaces/MapAdapter';
import type { MapOptions, ViewOptions } from './interfaces/MapOptions';
import type { RuntimeParams } from './interfaces/RuntimeParams';
import type { StarterKit } from './interfaces/StarterKit';

type EmitStatusEventData = any;

let ID = 0;

const OPTIONS: MapOptions = {
  minZoom: 0,
  maxZoom: 22,
  paint: {
    color: '#0000ff', // blue
    opacity: 0.4,
    strokeOpacity: 1,
    stroke: true,
    radius: 8,
    weight: 1,
  },
  selectedPaint: {
    color: '#00008b', // darkblue
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

export class WebMapMain<
  M = any,
  E extends WebMapEvents = WebMapEvents,
  O extends MapOptions = MapOptions,
> {
  static keys: Keys = new Keys();

  static getPaintFunctions: { [name: string]: GetPaintFunction };

  options: O = OPTIONS as O;
  // `WebMapEvents` must be `E` but its not work correct
  readonly emitter: StrictEventEmitter<EventEmitter, WebMapEvents> =
    new EventEmitter();
  readonly keys = WebMapMain.keys;

  readonly mapAdapter: MapAdapter<M>;
  readonly runtimeParams: RuntimeParams[] = [];

  getPaintFunctions = WebMapMain.getPaintFunctions;
  mapStateItems: Type<StateItem>[] = [CenterState, ZoomState, BoundState];
  id = ID++;

  /**
   * From runtime params
   */
  readonly mapState: StateItem[] = [];
  protected _initMapState: Record<string, any> = {};
  protected readonly _starterKits: StarterKit[];
  private _extent?: LngLatBoundsArray;
  private readonly _eventsStatus: { [key in keyof E]?: boolean } = {};
  private _coordFromMapClickAbort?: () => void;

  private readonly _mapEvents: {
    [key in keyof MainMapEvents]?: (...args: any[]) => void;
  } = {};

  constructor(mapOptions: O) {
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
      await this._setInitMapState(this.mapStateItems);
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

  mapStateWithFunc(func: (x: any) => any): Record<string, any> {
    const state: Record<string, any> = {};
    this.mapState.forEach((x) => {
      state[x.name] = func(x);
    });
    return state;
  }

  getStateAsString(): Record<string, any> {
    return this.mapStateWithFunc((x) => x.toString());
  }

  getState(): Record<string, any> {
    return this.mapStateWithFunc((x) => x.getValue());
  }

  getRuntimeParams(): Record<string, any> {
    const state: Record<string, any> = {};
    this.mapState.forEach((x) => {
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
    this.onLoad().then(() => {
      if (this.mapAdapter.setCursor) {
        this.mapAdapter.setCursor(cursor);
      }
    });
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
   * @returns lngLat Array of two numbers representing longitude and latitude of the center of the map view.
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
   * @returns The map's current zoom level (0-24).
   */
  getZoom(): number | undefined {
    const zoom = this.mapAdapter.getZoom();
    if (typeof zoom === 'number') {
      return zoom;
    }
    // throw Error(
    //   'Unable to get zoom level. Perhaps the map is not have been initialized yet',
    // );
  }

  zoomIn(): void {
    if (this.mapAdapter.zoomIn) {
      this.mapAdapter.zoomIn();
    } else {
      const zoom = this.getZoom();
      if (zoom !== undefined) {
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
      if (zoom !== undefined) {
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
  setView(lngLatOr: LngLatArray, zoom?: number): void;

  setView(options: ViewOptions): void;

  setView(lngLatOrOpt: LngLatArray | ViewOptions, zoom?: number): void {
    if (Array.isArray(lngLatOrOpt)) {
      const lngLat = lngLatOrOpt;
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
    } else {
      const viewOpt = lngLatOrOpt;
      if (this.mapAdapter.setView) {
        this.mapAdapter.setView(viewOpt);
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
    checkExtent(bounds);
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
    if (this._coordFromMapClickAbort) {
      this._coordFromMapClickAbort();
      this._coordFromMapClickAbort = undefined;
    }
  }

  getCoordFromMapClick(): Promise<LngLatArray> {
    if (!this._coordFromMapClickAbort) {
      return new Promise((resolve, reject) => {
        const cursor: Cursor = this.getCursor() || 'grab';
        this._removeEventListeners({ include: ['click'] });
        this.setCursor('crosshair');
        const onCancel_ = (): void => {
          this.setCursor(cursor);
          this._addEventsListeners({ include: ['click'] });
          this.mapAdapter.emitter.off('click', onMapClick);
          this._coordFromMapClickAbort = undefined;
        };
        const onMapClick = (e: MapClickEvent) => {
          onCancel_();
          deprecatedMapClick(e);
          resolve(e.lngLat);
        };
        this.mapAdapter.emitter.once('click', onMapClick);
        this._coordFromMapClickAbort = onCancel_;
      });
    } else {
      return this.getCoordFromMapClick();
    }
  }

  protected _emitStatusEvent(
    eventName: keyof E,
    data?: EmitStatusEventData,
  ): void {
    // ugly hack to disable type checking error
    const _eventName = eventName as keyof E;
    this._eventsStatus[_eventName] = true;
    this.emitter.emit(_eventName as keyof WebMapEvents, data);
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
      // this.options.maxZoom = tileJson.maxzoom;
      this.options.zoom = tileJson.maxzoom;
    }
    if (defined(tileJson.minzoom)) {
      // this.options.minZoom = tileJson.minzoom;
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
      if (zoom !== undefined) {
        this.setZoom(zoom);
      }
    }
  }

  private _setInitMapState(states: Type<StateItem>[]): void {
    for (const X of states) {
      const state = new X(this);
      this.mapState.push(state);
      for (const r of this.runtimeParams) {
        const str = r.get(state.name);
        if (str !== undefined) {
          const val = state.parse(str);
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
      'mousemove',
      'mouseout',
      'mouseover',
    ];

    if (opt && opt.include) {
      events = events.filter((x) => opt.include.includes(x));
    }

    events.forEach((x) => {
      this._mapEvents[x] = (data): void => {
        if (this.runtimeParams.length) {
          const mapStatusEvents = this.mapState.filter((y) =>
            y.event.includes(x),
          );
          mapStatusEvents.forEach((mapStatusEvent) => {
            const value = mapStatusEvent.toString();
            this.runtimeParams.forEach((r) => {
              r.set(mapStatusEvent.name, value);
            });
          });
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
      ((...args: any[]) => void) | undefined,
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
