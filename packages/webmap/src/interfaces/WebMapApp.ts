/**
 * @module webmap
 */

import { MapAdapter } from './MapAdapter';
import { StarterKit } from './StarterKit';
import { MapControl } from './MapControl';
import { LatLngArray, LngLatBoundsArray } from './BaseTypes';

export interface MapOptions {
  /**
   * The HTML element in which NgwMap will render the map,
   * or the element's string  id. The specified element must have no children.
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
  /** lat lng */
  center?: LatLngArray;
  /** top, left, bottom, right */
  bounds?: LngLatBoundsArray;
  zoom?: number;
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
