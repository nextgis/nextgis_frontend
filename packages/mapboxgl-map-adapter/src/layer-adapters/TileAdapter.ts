import { LayerAdapter } from '@nextgis/webmap';
import { BaseAdapter } from './BaseAdapter';

let ID = 1;

export class TileAdapter extends BaseAdapter implements LayerAdapter {

  addLayer(options?): string {
    this.name = options.id || 'tile-' + ID++;
    const opt = {...this.options, ...(options || {})};

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
        // point to our third-party tiles. Note that some examples
        // show a "url" property. This only applies to tilesets with
        // corresponding TileJSON (such as mapbox tiles).
        tiles,
        tileSize: opt && opt.tileSize || 1024,
      },
    }, options.before);
    return this.name;
  }
}
