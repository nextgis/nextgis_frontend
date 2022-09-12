/**
 * Map zoom level. From 0 to 22
 */
export type ZoomLevel = number;

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
 * A Position is an array of coordinates.
 * {@link https://tools.ietf.org/html/rfc7946#section-3.1.1| GeoJSON standard}
 * Array should contain between two and three elements.
 * The previous GeoJSON specification allowed more elements (e.g., which could be used to represent M values),
 * but the current specification only allows X, Y, and (optionally) Z to be defined.
 */
export type Position = [number, number]; // | [number, number, number];

/**
 * Array of coordinates, measured in degrees, in [west, south, east, north] order.
 * {@link https://tools.ietf.org/html/rfc7946#section-5 | GeoJSON standard}
 */
export type LngLatBoundsArray =
  | [west: number, south: number, east: number, north: number]
  | number[];

/**
 * Array of two numbers representing longitude and latitude.
 */
export type LngLatArray = Position | number[];
