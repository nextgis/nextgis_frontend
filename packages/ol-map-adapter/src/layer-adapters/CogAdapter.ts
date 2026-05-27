import { getLayerRequestOptions } from '@nextgis/webmap';
import TileLayer from 'ol/layer/WebGLTile';
import GeoTIFF from 'ol/source/GeoTIFF';

import { resolutionOptions } from '../utils/gerResolution';

import { BaseAdapter } from './BaseAdapter';

import type { MainLayerAdapter, RasterAdapterOptions } from '@nextgis/webmap';
import type Map from 'ol/Map';
import type { Options } from 'ol/source/GeoTIFF';

export class CogAdapter extends BaseAdapter implements MainLayerAdapter {
  layer: any;

  constructor(
    public map: Map,
    public options: RasterAdapterOptions,
  ) {
    super(map, options);
  }

  addLayer(options: RasterAdapterOptions): TileLayer {
    Object.assign(this.options, options);
    const request = getLayerRequestOptions(options);
    const urls: string[] = [options.url];

    const geoTiffOpt: Options = {
      sources: urls.map((x) => ({ url: x })),
    };
    if (request?.headers) {
      geoTiffOpt.sourceOptions = {
        ...(geoTiffOpt.sourceOptions || {}),
        headers: request.headers,
      };
    }
    if (request?.credentials !== undefined) {
      geoTiffOpt.sourceOptions = {
        ...(geoTiffOpt.sourceOptions || {}),
        credentials: request.credentials,
      };
    }
    const source = new GeoTIFF(geoTiffOpt);
    const layer = new TileLayer({
      source,
      opacity: options.opacity ?? undefined,
      ...resolutionOptions(this.map, options),
      ...options.nativeOptions,
    });
    return layer;
  }
}
