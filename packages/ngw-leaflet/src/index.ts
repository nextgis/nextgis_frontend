import NgwMap, { NgwMapOptions } from '@nextgis/ngw-map';
import LeafletMapAdapter from '@nextgis/leaflet-map-adapter';
import 'leaflet/dist/leaflet.css';

// import NgwMap, { MapOptions } from '../../ngw-map/src/ngw-map';
// import { LeafletMapAdapter } from '../leaflet-map-adapter/src/LeafletMapAdapter';

export default class NgwLeaflet extends NgwMap {

  constructor(options: NgwMapOptions) {
    super(new LeafletMapAdapter(), options);
  }

}
