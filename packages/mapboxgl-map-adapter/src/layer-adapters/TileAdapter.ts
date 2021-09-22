import {
  MainLayerAdapter,
  TileAdapterOptions,
  RasterAdapterOptions,
} from '@nextgis/webmap';
import { BaseRasterAdapter } from './BaseRasterAdapter';
import { RasterSource, ResourceType, Layer, AnyLayer } from 'maplibre-gl';

export class TileAdapter<O extends RasterAdapterOptions = TileAdapterOptions>
  extends BaseRasterAdapter<O>
  implements MainLayerAdapter
{
  addLayer(options: O & { before?: string }): string[] | undefined {
    options = { ...this.options, ...(options || {}) };
    this.options = options;
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
    if (options.headers && this.map) {
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
    if (options.nativeOptions) {
      Object.assign(options, options.nativeOptions);
    }
    if (this.map) {
      this.map.addLayer(layerOptions as AnyLayer, options.before);
      this.layer = [this._layerId];
      this.updateOpacity();
      return this.layer;
    }
  }
}
