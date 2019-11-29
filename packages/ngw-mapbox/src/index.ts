/**
 * @module ngw-mapbox
 */

import 'mapbox-gl/dist/mapbox-gl.css';

import NgwMap, { NgwLayerOptions, NgwMapOptions } from '@nextgis/ngw-map';
import MapboxglMapAdapter, {
  MapboxglMapAdapterOptions
} from '@nextgis/mapboxgl-map-adapter';
import { ResourceAdapter } from '@nextgis/ngw-kit';
import { Map } from 'mapbox-gl';

export class NgwMapbox extends NgwMap<
  Map,
  string[],
  any,
  MapboxglMapAdapterOptions
> {
  constructor(options: NgwMapOptions) {
    super(new MapboxglMapAdapter(), options);
  }

  static create = async (options: NgwMapOptions) => {
    const ngwMap = new NgwMapbox(options);
    return ngwMap.onLoad();
  };

  addNgwLayer(options: NgwLayerOptions): Promise<ResourceAdapter | undefined> {
    // TODO: still no way to add NGW IMAGE to mapbox-gl
    // always use tile adapter
    if (options.adapter === 'IMAGE') {
      options.adapter = 'TILE';
    }
    return super.addNgwLayer(options);
  }
}

export default NgwMapbox;

// @ts-ignore
if (window && !window.NgwMap) {
  // @ts-ignore
  window.NgwMap = NgwMapbox;
}
