import NgwMap, { MapOptions, NgwLayerOptions } from '@nextgis/ngw-map';
import MapboxglMapAdapter from '@nextgis/mapboxgl-map-adapter';

// import NgwMap, { MapOptions, NgwLayerOptions } from '../../ngw-map/src/ngw-map';
// import MapboxglMapAdapter from '../../mapboxgl-map-adapter/src/mapboxgl-map-adapter';

import 'mapbox-gl/dist/mapbox-gl.css';

export default class NgwLeaflet extends NgwMap {

  constructor(options: MapOptions) {
    super(new MapboxglMapAdapter(), options);
  }

  addNgwLayer(options: NgwLayerOptions, adapterOptions?) {
    // TODO: still no way to add NGW IMAGE to mapbox-gl
    // always use tile adapter
    if (options.adapter  === 'IMAGE') {
      options.adapter = 'TILE';
    }
    return super.addNgwLayer(options, adapterOptions);
  }

}
