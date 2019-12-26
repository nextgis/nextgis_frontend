/**
 * @module mapboxgl-map-adapter
 */
import { BaseLayerAdapter, TileAdapterOptions } from '@nextgis/webmap';
import { BaseAdapter } from './BaseAdapter';
import { RasterSource, ResourceType, Layer } from 'mapbox-gl';

export class TileAdapter extends BaseAdapter<TileAdapterOptions>
  implements BaseLayerAdapter {
  addLayer(options: TileAdapterOptions): string[] {
    options = { ...this.options, ...(options || {}) };
    const { minZoom, maxZoom } = options;
    let tiles: string[];
    if (options && options.subdomains) {
      tiles = options.subdomains.split('').map(x => {
        const subUrl = options.url.replace('{s}', x);
        return subUrl;
      });
    } else {
      tiles = [options.url];
    }
    if (options.headers) {
      // @ts-ignore
      const transformRequests = this.map.transformRequests;
      transformRequests.push((url: string, resourceType: ResourceType) => {
        let staticUrl = url;
        staticUrl = staticUrl.replace(/(z=\d+)/, 'z={z}');
        staticUrl = staticUrl.replace(/(x=\d+)/, 'x={x}');
        staticUrl = staticUrl.replace(/(y=\d+)/, 'y={y}');
        if (staticUrl === options.url) {
          return {
            url,
            headers: options.headers
          };
        }
      });
    }

    const sourceOptions: RasterSource = {
      type: 'raster',
      // point to our third-party tiles. Note that some examples
      // show a "url" property. This only applies to tilesets with
      // corresponding TileJSON (such as mapbox tiles).
      tiles,
      tileSize: 256 // opt && opt.tileSize ||
    };
    if (options.attribution) {
      sourceOptions.attribution = options.attribution;
    }
    const layerOptions: Layer = {
      id: this._layerId,
      type: 'raster',
      layout: {
        visibility: 'none'
      },
      source: sourceOptions
      // TODO: clean remove before options from all existing apps
    };

    if (minZoom) {
      layerOptions.minzoom = minZoom - 1;
    }
    if (maxZoom) {
      layerOptions.maxzoom = maxZoom - 1;
    }

    this.map.addLayer(
      layerOptions,
      // @ts-ignore
      options.before
    );
    const layer = (this.layer = [this._layerId]);
    return layer;
  }
}
