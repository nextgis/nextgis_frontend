import NgwMap, { MapOptions } from '@nextgis-apps/ngw-map';
import { OlMapAdapter } from '@nextgis/ol-map-adapter';
import 'ol/ol.css';
// import { OlMapAdapter } from '../../../nextgisweb_frontend/packages/ol-map-adapter/src/OlMapAdapter';
// import NgwMap, { MapOptions } from '../../ngw-map/src/ngw-map';

export default class NgwOl extends NgwMap {

  constructor(options: MapOptions) {
    super(new OlMapAdapter(), options);
  }

}
