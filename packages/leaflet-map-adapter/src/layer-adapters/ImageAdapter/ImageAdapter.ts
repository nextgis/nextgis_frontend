import { MainLayerAdapter, ImageAdapterOptions } from '@nextgis/webmap';
// @ts-ignore
import { ImageLayer } from './ImageLayer';

import { Map } from 'leaflet';
import { BaseAdapter } from '../BaseAdapter';

export class ImageAdapter
  extends BaseAdapter<ImageAdapterOptions>
  implements MainLayerAdapter<Map>
{
  layer: any;

  addLayer(options: ImageAdapterOptions): any {
    const url = options && options.url;
    if (url) {
      options = { transparent: true, ...options };
      const updateWmsParamsFromOpt = options.updateWmsParams;
      this.layer = new ImageLayer(url, {
        pane: this.pane,
        headers: options.headers,
        setViewDelay: options.setViewDelay,
        /**
         * TODO: safe remove, use only options.params
         */
        ...options,
        ...options.params,
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
}
