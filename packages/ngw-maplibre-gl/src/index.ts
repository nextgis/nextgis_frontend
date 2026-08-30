import MaplibreGLMapAdapter from '@nextgis/maplibre-gl-map-adapter';
import { NgwMap } from '@nextgis/ngw-map';

import type { MaplibreGLMapAdapterOptions } from '@nextgis/maplibre-gl-map-adapter';
import type {
  NgwGeoJsonLayerAdapter,
  NgwGeoJsonLayerOptions,
  NgwLayerOptions,
  NgwWebmapLayerAdapter,
  ResourceAdapter,
} from '@nextgis/ngw-kit';
import type { NgwMapOptions } from '@nextgis/ngw-map';
import type { FeatureProperties } from '@nextgis/utils';
import type { Map } from 'maplibre-gl';

import 'maplibre-gl/dist/maplibre-gl.css';
import '@nextgis/maplibre-gl-map-adapter/src/style';

export type * from '@nextgis/ngw-map';

class NgwMaplibreGL extends NgwMap<
  Map,
  string[],
  any,
  MaplibreGLMapAdapterOptions
> {
  constructor(options: NgwMapOptions) {
    super({ ...options, mapAdapter: new MaplibreGLMapAdapter() });
  }

  static async create(options: NgwMapOptions): Promise<NgwMaplibreGL> {
    const ngwMap = new NgwMaplibreGL(options);
    return ngwMap.onLoad();
  }

  addNgwLayer<P extends FeatureProperties = FeatureProperties>(
    options: NgwGeoJsonLayerOptions<NoInfer<P>>,
  ): Promise<NgwGeoJsonLayerAdapter<P, Map, string[]> | undefined>;
  addNgwLayer(
    options: NgwLayerOptions<'NGW:WEBMAP'> & { adapter: 'NGW:WEBMAP' },
  ): Promise<NgwWebmapLayerAdapter<Map> | undefined>;
  addNgwLayer(options: NgwLayerOptions): Promise<ResourceAdapter | undefined>;
  addNgwLayer(options: NgwLayerOptions): Promise<ResourceAdapter | undefined> {
    // TODO: still no way to add NGW IMAGE to maplibre-gl
    // always use tile adapter
    if (options.adapter === 'IMAGE') {
      options.adapter = 'TILE';
    }
    return super.addNgwLayer(options);
  }
}

export default NgwMaplibreGL;

if ((window as any) && !(window as any).NgwMap) {
  (window as any).NgwMap = NgwMaplibreGL;
}
