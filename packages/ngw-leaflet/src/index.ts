import 'leaflet/dist/leaflet.css';

import NgwMap, { NgwMapOptions } from '@nextgis/ngw-map';
import LeafletMapAdapter from '@nextgis/leaflet-map-adapter';

export class NgwLeaflet extends NgwMap {

  constructor(options: NgwMapOptions) {
    super(new LeafletMapAdapter(), options);
  }

}

export default NgwLeaflet;
