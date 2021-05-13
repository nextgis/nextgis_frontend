import { TileAdapterOptions } from '@nextgis/webmap';
import { CesiumTerrainProvider } from 'cesium';

import { BaseAdapter } from './BaseAdapter';
import { getDefaultTerrain } from '../utils/getDefaultTerrain';
import { makeUrl } from '../utils/makeUrl';

type Layer = CesiumTerrainProvider;

export class TerrainAdapter extends BaseAdapter<TileAdapterOptions, Layer> {
  private _layer?: Layer;

  addLayer(opt: TileAdapterOptions): CesiumTerrainProvider {
    this.options = { ...this.options, ...opt };
    const url = makeUrl(this.options.url, this.options.headers);
    const layer = new CesiumTerrainProvider({
      url,
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
