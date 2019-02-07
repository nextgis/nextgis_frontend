import NgwMap, { NgwLayerOptions, NgwMapOptions, AdapterOptions } from '@nextgis/ngw-map';
import MapboxglMapAdapter from '@nextgis/mapboxgl-map-adapter';
// import { RGBAImage } from 'mapbox-gl/src/util/browser';

import 'mapbox-gl/dist/mapbox-gl.css';

export default class NgwLeaflet extends NgwMap {

  constructor(options: NgwMapOptions) {
    super(new MapboxglMapAdapter(), options);
  }

  addNgwLayer(options: NgwLayerOptions, adapterOptions?: AdapterOptions) {
    // TODO: still no way to add NGW IMAGE to mapbox-gl
    // always use tile adapter
    if (options.adapter === 'IMAGE') {
      options.adapter = 'TILE';
    }
    return super.addNgwLayer(options, adapterOptions);
  }

}
