import { MainLayerAdapter, ImageAdapterOptions } from '@nextgis/webmap';
import { Map } from 'maplibre-gl';
import { TLayer } from '../MapboxglMapAdapter';
import { BaseAdapter } from './BaseAdapter';

export class ImageAdapter
  extends BaseAdapter<ImageAdapterOptions>
  implements MainLayerAdapter<Map, TLayer, ImageAdapterOptions>
{
  addLayer(options: ImageAdapterOptions): string[] | undefined {
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
          source: {
            type: 'raster',
            tiles,
            tileSize: 256,
          },
          paint: {},
        },
        // @ts-ignore
        options.before,
      );
      this.layer = [this._layerId];
      return this.layer;
    }
  }
}
