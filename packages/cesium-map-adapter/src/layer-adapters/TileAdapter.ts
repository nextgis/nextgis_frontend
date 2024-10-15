import { defined } from '@nextgis/utils';
import { ImageryLayer, UrlTemplateImageryProvider } from 'cesium';

import {
  addToTileCatalog,
  removeFromTileCatalog,
} from '../utils/TileAdapterOrderControl';
import { makeUrl } from '../utils/makeUrl';

import { BaseAdapter } from './BaseAdapter';

import type { TileAdapterOptions } from '@nextgis/webmap';

type Layer = ImageryLayer;

export class TileAdapter extends BaseAdapter<TileAdapterOptions, Layer> {
  private _layer?: ImageryLayer;
  private _added = false;

  addLayer(opt: TileAdapterOptions): ImageryLayer {
    this.options = { ...this.options, ...opt };
    const url = makeUrl(this.options.url, this.options.headers);
    const imageProviderOpt: UrlTemplateImageryProvider.ConstructorOptions = {
      url,
      credit: opt.attribution,
      maximumLevel: defined(opt.maxZoom) ? opt.maxZoom : undefined,
      minimumLevel: defined(opt.minZoom) ? opt.minZoom : undefined,
    };
    if (this.options.subdomains) {
      imageProviderOpt.subdomains = this.options.subdomains;
    }
    const urlLayer = new UrlTemplateImageryProvider(imageProviderOpt);
    // based on https://sandcastle.cesium.com/index.html?src=Imagery%2520Layers%2520Manipulation.html
    const layer = new ImageryLayer(urlLayer, { show: false });
    if (this.options.opacity !== undefined && this.options.opacity !== null) {
      layer.alpha = this.options.opacity;
    }
    this._layer = layer;

    return layer;
  }

  showLayer(layer: ImageryLayer): void {
    layer.show = true;
    if (!this._added) {
      // TODO: order is not work in this way, need to use index of all added layers array
      const order =
        this.options.order !== undefined
          ? this.options.order * 1000
          : undefined;
      this.map.imageryLayers.add(layer);
      addToTileCatalog(this.map.imageryLayers, layer, order);
      this._added = true;
    }

    super.showLayer();
  }

  hideLayer(layer: ImageryLayer): void {
    layer.show = false;
    // this.map.imageryLayers.remove(layer, false);
    super.hideLayer();
  }

  beforeRemove(): void {
    if (this._layer) {
      removeFromTileCatalog(this.map.imageryLayers, this._layer);
      this.map.imageryLayers.remove(this._layer, true);
    }
    super.beforeRemove();
  }
}
