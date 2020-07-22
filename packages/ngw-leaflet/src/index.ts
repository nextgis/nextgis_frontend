import 'leaflet/dist/leaflet.css';
import './leaflet-style-override.css';

import { NgwMap, NgwMapOptions } from '@nextgis/ngw-map';
import LeafletMapAdapter from '@nextgis/leaflet-map-adapter';

// const iconRetinaUrl = require('leaflet/dist/images/marker-icon-2x.png');
// const iconUrl = require('leaflet/dist/images/marker-icon.png');
// const shadowUrl = require('leaflet/dist/images/marker-shadow.png');
// // @ts-ignore
// delete L.Icon.Default.prototype._getIconUrl;

// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: iconRetinaUrl.default,
//   iconUrl: iconUrl.default,
//   shadowUrl: shadowUrl.default,
// });

/**
 * Displaying the [NgwMap](ngw-map-api)
 * using the  [LeafletMapAdapter](leaflet-map-adapter-api)
 *
 * @example
 * ```javascript
 * // Base initialization
 * // [live demo](http://code.nextgis.com/ngw-leaflet-examples-ngw_webmap)
 * import { NgwMap } from '@nextgis/ngw-leaflet';
 *
 * const ngwMap = new NgwMap({
 *   target: 'map',
 *   qmsId: 487,
 *   baseUrl: 'https://demo.nextgis.com',
 *   webmapId: 3985
 * });
 * ```
 */
class NgwLeaflet extends NgwMap {
  constructor(options: NgwMapOptions) {
    super(new LeafletMapAdapter(), options);
  }
  static async create(options: NgwMapOptions): Promise<NgwLeaflet> {
    const ngwMap = new NgwLeaflet(options);
    return ngwMap.onLoad();
  }
}

export default NgwLeaflet;

// @ts-ignore
if (window && !window.NgwMap) {
  // @ts-ignore
  window.NgwMap = NgwLeaflet;
}
