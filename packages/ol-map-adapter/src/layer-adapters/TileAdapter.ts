import XYZ from 'ol/source/XYZ';
import TileLayer from 'ol/layer/Tile';

import { getUrlsWithSubdomains } from '../utils/getUrlsWithSubdomains';
import { setTileLoadFunction } from '../utils/setTileLoadFunction';
import { resolutionOptions } from '../utils/gerResolution';
import { BaseAdapter } from './BaseAdapter';

import type { Options } from 'ol/source/XYZ';
import type Map from 'ol/Map';
import type { MainLayerAdapter, TileAdapterOptions } from '@nextgis/webmap';

export class TileAdapter extends BaseAdapter implements MainLayerAdapter {
  constructor(public map: Map, public options: TileAdapterOptions) {
    super(map, options);
  }

  addLayer(options: TileAdapterOptions): TileLayer<XYZ> {
    Object.assign(this.options, options);
    const urls: string[] = getUrlsWithSubdomains(
      options.url,
      options.subdomains,
    );
    const xyzOpt: Options = {
      attributions: options.attribution ? [options.attribution] : [],
      urls,
      // tilePixelRatio: 2
    };
    if (options.crossOrigin) {
      xyzOpt.crossOrigin = options.crossOrigin;
    }
    const source = new XYZ(xyzOpt);
    const headers = options.headers;
    if (headers) {
      source.setTileLoadFunction((tile, src) => {
        setTileLoadFunction(tile, src, headers);
      });
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
