/**
 * @module webmap
 */

 /**
  * @ignore
  */
export type Type<T> = new (...args: any[]) => T;

/**
 * Longitude and latitude coordinate, measured in degrees.
 */
export interface LatLng {
  /**
   * Latitude, measured in degrees.
   */
  lat: number;
  /**
   * Longitude, measured in degrees.
   */
  lng: number;
}

/**
 * Array of coordinates, measured in degrees, in [west, south, east, north] order.
 */
export type LngLatBoundsArray = [number, number, number, number];

/**
 * Array of two numbers representing longitude and latitude.
 */
export type LatLngArray = [number, number];

/**
 * Screen coordinates in pixels.
 */
export interface Pixel {
  top: number;
  left: number;
  right?: number;
  bottom?: number;
}

/**
 * @ignore
 */
export type Cursor = 'auto' | 'crosshair' | 'default' | 'e-resize' | 'help' | 'move' |
  'n-resize' | 'ne-resize' | 'nw-resize' | 'pointer' | 'progress' | 's-resize' |
  'se-resize' | 'sw-resize' | 'text' | 'w-resize' | 'wait' | 'inherit';
