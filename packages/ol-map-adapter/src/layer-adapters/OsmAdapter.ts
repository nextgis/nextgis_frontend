import { BaseLayerAdapter, AdapterOptions } from '@nextgis/webmap';
import OSM from 'ol/source/OSM';
// @ts-ignore
import { ATTRIBUTION } from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import Map from 'ol/Map';

export class OsmAdapter implements BaseLayerAdapter {
  name = 'osm';

  constructor(public map: Map, public options: AdapterOptions) {}

  addLayer() {
    const attributions = [ATTRIBUTION];
    const layer = new TileLayer({
      source: new OSM({
        attributions
      })
    });
    return layer;
  }
}
