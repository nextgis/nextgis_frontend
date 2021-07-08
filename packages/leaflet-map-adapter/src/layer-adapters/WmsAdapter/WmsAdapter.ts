import { MainLayerAdapter, WmsAdapterOptions } from '@nextgis/webmap';
import { TileLayer, WMSOptions } from 'leaflet';
import { WmsLayer as WMS } from './WmsLayer';
import { BaseAdapter } from '../BaseAdapter';

export class WmsAdapter
  extends BaseAdapter<WmsAdapterOptions, TileLayer.WMS>
  implements MainLayerAdapter
{
  addLayer(options: WmsAdapterOptions): TileLayer.WMS | undefined {
    if (options) {
      const { url, ...opt } = options;
      if (url) {
        const layerOptions: WMSOptions = {
          pane: this.pane,
          attribution: opt.attribution,
          minZoom: opt.minZoom,
          maxZoom: opt.maxZoom,
          layers: options.layers,
          format: options.format,
        };
        let layer;
        if (opt.headers) {
          layer = new WMS(url, { ...layerOptions, headers: opt.headers });
        } else {
          layer = new TileLayer.WMS(url, layerOptions);
        }
        return layer;
      }
    }
  }
}
