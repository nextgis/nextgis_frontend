import { updateUrlParams } from '@nextgis/utils';

import { convertZoomLevel } from '../utils/convertZoomLevel';
import { setupLayerTransformRequest } from '../utils/setupLayerTransformRequest';

import { BaseRasterAdapter } from './BaseRasterAdapter';

import type {
  MainLayerAdapter,
  RasterAdapterOptions,
  TileAdapterOptions,
  UpdateLayerAdapterOptions,
} from '@nextgis/webmap';
import type {
  LayerSpecification,
  RasterLayerSpecification,
  RasterSourceSpecification,
  RasterTileSource,
} from 'maplibre-gl';

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
      const { headers, withCredentials } = options;
      if (headers || withCredentials) {
        setupLayerTransformRequest({
          map: this.map,
          url: options.url,
          headers,
          withCredentials,
        });
      }

      const sourceOptions: RasterSourceSpecification = {
        type: 'raster',
        // point to our third-party tiles. Note that some examples
        // show a "url" property. This only applies to tilesets with
        // corresponding TileJSON (such as maplibre tiles).
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

  updateLayer(options?: UpdateLayerAdapterOptions): void {
    const source = this.map?.getSource(
      this._layerId + '_source',
    ) as RasterTileSource;
    if (source) {
      const params = options?.params;

      source.setTiles(
        source.tiles.map((t) => updateUrlParams(t, params || {})),
      );
    }
  }
}
