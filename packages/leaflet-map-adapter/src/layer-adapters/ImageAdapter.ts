import { LayerAdapter } from '@nextgis/webmap';
import wms from 'leaflet.wms/src/leaflet.wms.js';

let ID = 1;

export class ImageAdapter implements LayerAdapter {

  name: string;
  layer: any;

  addLayer(options?) {
    options = { transparent: true, ...options };
    const updateWmsParamsFromOpt = options.updateWmsParams;
    this.name = options.id || 'image-' + ID++;
    this.layer = wms.overlay(options.url, options);
    if (updateWmsParamsFromOpt) {
      const updateWmsParams = this.layer.updateWmsParams;
      this.layer.updateWmsParams = function (map) {
        updateWmsParams.call(this, map);
        this.wmsParams = updateWmsParamsFromOpt(this.wmsParams);
      };
    }
    return this.layer;
  }
}
