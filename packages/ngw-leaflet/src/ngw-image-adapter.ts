import { LayerAdapter } from '@nextgis/webmap';
import wms from 'leaflet.wms/src/leaflet.wms.js';
import { Layer } from 'leaflet';

let ID = 1;

export class NgwImageAdapter implements LayerAdapter {

  name: string;
  layer: any;

  addLayer(options?) {
    options = { transparent: true, ...options };
    this.name = options.id || 'image-' + ID++;
    const id = options.id;
    this.layer = wms.overlay(options.url, options);
    const updateWmsParams = this.layer.updateWmsParams;
    this.layer.updateWmsParams = function (map) {
      updateWmsParams.call(this, map);
      const {bbox, width, height} = this.wmsParams;
      this.wmsParams = {
        resource: id,
        extent: bbox,
        size: width + ',' + height,
        timestamp: Date.now()
      };
    };

    return this.layer;
  }
}
