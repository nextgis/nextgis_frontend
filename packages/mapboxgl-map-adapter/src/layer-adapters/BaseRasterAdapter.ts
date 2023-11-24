import type { TLayer } from '../MapboxglMapAdapter';
import type { MainLayerAdapter, RasterAdapterOptions } from '@nextgis/webmap';
import type { Map } from 'maplibre-gl';

let ID = 0;

export abstract class BaseRasterAdapter<
  O extends RasterAdapterOptions = RasterAdapterOptions,
> implements MainLayerAdapter<Map, TLayer, O>
{
  layer?: TLayer;
  map?: Map;
  protected readonly _layerId: string;

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

  protected updateOpacity(): void {
    const opacity = this.options.opacity;
    if (this.map && this.layer && opacity !== undefined) {
      for (const l of this.layer) {
        this.map.setPaintProperty(l, 'raster-opacity', opacity);
      }
    }
  }

  abstract addLayer(options: O): TLayer | Promise<TLayer> | undefined;
}
