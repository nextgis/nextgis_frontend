import { updateUrlParams } from '@nextgis/utils';

import type {
  MainLayerAdapter,
  RasterAdapterOptions,
  UpdateLayerAdapterOptions,
} from '@nextgis/webmap';
import type { Map, RasterTileSource } from 'maplibre-gl';

import type { TLayer } from '../MaplibreGLMapAdapter';

let ID = 0;

export abstract class BaseRasterAdapter<
  O extends RasterAdapterOptions = RasterAdapterOptions,
> implements MainLayerAdapter<Map, TLayer, O> {
  layer?: TLayer;
  map?: Map;
  protected readonly _layerId: string;
  protected _tiles: string[] = [];

  constructor(
    map: Map,
    public options: O,
  ) {
    this.map = map;
    this._layerId = `layer-${ID++}`;
  }

  beforeRemove(): void {
    Object.assign(this, { map: undefined });
  }

  setOpacity(value: number): void {
    this.options.opacity = Number(value);
    this.updateOpacity();
  }

  updateLayer(options?: UpdateLayerAdapterOptions): void {
    const source = this.map?.getSource(
      this._layerId + '_source',
    ) as RasterTileSource;
    if (source) {
      source.setTiles(
        this._tiles.map((tile) => updateUrlParams(tile, options?.params || {})),
      );
    }
  }

  protected updateOpacity(): void {
    const opacity = this.options.opacity;
    if (this.map && this.layer && opacity != null) {
      for (const l of this.layer) {
        this.map.setPaintProperty(l, 'raster-opacity', opacity);
      }
    }
  }

  abstract addLayer(options: O): TLayer | Promise<TLayer> | undefined;
}
