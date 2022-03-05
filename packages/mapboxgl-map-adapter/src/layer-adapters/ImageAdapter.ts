import { MainLayerAdapter, ImageAdapterOptions } from '@nextgis/webmap';
import { TLayer } from '../MapboxglMapAdapter';
import { BaseRasterAdapter } from './BaseRasterAdapter';

import type { Map, RasterSourceSpecification } from 'maplibre-gl';
export class ImageAdapter
  extends BaseRasterAdapter<ImageAdapterOptions>
  implements MainLayerAdapter<Map, TLayer, ImageAdapterOptions>
{
  addLayer(
    options: ImageAdapterOptions & { before?: string },
  ): string[] | undefined {
    if (this.options) {
      options = { ...this.options, ...options };
    }
    let tiles: string[];
    const url = options.url;
    if (url && this.map) {
      if (options.subdomains) {
        tiles = (
          typeof options.subdomains === 'string'
            ? options.subdomains.split('')
            : options.subdomains
        ).map((x) => {
          const subUrl = url.replace('{s}', x);
          return subUrl;
        });
      } else {
        tiles = [url];
      }

      const sourceOptions: RasterSourceSpecification = {
        type: 'raster',
        tiles,
        tileSize: 256,
      };
      if (options.attribution) {
        sourceOptions.attribution = options.attribution;
      }

      this.map.addSource(this._layerId + '_source', sourceOptions);

      this.map.addLayer(
        {
          id: this._layerId,
          type: 'raster',
          layout: {
            visibility: 'none',
          },
          minzoom:
            this.options.minZoom !== undefined
              ? this.options.minZoom - 1
              : undefined,
          maxzoom:
            this.options.maxZoom !== undefined
              ? this.options.maxZoom - 1
              : undefined,
          source: this._layerId + '_source',
          paint: {},
          ...options.nativeOptions,
        },
        options.before,
      );
      this.layer = [this._layerId];
      this.updateOpacity();
      return this.layer;
    }
  }
}
