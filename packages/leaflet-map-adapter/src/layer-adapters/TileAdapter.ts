import { BaseLayerAdapter, AdapterOptions } from '@nextgis/webmap';
import { TileLayer } from 'leaflet';
import { BaseAdapter } from './BaseAdapter';

let ID = 1;

export class TileAdapter extends BaseAdapter implements BaseLayerAdapter {

  addLayer(options?: AdapterOptions) {
    if (options) {
      this.name = options.id || 'tile-' + ID++;
      const { url, ...opt } = options;
      if (url) {
        const layer = new TileLayer(url);

        return layer;
      }
    }
  }
}
