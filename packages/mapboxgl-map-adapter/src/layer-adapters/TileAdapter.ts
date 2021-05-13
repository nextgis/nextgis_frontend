import {
  MainLayerAdapter,
  TileAdapterOptions,
  RasterAdapterOptions,
} from '@nextgis/webmap';
import { BaseAdapter } from './BaseAdapter';
import { RasterSource, ResourceType, Layer, AnyLayer } from 'mapbox-gl';

export class TileAdapter<O extends RasterAdapterOptions = TileAdapterOptions>
  extends BaseAdapter<O>
  implements MainLayerAdapter {
  addLayer(options: O): string[] | undefined {
    options = { ...this.options, ...(options || {}) };
    const { minZoom, maxZoom } = options;
    const tiles: string[] = [];
    const subdomains: string[] | undefined =
      typeof options.subdomains === 'string'
        ? options.subdomains.split('')
        : options.subdomains;
    if (subdomains?.length) {
      subdomains.forEach((x) => {
        tiles.push(options.url.replace(/{s}/, x));
      });
    } else {
      tiles.push(options.url);
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
            headers: options.headers,
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
      tileSize: 256, // opt && opt.tileSize ||
    };
    if (options.attribution) {
      sourceOptions.attribution = options.attribution;
    }
    const layerOptions: Layer = {
      id: this._layerId,
      type: 'raster',
      layout: {
        visibility: 'none',
      },
      source: sourceOptions,
    };

    if (minZoom) {
      layerOptions.minzoom = minZoom - 1;
    }
    if (maxZoom) {
      layerOptions.maxzoom = maxZoom - 1;
    }
    if (this.map) {
      this.map.addLayer(
        layerOptions as AnyLayer,
        // @ts-ignore
        options.before,
      );
      const layer = (this.layer = [this._layerId]);
      return layer;
    }
  }
}
