import { type Map, Util } from 'leaflet';

import { BaseAdapter } from '../BaseAdapter';

import { ImageLayer } from './ImageLayer';
import imageQueue from './imageQueue';

import type {
  MainLayerAdapter,
  UpdateLayerAdapterOptions,
} from '@nextgis/webmap';
import type { ImageAdapterOptions } from '@nextgis/webmap';

export class ImageAdapter
  extends BaseAdapter<ImageAdapterOptions>
  implements MainLayerAdapter<Map>
{
  static queue = imageQueue;

  layer?: ImageLayer;

  addLayer(options: ImageAdapterOptions): any {
    const url = options && options.url;
    if (url) {
      const updateWmsParamsFromOpt = options.updateWmsParams;
      this.layer = new ImageLayer(url, {
        pane: this.pane,
        headers: options.headers,
        setViewDelay: options.setViewDelay,
        // TODO: safe remove, use only options.nativeOptions
        ...{
          transparent: true,
          ...options,
          opacity: options.opacity ?? undefined,
        },
        ...options.params,
        ...options.nativeOptions,
        maxZoom: 12,
      });
      if (updateWmsParamsFromOpt) {
        const updateWmsParams = this.layer.updateWmsParams;
        this.layer.updateWmsParams = function (map: Map) {
          updateWmsParams.call(this, map);
          this.wmsParams = updateWmsParamsFromOpt(this.wmsParams);
        };
      }
      return this.layer;
    }
  }

  updateLayer(options?: UpdateLayerAdapterOptions): void {
    if (this.layer) {
      const params = options?.params || {};

      Util.extend(this.layer.wmsParams, params);
      this.layer.update();
    }
  }
}
