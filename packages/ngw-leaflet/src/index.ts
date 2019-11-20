/**
 * @module ngw-leaflet
 */

import 'leaflet/dist/leaflet.css';
import './leaflet-style-override.css';

import NgwMap, { NgwMapOptions } from '@nextgis/ngw-map';
import LeafletMapAdapter from '@nextgis/leaflet-map-adapter';

/**
 * Displaying the [NgwMap](ngw-map-api)
 * using the  [LeafletMapAdapter](leaflet-map-adapter-api)
 *
 * @example
 * ```javascript
 * // Base initialization
 * // [live demo](http://code.nextgis.com/ngw-leaflet-examples-ngw_webmap)
 * import NgwMap from '@nextgis/ngw-leaflet';
 *
 * const ngwMap = new NgwMap({
 *   target: 'map',
 *   qmsId: 487,
 *   baseUrl: 'https://demo.nextgis.com',
 *   webmapId: 3985
 * });
 * ```
 */
export class NgwLeaflet extends NgwMap {
  constructor(options: NgwMapOptions) {
    super(new LeafletMapAdapter(), options);
  }
  static create = async (options: NgwMapOptions) => {
    const ngwMap = new NgwLeaflet(options);
    return ngwMap.onLoad();
  };
}

export default NgwLeaflet;

// @ts-ignore
if (window && !window.NgwMap) {
  // @ts-ignore
  window.NgwMap = NgwLeaflet;
}
