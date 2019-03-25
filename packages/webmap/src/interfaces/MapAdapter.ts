/**
 * @module webmap
 */

import { LayerAdapter } from './LayerAdapter';
import { Type } from './BaseTypes';
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
}

export type ControlPositions = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

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
  emitter: EventEmitter;
  /**
   * Named adapters for map layers through a generic interface.
   */
  layerAdapters: { [name: string]: Type<LayerAdapter<M, L, any>> };
  /**
   * Named map controls specific for each framework.
   */
  controlAdapters: { [name: string]: Type<C> };

  create(options?: MapOptions): void;

  /**
   * Remove layer from Map
   * @param layer
   */
  removeLayer(layer: L): any;

  /**
   * Set the transparency of given layer.
   * @param layer
   * @param opacity
   */
  setLayerOpacity(layer: L, opacity: number): void;
  showLayer(layer: L): void;
  hideLayer(layer: L): void;
  setLayerOrder(layer: L, order: number, layers?: { [name: string]: LayerAdapter }): void;

  fit(extent: LngLatBoundsArray, options?: FitOptions): void;
  // setRotation?(angle: number): void;
  setView?(lngLat: LngLatArray, zoom?: number): void;

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
    options?: MapControls[K]): any;
  removeControl(control: any): void;

  onMapClick(evt: any): void;

  // TODO: now return WKT geometry but need geojson
  // requestGeomString?(pixel: Pixel, pixelRadius?: number): string | undefined;
}
