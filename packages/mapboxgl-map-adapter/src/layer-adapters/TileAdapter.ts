import { LayerAdapter, AdapterOptions } from '@nextgis/webmap';
import { BaseAdapter } from './BaseAdapter';
import { RasterSource } from 'mapbox-gl';

let ID = 1;

export class TileAdapter extends BaseAdapter implements LayerAdapter {

  addLayer(options?: AdapterOptions): string[] {
    this.name = options.id || 'tile-' + ID++;
    const opt = { ...this.options, ...(options || {}) };

    let tiles: string[];
    if (opt && opt.subdomains) {
      tiles = opt.subdomains.split('').map((x) => {
        const subUrl = opt.url.replace('{s}', x);
        return subUrl;
      },
      );
    } else {
      tiles = [opt.url];
    }
    const strName = String(this.name);

    const sourceOptions: RasterSource = {
      type: 'raster',
      // point to our third-party tiles. Note that some examples
      // show a "url" property. This only applies to tilesets with
      // corresponding TileJSON (such as mapbox tiles).
      tiles,
      tileSize: opt && opt.tileSize || 256,
    };
    if (opt.attribution) {
      sourceOptions.attribution = opt.attribution;
    }

    this.map.addLayer({
      id: strName,
      type: 'raster',
      layout: {
        visibility: 'none',
      },
      source: sourceOptions,
      // TODO: clean remove before options from all existing apps
      // @ts-ignore
    }, options.before);
    this.layer = [this.name];
    return this.layer;
  }
}
