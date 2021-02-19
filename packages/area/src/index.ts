/**
 * Dependencies free QGIS ellipsoidal area calculation reproduced in JavaScript.
 *
 * @example
 * ```javascript
 * import { calculateArea, geojsonArea } from '@nextgis/area';
 *
 * const area = geojsonArea(geojson);
 * const area2 = calculateArea([
 *   [51.82, 63.8],
 *   [43.48, 55.62],
 *   [75.38, 59.13],
 *   [51.82, 63.8], // the first and last positions MUST contain identical values
 * ]);
 * ```
 *
 * @packageDocumentation
 */
export * from './calculateArea';
