/**
 * @module cesium-map-adapter
 */
import { TileAdapterOptions } from '@nextgis/webmap';
import { CesiumTerrainProvider } from 'cesium';

import { BaseAdapter } from './BaseAdapter';
import { getDefaultTerrain } from '../utils/getDefaultTerrain';

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

  showLayer() {
    if (this._layer) {
      this.map.terrainProvider = this._layer;
    }
    super.showLayer();
  }

  hideLayer() {
    this.map.terrainProvider = getDefaultTerrain();
    super.hideLayer();
  }
}
