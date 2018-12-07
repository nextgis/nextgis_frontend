import { LayerAdapter, OnLayerClickOptions } from '@nextgis/webmap';
import {Map, Layer} from 'leaflet';

let ID = 1;

export abstract class BaseAdapter implements LayerAdapter {

  map: Map;
  name: string;
  options;

  constructor(map, options?) {
    this.map = map;
    this.name = options.id || String(ID++);
    this.options = Object.assign({}, this.options, options);
    if (options.onLayerClick) {
      this.onLayerClick = options.onLayerClick;
    }
  }

  onLayerClick?(options: OnLayerClickOptions): Promise<any>;

  addLayer(options?): Layer {
    return null;
  }
}
