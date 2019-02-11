import { BaseLayerAdapter, TileAdapterOptions } from '@nextgis/webmap';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';

let ID = 1;

export class TileAdapter implements BaseLayerAdapter {

  name?: string;

  addLayer(options: TileAdapterOptions) {

    this.name = options.id || 'tile-' + ID++;

    const layer = new TileLayer({
      source: new XYZ({
        attributions: options.attribution ? [options.attribution] : [],
        url: options.url,
      }),
    });
    return layer;
  }

}
