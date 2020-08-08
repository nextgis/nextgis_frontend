/**
 * Single-file bundle for rapid deployment of {@link https://leafletjs.com/ | Leaflet }-based web-gis applications with NextGIS services
 *
 * @remarks
 * Styles images and other assets are already in bundle, you don't need to include anything except one JS file!
 *
 * @packageDocumentation
 */
import 'leaflet/dist/leaflet.css';
import './leaflet-style-override.css';

import { Icon } from 'leaflet';
import { NgwMap, NgwMapOptions } from '@nextgis/ngw-map';
import LeafletMapAdapter from '@nextgis/leaflet-map-adapter';

import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
// @ts-ignore
delete Icon.Default.prototype._getIconUrl;

Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl,
  iconUrl: iconUrl,
  shadowUrl: shadowUrl,
});

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
