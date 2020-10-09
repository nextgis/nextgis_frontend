import Map from 'ol/Map';
import XYZ, { Options } from 'ol/source/XYZ';
import TileLayer from 'ol/layer/Tile';

import { MainLayerAdapter, TileAdapterOptions } from '@nextgis/webmap';

import { setTileLoadFunction } from '../utils/setTileLoadFunction';
import { resolutionOptions } from '../utils/gerResolution';

export class TileAdapter implements MainLayerAdapter {
  constructor(public map: Map, public options: TileAdapterOptions) {}

  addLayer(options: TileAdapterOptions): TileLayer {
    const xyzOpt: Options = {
      attributions: options.attribution ? [options.attribution] : [],
      url: options.url,
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
