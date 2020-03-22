import Map from 'ol/Map';
import XYZ from 'ol/source/XYZ';
import TileLayer from 'ol/layer/Tile';

import { BaseLayerAdapter, TileAdapterOptions } from '@nextgis/webmap';

import { setTileLoadFunction } from '../utils/setTileLoadFunction';
import { resolutionOptions } from '../utils/gerResolution';

export class TileAdapter implements BaseLayerAdapter {
  constructor(public map: Map, public options: TileAdapterOptions) {}

  addLayer(options: TileAdapterOptions) {
    const source = new XYZ({
      attributions: options.attribution ? [options.attribution] : [],
      url: options.url,
    });
    const headers = options.headers;
    if (headers) {
      source.setTileLoadFunction((tile, src) => {
        setTileLoadFunction(tile, src, headers);
      });
    }
    const layer = new TileLayer({
      source,
      ...resolutionOptions(this.map, options),
    });
    return layer;
  }
}
