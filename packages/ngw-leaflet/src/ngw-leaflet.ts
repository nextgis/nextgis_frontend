import NgwMap, { MapOptions } from '@nextgis/ngw-map';
import 'leaflet/dist/leaflet.css';
import { LeafletMapAdapter } from '@nextgis/leaflet-map-adapter';

// import NgwMap, { MapOptions } from '../../ngw-map/src/ngw-map';
// import { LeafletMapAdapter } from '../leaflet-map-adapter/src/LeafletMapAdapter';

export default class NgwLeaflet extends NgwMap {

  constructor(options: MapOptions) {
    super(new LeafletMapAdapter(), options);
  }

}
