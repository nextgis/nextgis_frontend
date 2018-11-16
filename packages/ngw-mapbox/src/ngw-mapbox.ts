import NgwMap, { MapOptions, NgwLayerOptions } from '@nextgis/ngw-map';
import MapboxglMapAdapter from '@nextgis/mapboxgl-map-adapter';
// import { NgwKit } from '@nextgis/ngw-kit';
import 'mapbox-gl/dist/mapbox-gl.css';

// import NgwMap, { MapOptions, NgwLayerOptions } from '../../ngw-map/src/ngw-map';
// import { MapboxglMapAdapter } from '../mapboxgl-map-adapter/src/mapboxgl-map-adapter';
// import { NgwKit } from '../ngw-kit/src/ngw-kit';

// const addNgwLayer = function (options: NgwLayerOptions, webMap, baseUrl) {
//   options.adapter = 'TILE';
//   return NgwKit.addNgwLayer(options, webMap, baseUrl);
// };

export default class NgwLeaflet extends NgwMap {

  constructor(options: MapOptions) {
    super(new MapboxglMapAdapter(), options);
  }

  addNgwLayer(options: NgwLayerOptions) {
    // TODO: still no way to add NGW IMAGE to mapbox-gl
    // always use tile adapter
    options.adapter = 'TILE';
    return super.addNgwLayer(options);
  }

}
