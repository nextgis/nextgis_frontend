import { convertZoomLevel } from '../utils/convertZoomLevel';
import { BaseRasterAdapter } from './BaseRasterAdapter';

import type {
  RasterSourceSpecification,
  RasterLayerSpecification,
  LayerSpecification,
} from 'maplibre-gl';
import type {
  MainLayerAdapter,
  TileAdapterOptions,
  RasterAdapterOptions,
} from '@nextgis/webmap';

type Layer = RasterLayerSpecification;

export class TileAdapter<O extends RasterAdapterOptions = TileAdapterOptions>
  extends BaseRasterAdapter<O>
  implements MainLayerAdapter
{
  addLayer(options: O & { before?: string }): string[] | undefined {
    if (this.map) {
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
      if (options.headers) {
        const transformRequests = this.map.transformRequests;
        transformRequests.push((url: string) => {
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

      const sourceOptions: RasterSourceSpecification = {
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

      this.map.addSource(this._layerId + '_source', sourceOptions);

      const layerOptions: Layer = {
        id: this._layerId,
        type: 'raster',
        layout: {
          visibility: 'none',
        },
        source: this._layerId + '_source',
      };
      if (minZoom) {
        layerOptions.minzoom = convertZoomLevel(minZoom);
      }
      if (maxZoom) {
        layerOptions.maxzoom = convertZoomLevel(maxZoom);
      }
      if (options.nativeOptions) {
        Object.assign(options, options.nativeOptions);
      }

      this.map.addLayer(layerOptions as LayerSpecification, options.before);
      this.layer = [this._layerId];
      this.updateOpacity();
      return this.layer;
    }
  }
}
