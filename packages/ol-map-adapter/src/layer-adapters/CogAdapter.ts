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
    const urls: string[] = [options.url];

    const geoTiffOpt: Options = {
      sources: urls.map((x) => ({ url: x })),
    };

    const source = new GeoTIFF(geoTiffOpt);
    const headers = options.headers;
    if (headers) {
      // source.getIma((tile, src) => {
      //   setTileLoadFunction(tile, src, headers);
      // });
    }
    const layer = new TileLayer({
      source,
      opacity: options.opacity,
      ...resolutionOptions(this.map, options),
      ...options.nativeOptions,
    });
    return layer;
  }
}
