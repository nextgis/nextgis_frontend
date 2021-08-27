import type { EventEmitter } from 'events';
import type StrictEventEmitter from 'strict-event-emitter-types';
import type {
  Type,
  LatLng,
  ZoomLevel,
  LngLatArray,
  LngLatBoundsArray,
} from '@nextgis/utils';
import type { LayerAdapter } from './LayerAdapter';
import type {
  MapControls,
  MapControl,
  CreateControlOptions,
  ButtonControlOptions,
  ToggleControlOptions,
} from './MapControl';
import type { Pixel } from './BaseTypes';
import type { MapOptions } from './MapOptions';
import type { MapAdapterEvents } from './Events';

/**
 * Parameters passed to the arguments of the callback function when clicking on the map
 */
export interface MapClickEvent {
  /**
   * The geographical point where the mouse event occurred.
   */
  lngLat: LngLatArray;
  /**
   * Pixel coordinates of the point where the mouse event occurred relative to the map container.
   */
  pixel: Pixel;
  /**
   * Map adapter original click event
   */
  source?: unknown;

  /**
   * The geographical point where the mouse event occurred.
   * @deprecated use `lngLat: number[]` instead
   */
  latLng?: LatLng;
}

/**
 * Parameters that control how the fit to object will be work.
 */
export interface FitOptions {
  /**
   * The maximum possible zoom to use.
   */
  maxZoom?: number;
  offset?: [number, number];
  padding?: number;
  duration?: number;
}

/**
 * @deprecated use ControlPosition instead
 */
export type ControlPositions = ControlPosition;

export type ControlPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left';

export interface Locate {
  stop: () => void;
}

export interface LocationEvent {
  lngLat: LngLatArray;
  bounds?: LngLatBoundsArray;
}

export interface LocateOptions {
  // watch?: boolean;
  setView?: boolean;
  maxZoom?: ZoomLevel;
  // timeout?: number;
  // maximumAge?: number;
  // enableHighAccuracy?: boolean;
}

export interface DataLoadError {
  target: string;
}

export interface LocationEvents {
  locationfound: (e: LocationEvent) => void;
  locationerror?: () => void;
}

/**
 * Parameters and methods that control the behavior of the map and the layers on it.
 * @typeParam M - WEB-GIS framework map interface
 * @typeParam L - WEB-GIS framework layer interface
 * @typeParam C - WEB-GIS framework control interface
 */
export interface MapAdapter<M = any, L = any, C = any> {
  /**
   * State of readiness of the card for use.
   * @defaultValue true
   */
  isLoaded?: boolean;
  /**
   * Original map object of GIS framework (Leaflet.Map, Openlayers.Map, Mapboxgl.Map or other)
   */
  map?: M;
  /**
   * An instance of the EventEmitter class for listen and emit events
   */
  readonly emitter: StrictEventEmitter<EventEmitter, MapAdapterEvents>;
  /**
   * Named adapters for map layers through a generic interface.
   */
  layerAdapters: { [name: string]: Type<LayerAdapter<M, L, any>> };
  /**
   * Named map controls specific for each framework.
   */
  controlAdapters: { [name: string]: Type<C> };

  create(options?: MapOptions): void;
  destroy(): void;

  /**
   * Remove layer from Map
   */
  removeLayer(layer: L): any;
  beforeRemove?(): void;

  /**
   * Set the transparency of given layer.
   */
  setLayerOpacity(layer: L, opacity: number): void;
  showLayer(layer: L): void;
  hideLayer(layer: L): void;
  setLayerOrder(
    layer: L,
    order: number,
    layers?: { [name: string]: LayerAdapter },
  ): void;

  /** @deprecated use fitBounds instead */
  fit?(extent: LngLatBoundsArray, options?: FitOptions): void;
  fitBounds(extent: LngLatBoundsArray, options?: FitOptions): void;
  // setRotation?(angle: number): void;
  setView?(lngLat: LngLatArray, zoom?: number): void;

  getBounds?(): LngLatBoundsArray | undefined;

  getZoom(): number | undefined;
  /**
   * Temporal async method.
   * @remarks
   * TODO: need to replace all 'get' methods with asynchronous
   */
  fetchZoom?(): Promise<number | undefined>;
  setZoom(zoom: number): void;
  /** zoom the map by one quantile of the current adapter */
  zoomIn?(): void;
  /** zoom out the map by one quantile of the current adapter */
  zoomOut?(): void;

  getCenter(): LngLatArray | undefined;
  setCenter(latLng: LngLatArray): void;

  getContainer(): HTMLElement | undefined;
  getControlContainer?(): HTMLElement;

  setCursor?(cursor: string): void;
  getCursor?(): string | undefined;

  createControl?(control: MapControl, options?: CreateControlOptions): C;
  createButtonControl?(options: ButtonControlOptions): C;
  createToggleControl?(options: ToggleControlOptions): C;

  addControl<K extends keyof MapControls>(
    controlName: K | any,
    position: ControlPosition,
    options?: MapControls[K],
  ): any;
  removeControl(control: any): void;

  onMapClick(evt: any): void;

  /**
   * Tries to locate the user using the Geolocation API,
   * firing a locationfound event with location data on success
   * or a locationerror event on failure,
   * and optionally sets the map view to the user's location with
   * respect to detection accuracy (or to the world view if geolocation failed).
   * Note that, if your page doesn't use HTTPS, this method will fail in modern browsers (Chrome 50 and newer)
   * See Locate options for more details.
   */
  locate?(opt: LocateOptions, events?: LocationEvents): Locate;
}
