/**
 * @module webmap
 */

import { MapAdapter } from './MapAdapter';
import { StarterKit } from './StarterKit';
import { MapControl } from './MapControl';
import { LngLatArray, LngLatBoundsArray } from './BaseTypes';

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

}

export interface AppOptions {
  mapAdapter: MapAdapter;
  starterKits?: StarterKit[];
  // displayConfig?: DisplayConfig;
  // [configName: string]: any;
}

export interface WebMapAppEvents {
  'build-map': MapAdapter;
}

export interface GetAttributionsOptions {
  onlyVisible?: boolean;
  onlyBasemap?: boolean;
}
