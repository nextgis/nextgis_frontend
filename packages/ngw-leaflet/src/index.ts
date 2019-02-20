import 'leaflet/dist/leaflet.css';

import NgwMap, { NgwMapOptions } from '@nextgis/ngw-map';
import LeafletMapAdapter from '@nextgis/leaflet-map-adapter';

/**
 * The `NgwLeaflet` responsible for displaying the {@link ngw-map-api | NgwMap}
 * using the  {@link leaflet-map-adapter-api | LeafletMapAdapter}
 *
 * @example
 * ```javascript
 * import NgwLeaflet from '@nextgis/ngw-leaflet';
 * const ngwMap = new NgwLeaflet({
 *    baseUrl: 'https://demo.nextgis.com',
 *     target: 'map',
 *     qmsId: 487,
 *     webmapId: 3985
 *   });
 * ```
 */
export class NgwLeaflet extends NgwMap {

  constructor(options: NgwMapOptions) {
    super(new LeafletMapAdapter(), options);
  }

}

export default NgwLeaflet;

// @ts-ignore
if (window && !window.NgwMap) { window.NgwMap = NgwLeaflet; }
