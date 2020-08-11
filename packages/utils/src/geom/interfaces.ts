/**
 * Map zoom level.
 * @public
 */
export type ZoomLevel =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | number;

/**
 * Longitude and latitude coordinate, measured in degrees.
 * @public
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
 * {@link https://tools.ietf.org/html/rfc7946#section-5 | GeoJSON standard}
 * @public
 */
export type LngLatBoundsArray = [number, number, number, number] | number[];

/**
 * Array of two numbers representing longitude and latitude.
 * @public
 */
export type LngLatArray = [number, number];
