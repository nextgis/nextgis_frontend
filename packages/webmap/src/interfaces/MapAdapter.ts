/**
 * @module webmap
 */
import StrictEventEmitter from 'strict-event-emitter-types';
import { LayerAdapter } from './LayerAdapter';
import { Type, ZoomLevel } from './BaseTypes';
import { EventEmitter } from 'events';
import {
  MapControls,
  MapControl,
  CreateControlOptions,
  ButtonControlOptions,
  ToggleControlOptions
} from './MapControl';
import { MapOptions } from './WebMapApp';
import { LatLng, LngLatArray, LngLatBoundsArray, Pixel } from './BaseTypes';
import { MapAdapterEvents } from './Events';

/**
 * Parameters passed to the arguments of the callback function when clicking on the map
 */
export interface MapClickEvent {
  /**
   * The geographical point where the mouse event occurred.
   */
  latLng: LatLng;
  /**
   * Pixel coordinates of the point where the mouse event occurred relative to the map container.
   */
  pixel: Pixel;
  /**
   * Map adapter original click event
   */
  source?: any;
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
}

export type ControlPositions =
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
 * @typeparam M WEB-GIS framework map interface
 * @typeparam M WEB-GIS framework layer interface
 * @typeparam M WEB-GIS framework control interface
 */
export interface MapAdapter<M = any, L = any, C = any> {
  /**
   * State of readiness of the card for use.
   * @default true
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
   * @param layer
   */
  removeLayer(layer: L): any;
  beforeRemove?(): void;

  /**
   * Set the transparency of given layer.
   * @param layer
   * @param opacity
   */
  setLayerOpacity(layer: L, opacity: number): void;
  showLayer(layer: L): void;
  hideLayer(layer: L): void;
  setLayerOrder(
    layer: L,
    order: number,
    layers?: { [name: string]: LayerAdapter }
  ): void;

  /** @deprecated use fitBounds instead */
  fit?(extent: LngLatBoundsArray, options?: FitOptions): void;
  fitBounds(extent: LngLatBoundsArray, options?: FitOptions): void;
  // setRotation?(angle: number): void;
  setView?(lngLat: LngLatArray, zoom?: number): void;

  getBounds?(): LngLatBoundsArray | undefined;

  getZoom(): number | undefined;
  setZoom(zoom: number): void;

  getCenter(): LngLatArray | undefined;
  setCenter(latLng: LngLatArray): void;

  getContainer(): HTMLElement | undefined;

  setCursor?(cursor: string): void;

  createControl?(control: MapControl, options?: CreateControlOptions): C;
  createButtonControl?(options: ButtonControlOptions): C;
  createToggleControl?(options: ToggleControlOptions): C;

  addControl<K extends keyof MapControls>(
    controlName: K | any,
    position: ControlPositions,
    options?: MapControls[K]
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
