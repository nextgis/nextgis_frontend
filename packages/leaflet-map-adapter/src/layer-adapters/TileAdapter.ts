import { BaseLayerAdapter, AdapterOptions, TileAdapterOptions } from '@nextgis/webmap';
import { TileLayer } from 'leaflet';
import { BaseAdapter } from './BaseAdapter';

export class TileAdapter extends BaseAdapter<TileAdapterOptions, TileLayer> implements BaseLayerAdapter {

  addLayer(options: AdapterOptions) {
    if (options) {
      const { url, ...opt } = options;
      if (url) {
        const layer = new TileLayer(url);
        return layer;
      }
    }
  }
}
