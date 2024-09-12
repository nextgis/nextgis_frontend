import { CesiumTerrainProvider } from 'cesium';

import { getDefaultTerrain } from '../utils/getDefaultTerrain';
import { makeUrl } from '../utils/makeUrl';

import { BaseAdapter } from './BaseAdapter';

import type { TileAdapterOptions } from '@nextgis/webmap';

type Layer = CesiumTerrainProvider;

export class TerrainAdapter extends BaseAdapter<TileAdapterOptions, Layer> {
  private _layer?: Layer;

  async addLayer(opt: TileAdapterOptions): Promise<CesiumTerrainProvider> {
    this.options = { ...this.options, ...opt };
    const url = makeUrl(this.options.url, this.options.headers);
    const layer = await CesiumTerrainProvider.fromUrl(url, {
      requestVertexNormals: true,
      credit: opt.attribution,
    });
    this._layer = layer;
    return layer;
  }

  showLayer(): void {
    if (this._layer) {
      this.map.terrainProvider = this._layer;
    }
    super.showLayer();
  }

  hideLayer(): void {
    this.map.terrainProvider = getDefaultTerrain();
    super.hideLayer();
  }
}
