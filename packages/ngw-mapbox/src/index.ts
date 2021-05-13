/**
 * Single-file bundle for rapid deployment of {@link https://docs.mapbox.com/mapbox-gl-js | Mapbox GL JS } based web-gis applications with NextGIS services
 *
 * @remarks
 * Styles images and other assets are already in bundle, you don't need to include anything except one JS file!
 *
 * @packageDocumentation
 */
import 'mapbox-gl/dist/mapbox-gl.css';

import { NgwMap, NgwMapOptions } from '@nextgis/ngw-map';
import MapboxglMapAdapter from '@nextgis/mapboxgl-map-adapter';

import type { Map } from 'mapbox-gl';
import type { MapboxglMapAdapterOptions } from '@nextgis/mapboxgl-map-adapter';
import type { ResourceAdapter, NgwLayerOptions } from '@nextgis/ngw-kit';

class NgwMapbox extends NgwMap<Map, string[], any, MapboxglMapAdapterOptions> {
  constructor(options: NgwMapOptions) {
    super({ ...options, mapAdapter: new MapboxglMapAdapter() });
  }

  static async create(options: NgwMapOptions): Promise<NgwMapbox> {
    const ngwMap = new NgwMapbox(options);
    return ngwMap.onLoad();
  }

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

if ((window as any) && !(window as any).NgwMap) {
  (window as any).NgwMap = NgwMapbox;
}
