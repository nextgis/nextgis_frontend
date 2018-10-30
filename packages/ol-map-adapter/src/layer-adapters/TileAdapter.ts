import { LayerAdapter } from '@nextgis/webmap';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';

let ID = 1;

export class TileAdapter implements LayerAdapter {

  name: string;

  addLayer(options?) {

    this.name = options.id || 'tile-' + ID++;

    const layer = new TileLayer({
      source: new XYZ({
        url: options.url,
      }),
    });
    return layer;
  }

}
