import { LayerAdapter, AdapterOptions } from '@nextgis/webmap';
import OSM from 'ol/source/OSM';
// @ts-ignore
import { ATTRIBUTION } from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';

export class OsmAdapter implements LayerAdapter {

  name = 'osm';

  addLayer(options?: AdapterOptions) {
    const attributions = [ATTRIBUTION];
    const layer = new TileLayer({
      source: new OSM({
        attributions
      }),
    });
    return layer;
  }

}
