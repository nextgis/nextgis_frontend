import { BaseLayerAdapter, TileAdapterOptions } from '@nextgis/webmap';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import Map from 'ol/Map';

export class TileAdapter implements BaseLayerAdapter {
  constructor(public map: Map, public options: TileAdapterOptions) {}

  addLayer(options: TileAdapterOptions) {
    const layer = new TileLayer({
      source: new XYZ({
        attributions: options.attribution ? [options.attribution] : [],
        url: options.url
      })
    });
    return layer;
  }
}
