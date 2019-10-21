/**
 * @module webmap
 */

import { MapAdapter, FitOptions } from './MapAdapter';
import { StarterKit } from './StarterKit';
import { LngLatArray, LngLatBoundsArray, Type } from './BaseTypes';
import { GeometryPaint, LayerAdapter, AdapterOptions } from './LayerAdapter';
import { RuntimeParams } from './RuntimeParams';

export interface MapOptions {
  /**
   * The HTML element in which NgwMap will render the map,
   * or the element's string  id.
   * The specified element must have no children.
   */
  target?: string | HTMLElement;
  // logo?: string;

  /**
   * The minimum zoom level of the map (0-24).
   */
  minZoom?: number;
  /**
   * The maximum zoom level of the map (0-24).
   */
  maxZoom?: number;
  /**
   * The initial zoom level of the map (0-24).
   */
  zoom?: number;
  /**
   * Initial position of the map, array of two degrees [longitude, latitude].
   * [LngLatArray](webmap-api#LngLatArray)
   */
  center?: LngLatArray;
  /**
   * Initial extent of the map, array of degrees in [_west_, _south_, _east_, _north_] order.
   * Overrides the `center` and  `zoom` parameters.
   * [LngLatBoundsArray](webmap-api#LngLatBoundsArray)
   *
   * @example
   * ```javascript
   * // whole world
   * bounds: [0, -90, 180, 90]
   * ```
   */
  bounds?: LngLatBoundsArray;
  fitOptions?: FitOptions;

  paint?: GeometryPaint;
  selectedPaint?: GeometryPaint;

  /**
   * The callback function is calling before adding each layer
   */
  onBeforeAddLayer?: OnBeforeLayerAdd;
}

export type OnBeforeLayerAdd = (e: {
  adapter?: Type<LayerAdapter>;
  options: AdapterOptions & Record<string, any>;
}) => { adapter?: Type<LayerAdapter>; options?: AdapterOptions } | undefined;

export interface AppOptions {
  /**
   * The main initialization property of WebMap.
   * Determines the way of interaction with the selected GIS framework.
   * Available: [Leaflet](leaflet-map-adapter); [Openlayers](ol-map-adapter); [MapboxGL](mapboxgl-map-adapter)
   */
  mapAdapter: MapAdapter;
  /**
   * One way to extend WebMap functionality with the help of kits.
   */
  starterKits?: StarterKit[];
  mapOptions?: MapOptions;
  runtimeParams?: RuntimeParams[];
  /**
   * Аutomatic creation of a map from the constructor
   * @default false
   *
   * @example
   * ```javascript
   * const webMap = new WebMap(options);
   * // create: false
   * webMap.create().then(() => doSomething());
   * // create: true
   * webMap.emitter.on('created', () => doSomething());
   * ```
   */
  create?: boolean;
}

export interface ToggleLayerOptions {
  silent?: boolean;
}

export interface GetAttributionsOptions {
  onlyVisible?: boolean;
  onlyBasemap?: boolean;
}
