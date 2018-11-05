import NgwMap, { MapOptions } from '@nextgis-apps/ngw-map';
// import NgwMap, { MapOptions } from '../../ngw-map/src/ngw-map';
import 'ol/ol.css';
// import { LeafletMapAdapter } from '../../../nextgisweb_frontend/packages/leaflet-map-adapter/src/LeafletMapAdapter';
import { OlMapAdapter } from '@nextgis/ol-map-adapter';

export default class NgwOl extends NgwMap {

  constructor(options: MapOptions) {
    super(new OlMapAdapter(), options);
  }

  //
  /**
   * top, left, bottom, right
   */
  fitBounds(bounds: [number, number, number, number]) {
    const [top, left, bottom, right] = bounds;
    // [extent_left, extent_bottom, extent_right, extent_top];
    this.webMap.map.fit([left, bottom, right, top]);
  }

}
