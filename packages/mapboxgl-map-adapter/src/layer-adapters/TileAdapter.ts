import { BaseLayerAdapter, TileAdapterOptions } from '@nextgis/webmap';
import { BaseAdapter } from './BaseAdapter';
import { RasterSource } from 'mapbox-gl';

export class TileAdapter extends BaseAdapter<TileAdapterOptions> implements BaseLayerAdapter {

  addLayer(options: TileAdapterOptions): string[] {
    options = { ...this.options, ...(options || {}) };

    let tiles: string[];
    if (options && options.subdomains) {
      tiles = options.subdomains.split('').map((x) => {
        const subUrl = options.url.replace('{s}', x);
        return subUrl;
      },
      );
    } else {
      tiles = [options.url];
    }

    const sourceOptions: RasterSource = {
      type: 'raster',
      // point to our third-party tiles. Note that some examples
      // show a "url" property. This only applies to tilesets with
      // corresponding TileJSON (such as mapbox tiles).
      tiles,
      tileSize: 256, // opt && opt.tileSize ||
    };
    if (options.attribution) {
      sourceOptions.attribution = options.attribution;
    }

    this.map.addLayer({
      id: this.id,
      type: 'raster',
      layout: {
        visibility: 'none',
      },
      source: sourceOptions,
      // TODO: clean remove before options from all existing apps
      // @ts-ignore
    }, options.before);
    this.layer = [this.id];
    return this.layer;
  }
}
