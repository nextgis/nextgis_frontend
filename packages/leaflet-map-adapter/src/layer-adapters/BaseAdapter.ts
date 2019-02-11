import { BaseLayerAdapter, OnLayerClickOptions } from '@nextgis/webmap';
import {Map, Layer} from 'leaflet';

let ID = 1;

export abstract class BaseAdapter implements BaseLayerAdapter {

  map: Map;
  name: string;
  options?: any;

  constructor(map: Map, options?: any) {
    this.map = map;
    this.name = options.id || String(ID++);
    this.options = {...this.options, ...options};
    if (options.onLayerClick) {
      this.onLayerClick = options.onLayerClick;
    }
  }

  onLayerClick?(options: OnLayerClickOptions): Promise<any>;

  addLayer(options?: any): any {
    return null;
  }
}
