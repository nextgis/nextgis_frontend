import { BaseLayerAdapter, ImageAdapterOptions } from '@nextgis/webmap';
// import wms from 'leaflet.wms/src/leaflet.wms.js';
// @ts-ignore
import wms from './wms';
import { BaseAdapter } from './BaseAdapter';
import { Map } from 'leaflet';

let ID = 1;

export class ImageAdapter extends BaseAdapter implements BaseLayerAdapter {

  layer: any;

  addLayer(options?: ImageAdapterOptions) {
    if (options) {
      options = { transparent: true, ...options };
      const updateWmsParamsFromOpt = options.updateWmsParams;
      this.name = options.id || 'image-' + ID++;
      // @ts-ignore
      this.layer = wms.overlay(options.url, options);
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
