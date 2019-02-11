import { BaseLayerAdapter, ImageAdapterOptions } from '@nextgis/webmap';
// import wms from 'leaflet.wms/src/leaflet.wms.js';
// @ts-ignore
import wms from './wms';

import { Map } from 'leaflet';

export class ImageAdapter implements BaseLayerAdapter<Map> {

  layer: any;

  addLayer(options: ImageAdapterOptions) {
    if (options) {
      options = { transparent: true, ...options };
      const updateWmsParamsFromOpt = options.updateWmsParams;
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
