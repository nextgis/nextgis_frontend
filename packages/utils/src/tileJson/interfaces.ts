/**
 * This specification attempts to create a standard for representing metadata
 * about multiple types of web-based layers, to aid clients in configuration and browsing.
 *
 * From {@link https:github.com/mapbox/tilejson-spec/tree/master/2.2.0}
 */

export interface TileJson {
  /**
   * A semver.org style version number. Describes the version of
   * the TileJSON spec that is implemented by this JSON object.
   */
  tilejson: string;
  /**
   * Default: null. A name describing the tileset. The name can
   * contain any legal character. Implementations SHOULD NOT interpret the
   * name as HTML.
   * @default null
   */
  name?: string;
  /**
   * Default: null. A text description of the tileset. The
   * description can contain any legal character. Implementations SHOULD NOT
   * interpret the description as HTML.
   */
  description?: string;
  /**
   * Default: "1.0.0". A semver.org style version number. When
   * changes across tiles are introduced, the minor version MUST change.
   * This may lead to cut off labels. Therefore, implementors can decide to
   * clean their cache when the minor version changes. Changes to the patch
   * level MUST only have changes to tiles that are contained within one tile.
   * When tiles change significantly, the major version MUST be increased.
   * Implementations MUST NOT use tiles with different major versions.
   */
  version?: string;
  /**
   * Default: null. Contains an attribution to be displayed
   * when the map is shown to a user. Implementations MAY decide to treat this
   * as HTML or literal text. For security reasons, make absolutely sure that
   * this field can't be abused as a vector for XSS or beacon tracking.
   */
  attribution?: string;
  /**
   * Default: null. Contains a mustache template to be used to
   * format data from grids for interaction.
   * See https://github.com/mapbox/utfgrid-spec/tree/master/1.2
   * for the interactivity specification.
   */
  template?: string;
  /**
   * Default: null. Contains a legend to be displayed with the map.
   * Implementations MAY decide to treat this as HTML or literal text.
   * For security reasons, make absolutely sure that this field can't be
   * abused as a vector for XSS or beacon tracking.
   */
  legend?: string;
  /**
   * Default: "xyz". Either "xyz" or "tms". Influences the y
   * direction of the tile coordinates.
   * The global-mercator (aka Spherical Mercator) profile is assumed.
   */
  scheme?: string;
  /**
   * REQUIRED. An array of tile endpoints. {z}, {x} and {y}, if present,
   * are replaced with the corresponding integers. If multiple endpoints are specified, clients
   * may use any combination of endpoints. All endpoints MUST return the same
   * content for the same URL. The array MUST contain at least one endpoint.
   */
  tiles: string[];
  /**
   * Default: []. An array of interactivity endpoints. {z}, {x}
   * and {y}, if present, are replaced with the corresponding integers. If multiple
   * endpoints are specified, clients may use any combination of endpoints.
   * All endpoints MUST return the same content for the same URL.
   * If the array doesn't contain any entries, interactivity is not supported
   * for this tileset.
   * See https://github.com/mapbox/utfgrid-spec/tree/master/1.2
   * for the interactivity specification.
   */
  grids?: string[];
  /**
   * Default: []. An array of data files in GeoJSON format.
   * {z}, {x} and {y}, if present,
   * are replaced with the corresponding integers. If multiple
   * endpoints are specified, clients may use any combination of endpoints.
   * All endpoints MUST return the same content for the same URL.
   * If the array doesn't contain any entries, then no data is present in
   * the map.
   */
  data?: string[];
  /**
   * Default: 0. >= 0, <= 30.
   * An integer specifying the minimum zoom level.
   */
  minzoom?: number;
  /**
   * Default: 30. >= 0, <= 30.
   * An integer specifying the maximum zoom level. MUST be >= minzoom.
   */
  maxzoom?: number;
  /**
   * Default: [-180, -90, 180, 90].
   * The maximum extent of available map tiles. Bounds MUST define an area
   * covered by all zoom levels. The bounds are represented in WGS:84
   * latitude and longitude values, in the order left, bottom, right, top.
   * Values may be integers or floating point numbers.
   */
  bounds?: number[];
  /**
   * Default: null.
   * The first value is the longitude, the second is latitude (both in
   * WGS:84 values), the third value is the zoom level as an integer.
   * Longitude and latitude MUST be within the specified bounds.
   * The zoom level MUST be between minzoom and maxzoom.
   * Implementations can use this value to set the default location. If the
   * value is null, implementations may use their own algorithm for
   * determining a default location.
   */
  center?: number[];
  // [k: string]: unknown;
}
