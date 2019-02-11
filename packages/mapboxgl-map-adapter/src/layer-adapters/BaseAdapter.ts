import { BaseLayerAdapter, OnLayerClickOptions, AdapterOptions } from '@nextgis/webmap';
import { Map } from 'mapbox-gl';

let ID = 1;

export abstract class BaseAdapter<O extends AdapterOptions = AdapterOptions> implements BaseLayerAdapter {

  map: Map;
  name: string;
  options?: O;
  layer?: string[];

  constructor(map: Map, options?: O) {
    this.map = map;
    this.name = (options && options.id) || String(ID++);
    if (options) {
      this.options = { ...options };
    }
    if (options && options.onLayerClick) {
      this.onLayerClick = options.onLayerClick;
    }
  }

  onLayerClick?(options: OnLayerClickOptions): Promise<any>;

  addLayer(options?: any): string[] | Promise<string[]> | undefined {
    return [''];
  }
}
