import { BaseLayerAdapter, AdapterOptions } from '@nextgis/webmap';
import { Map } from 'leaflet';

export class BaseAdapter<O extends AdapterOptions = AdapterOptions, L = any> implements BaseLayerAdapter<Map, L, O> {

  layer?: L;

  constructor(public map: any, public options: O) { }

  addLayer(options: O): L | Promise<L> | undefined {
    return undefined;
  }
}
