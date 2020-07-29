import { MainLayerAdapter, AdapterOptions } from '@nextgis/webmap';
import OSM from 'ol/source/OSM';
import { ATTRIBUTION } from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import Map from 'ol/Map';

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
