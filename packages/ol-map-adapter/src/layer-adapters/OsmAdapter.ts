import { getLayerRequestOptions } from '@nextgis/webmap';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { ATTRIBUTION } from 'ol/source/OSM';

import { setTileLoadFunction } from '../utils/setTileLoadFunction';

import { BaseAdapter } from './BaseAdapter';

import type {
  AdapterOptions,
  MainLayerAdapter,
  TileAdapterOptions,
} from '@nextgis/webmap';
import type Map from 'ol/Map';
import type { Options as OSMOptions } from 'ol/source/OSM';

export class OsmAdapter extends BaseAdapter implements MainLayerAdapter {
  name = 'OpenStreetMap';

  constructor(
    public map: Map,
    public options: AdapterOptions,
  ) {
    super(map, options);
  }

  addLayer(options: Omit<TileAdapterOptions, 'url'>): TileLayer<OSM> {
    Object.assign(this.options, options);
    this.options.name = this.name;
    const attributions = [ATTRIBUTION];
    const sourceOptions: OSMOptions = {
      attributions,
    };
    const request = getLayerRequestOptions(options);
    if (options.crossOrigin) {
      sourceOptions.crossOrigin = options.crossOrigin;
    }
    if (request) {
      sourceOptions.tileLoadFunction = (tile, src) => {
        setTileLoadFunction({ tile, src, request });
      };
    }
    const layer = new TileLayer({
      source: new OSM(sourceOptions),
      ...options.nativeOptions,
    });
    return layer;
  }
}
