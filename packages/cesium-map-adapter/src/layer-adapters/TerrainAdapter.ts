/**
 * @module cesium-map-adapter
 */
import { TileAdapterOptions } from '@nextgis/webmap';
import { CesiumTerrainProvider, ImageryLayer } from 'cesium';

import { BaseAdapter } from './BaseAdapter';

type Layer = CesiumTerrainProvider;

export class TerrainAdapter extends BaseAdapter<TileAdapterOptions, Layer> {
  private _layer?: Layer;

  addLayer(opt: TileAdapterOptions) {
    this.options = { ...opt };
    const layer = new CesiumTerrainProvider({
      url: opt.url,
      requestVertexNormals: true,
      credit: opt.attribution,
    });
    this._layer = layer;
    return layer;
  }

  showLayer(layer: CesiumTerrainProvider) {
    // this.map.imageryLayers.addImageryProvider(layer);
    this.map.terrainProvider = layer;
    super.showLayer();
  }

  hideLayer(layer: ImageryLayer) {
    this.map.imageryLayers.remove(layer);
    super.hideLayer();
  }
}
