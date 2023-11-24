import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { ATTRIBUTION } from 'ol/source/OSM';

import { BaseAdapter } from './BaseAdapter';

import type {
  AdapterOptions,
  MainLayerAdapter,
  TileAdapterOptions,
} from '@nextgis/webmap';
import type Map from 'ol/Map';

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
    const layer = new TileLayer({
      source: new OSM({
        attributions,
      }),
      ...options.nativeOptions,
    });
    return layer;
  }
}
