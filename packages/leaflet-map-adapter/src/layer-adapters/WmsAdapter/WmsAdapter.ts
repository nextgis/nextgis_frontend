import { getLayerRequestOptions } from '@nextgis/webmap';
import { TileLayer } from 'leaflet';

import { BaseAdapter } from '../BaseAdapter';

import { WmsLayer as WMS } from './WmsLayer';

import type { MainLayerAdapter, WmsAdapterOptions } from '@nextgis/webmap';
import type { WMSOptions } from 'leaflet';

export class WmsAdapter
  extends BaseAdapter<WmsAdapterOptions, TileLayer.WMS>
  implements MainLayerAdapter
{
  addLayer(options: WmsAdapterOptions): TileLayer.WMS | undefined {
    Object.assign(this.options, options);
    const { url, ...opt } = options;
    if (url) {
      const layerOptions: WMSOptions = {
        pane: this.pane,
        attribution: opt.attribution,
        minZoom: opt.minZoom,
        maxZoom: opt.maxZoom,
        layers: options.layers,
        format: options.format,
        transparent: true,
        ...options.nativeOptions,
      };
      let layer;
      const request = getLayerRequestOptions(opt);
      if (request) {
        layer = new WMS(url, {
          ...layerOptions,
          request,
        });
      } else {
        layer = new TileLayer.WMS(url, layerOptions);
      }
      return layer;
    }
  }
}
