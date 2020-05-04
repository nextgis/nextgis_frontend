/**
 * @module cesium-map-adapter
 */
import { TileAdapterOptions } from '@nextgis/webmap';
import { Viewer, UrlTemplateImageryProvider, ImageryLayer } from 'cesium';

import { BaseAdapter } from './BaseAdapter';

type Layer = UrlTemplateImageryProvider;
type Map = Viewer;

export class TileAdapter extends BaseAdapter<TileAdapterOptions, Layer> {
  private _layer?: Layer;

  addLayer(opt: TileAdapterOptions) {
    this.options = { ...opt };
    const layer = new UrlTemplateImageryProvider({
      url: opt.url,
      credit: opt.attribution,
      maximumLevel: opt.maxZoom,
      minimumLevel: opt.minZoom,
    });
    this._layer = layer;
    return layer;
  }

  showLayer(layer: Layer) {
    this.map.imageryLayers.addImageryProvider(layer, this.options.order);
  }

  hideLayer(layer: ImageryLayer) {
    // TODO: do not work
    // this.map.imageryLayers.remove(layer);
    this.map.imageryLayers.removeAll();
  }
}
