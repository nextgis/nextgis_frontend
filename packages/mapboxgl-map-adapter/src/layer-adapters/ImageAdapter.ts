import { LayerAdapter, ImageAdapterOptions } from '@nextgis/webmap';
import { BaseAdapter } from './BaseAdapter';

export class ImageAdapter extends BaseAdapter implements LayerAdapter {

  addLayer(options?: ImageAdapterOptions): string[] {

    const opt = Object.assign({}, this.options, options || {});

    let tiles;
    if (opt && opt.subdomains) {
      tiles = opt.subdomains.split('').map((x) => {
        const subUrl = opt.url.replace('{s}', x);
        return subUrl;
      },
    );
    } else {
      tiles = [opt.url];
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
        tileSize: opt && opt.tileSize || 1024,
      },
      paint: {}
    // @ts-ignore
    }, options.before);
    this.layer = [this.name];
    return this.layer;
  }
}
