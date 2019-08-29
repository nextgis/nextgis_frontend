/**
 * @module leaflet-map-adapter
 */
import { BaseLayerAdapter, TileAdapterOptions } from '@nextgis/webmap';
import { TileLayer, TileLayerOptions } from 'leaflet';
import { TileLayer as TL } from './TileLayer';
import { BaseAdapter } from '../BaseAdapter';

export class TileAdapter extends BaseAdapter<TileAdapterOptions, TileLayer>
  implements BaseLayerAdapter {
  addLayer(options: TileAdapterOptions) {
    if (options) {
      const { url, ...opt } = options;
      if (url) {
        const tileLayerOptions: TileLayerOptions = {
          pane: this.pane,
          attribution: opt.attribution,
          minZoom: opt.minZoom,
          maxZoom: opt.maxZoom
        };
        let layer;
        if (opt.headers) {
          layer = new TL(url, { ...tileLayerOptions, headers: opt.headers });
        } else {
          layer = new TileLayer(url, tileLayerOptions);
        }
        return layer;
      }
    }
  }
}
