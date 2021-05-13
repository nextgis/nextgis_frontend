import XYZ from 'ol/source/XYZ';
import TileLayer from 'ol/layer/Tile';

import { setTileLoadFunction } from '../utils/setTileLoadFunction';
import { resolutionOptions } from '../utils/gerResolution';

import type { Options } from 'ol/source/XYZ';
import type Map from 'ol/Map';
import type { MainLayerAdapter, TileAdapterOptions } from '@nextgis/webmap';

export class TileAdapter implements MainLayerAdapter {
  constructor(public map: Map, public options: TileAdapterOptions) {}

  addLayer(options: TileAdapterOptions): TileLayer {
    const urls: string[] = [];
    const subdomains: string[] | undefined =
      typeof options.subdomains === 'string'
        ? options.subdomains.split('')
        : options.subdomains;
    if (subdomains?.length) {
      subdomains.forEach((x) => {
        urls.push(options.url.replace(/{s}/, x));
      });
    } else {
      urls.push(options.url);
    }
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
    });
    return layer;
  }
}
