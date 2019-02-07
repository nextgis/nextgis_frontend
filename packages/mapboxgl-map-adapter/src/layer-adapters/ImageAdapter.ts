import { LayerAdapter, ImageAdapterOptions } from '@nextgis/webmap';
import { BaseAdapter } from './BaseAdapter';

export class ImageAdapter extends BaseAdapter<ImageAdapterOptions> implements LayerAdapter {

  addLayer(options: ImageAdapterOptions): string[] | undefined {
    if (this.options) {
      options = { ...this.options, ...options };
    }
    let tiles: string[];
    const url = options.url;
    if (url) {
      if (options.subdomains) {
        tiles = options.subdomains.split('').map((x) => {
          const subUrl = url.replace('{s}', x);
          return subUrl;
        },
        );
      } else {
        tiles = [url];
      }

      this.map.addLayer({
        id: String(this.name),
        type: 'raster',
        layout: {
          visibility: 'none',
        },
        source: {
          type: 'raster',
          tiles,
          tileSize: 1024,
        },
        paint: {}
        // @ts-ignore
      }, options.before);
      this.layer = [this.name];
      return this.layer;
    }
  }
}
