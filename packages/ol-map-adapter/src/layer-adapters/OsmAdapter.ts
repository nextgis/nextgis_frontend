import OSM from 'ol/source/OSM';
import { ATTRIBUTION } from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';

import type Map from 'ol/Map';
import type { MainLayerAdapter, AdapterOptions } from '@nextgis/webmap';
export class OsmAdapter implements MainLayerAdapter {
  name = 'osm';

  constructor(public map: Map, public options: AdapterOptions) {}

  addLayer(): TileLayer {
    const attributions = [ATTRIBUTION];
    const layer = new TileLayer({
      source: new OSM({
        attributions,
      }),
    });
    return layer;
  }
}
