import { TileAdapterOptions } from '@nextgis/webmap';
import { UrlTemplateImageryProvider, ImageryLayer } from 'cesium';

import { BaseAdapter } from './BaseAdapter';

type Layer = ImageryLayer;

export class TileAdapter extends BaseAdapter<TileAdapterOptions, Layer> {
  private _layer?: ImageryLayer;

  addLayer(opt: TileAdapterOptions): ImageryLayer {
    this.options = { ...opt };
    const urlLayer = new UrlTemplateImageryProvider({
      url: opt.url,
      credit: opt.attribution,
      maximumLevel: opt.maxZoom,
      minimumLevel: opt.minZoom,
    });
    // @ts-ignore - ImageryLayer need to set layer opacity
    // based on https://sandcastle.cesium.com/index.html?src=Imagery%2520Layers%2520Manipulation.html
    const layer = new ImageryLayer(urlLayer, { show: false });
    if (this.options.opacity !== undefined) {
      layer.alpha = this.options.opacity;
    }
    this._layer = layer;
    return layer;
  }

  showLayer(layer: ImageryLayer): void {
    layer.show = true;
    const order = this.options.order ? this.options.order * 1000 : 0;
    this.map.imageryLayers.add(layer, order);
    super.showLayer();
  }

  hideLayer(layer: ImageryLayer): void {
    layer.show = false;
    this.map.imageryLayers.remove(layer, false);
    super.hideLayer();
  }

  beforeRemove(): void {
    if (this._layer) {
      this.map.imageryLayers.remove(this._layer, true);
    }
    super.beforeRemove();
  }
}
