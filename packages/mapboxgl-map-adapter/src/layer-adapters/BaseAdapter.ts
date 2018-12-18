import { LayerAdapter, OnLayerClickOptions } from '@nextgis/webmap';
import {Map} from 'mapbox-gl';

let ID = 1;

export abstract class BaseAdapter implements LayerAdapter {

  map: Map;
  name: string;
  options: any;
  layer: string[];

  constructor(map: Map, options?: any) {
    this.map = map;
    this.name = options.id || String(ID++);
    this.options = {...this.options, ...options};
    if (options.onLayerClick) {
      this.onLayerClick = options.onLayerClick;
    }
  }

  onLayerClick?(options: OnLayerClickOptions): Promise<any>;

  addLayer(options?): string[] | Promise<string[]> {
    return [''];
  }
}
