import { TileAdapterOptions } from '@nextgis/webmap';
import {
  Viewer as TViewer,
  UrlTemplateImageryProvider,
  ImageryLayer
} from 'cesium';

import { BaseAdapter } from './BaseAdapter';
const Cesium = require('cesium');

type Layer = UrlTemplateImageryProvider;
type Map = TViewer;

export class TileAdapter extends BaseAdapter<TileAdapterOptions, Layer> {
  private _layer?: Layer;

  addLayer(opt: TileAdapterOptions) {
    this.options = { ...opt };
    const layer = new Cesium.UrlTemplateImageryProvider({
      url: opt.url,
      credit: opt.attribution,
      maximumLevel: opt.maxZoom,
      minimumLevel: opt.minZoom
    });
    this._layer = layer;
    return layer;
  }

  showLayer(layer: Layer) {
    this.map.imageryLayers.addImageryProvider(layer, this.options.order);
  }

  hideLayer(layer: ImageryLayer) {
    this.map.imageryLayers.remove(layer);
  }
}
