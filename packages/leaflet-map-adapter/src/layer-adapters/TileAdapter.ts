import { BaseLayerAdapter, AdapterOptions } from '@nextgis/webmap';
import { TileLayer } from 'leaflet';

export class TileAdapter implements BaseLayerAdapter {

  addLayer(options?: AdapterOptions) {
    if (options) {
      const { url, ...opt } = options;
      if (url) {
        const layer = new TileLayer(url);
        return layer;
      }
    }
  }
}
