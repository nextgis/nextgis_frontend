import { LayerAdapter } from '@nextgis/webmap';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';

export class OsmAdapter implements LayerAdapter {

  name = 'osm';

  addLayer(options?) {
    const layer = new TileLayer({
      source: new OSM(),
    });
    return layer;
  }

}
