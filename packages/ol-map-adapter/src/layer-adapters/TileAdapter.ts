import { BaseLayerAdapter, TileAdapterOptions } from '@nextgis/webmap';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';

export class TileAdapter implements BaseLayerAdapter {

  addLayer(options: TileAdapterOptions) {
    const layer = new TileLayer({
      source: new XYZ({
        attributions: options.attribution ? [options.attribution] : [],
        url: options.url,
      }),
    });
    return layer;
  }
}
