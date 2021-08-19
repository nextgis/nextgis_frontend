import OSM from 'ol/source/OSM';
import { ATTRIBUTION } from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import { BaseAdapter } from './BaseAdapter';

import type Map from 'ol/Map';
import type { MainLayerAdapter, AdapterOptions } from '@nextgis/webmap';
export class OsmAdapter extends BaseAdapter implements MainLayerAdapter {
  name = 'OpenStreetMap';

  constructor(public map: Map, public options: AdapterOptions) {
    super(map, options);
  }

  addLayer(): TileLayer<OSM> {
    this.options.name = this.name;
    const attributions = [ATTRIBUTION];
    const layer = new TileLayer({
      source: new OSM({
        attributions,
      }),
    });
    return layer;
  }
}
