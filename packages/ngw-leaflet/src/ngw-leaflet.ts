import NgwMap, { MapOptions, NgwLayerOptions } from '@nextgis-apps/ngw-map';
import 'leaflet/dist/leaflet.css';
import { LeafletMapAdapter } from '@nextgis/leaflet-map-adapter';

// import NgwMap, { MapOptions } from '../../ngw-map/src/ngw-map';
// import { LeafletMapAdapter } from '../../../nextgisweb_frontend/packages/leaflet-map-adapter/src/LeafletMapAdapter';

export default class NgwLeaflet extends NgwMap {

  constructor(options: MapOptions) {
    super(new LeafletMapAdapter(), options);
  }

}
