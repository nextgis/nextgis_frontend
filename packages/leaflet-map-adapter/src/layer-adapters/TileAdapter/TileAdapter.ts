import { TileLayer } from 'leaflet';

import { BaseAdapter } from '../BaseAdapter';

import { TileLayer as TL } from './TileLayer';

import type { MainLayerAdapter, TileAdapterOptions } from '@nextgis/webmap';
import type { TileLayerOptions } from 'leaflet';

export class TileAdapter
  extends BaseAdapter<TileAdapterOptions, TileLayer>
  implements MainLayerAdapter
{
  addLayer(options: TileAdapterOptions): TileLayer | undefined {
    this.options = Object.assign(this.options, options);
    if (options) {
      const { url, ...opt } = options;
      if (url) {
        const tileLayerOptions: TileLayerOptions = {
          pane: this.pane,
          attribution: opt.attribution,
          minZoom: opt.minZoom,
          maxZoom: opt.maxZoom,

          ...opt.nativeOptions,
        };
        if (opt.subdomains) {
          tileLayerOptions.subdomains = opt.subdomains;
        }
        let layer;
        if (opt.headers || opt.withCredentials) {
          layer = new TL(url, {
            ...tileLayerOptions,
            headers: opt.headers,
            withCredentials: opt.withCredentials,
            setViewDelay: opt.setViewDelay,
          });
        } else {
          layer = new TileLayer(url, tileLayerOptions);
        }
        return layer;
      }
    }
  }

  updateLayer(): void {
    if (this.layer) {
      // @ts-ignore read private property
      const currentUrl = this.layer._url;
      const timestamp = new Date().getTime();

      const separator = currentUrl.includes('?') ? '&' : '?';

      const newUrl =
        currentUrl.replace(/(\?|&)timestamp=\d*/g, '') +
        separator +
        `timestamp=${timestamp}`;

      this.layer.setUrl(newUrl);
      this.layer.redraw();
    }
  }
}
