import { updateUrlParams } from '@nextgis/utils';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';

import { resolutionOptions } from '../utils/gerResolution';
import { getUrlsWithSubdomains } from '../utils/getUrlsWithSubdomains';
import { setTileLoadFunction } from '../utils/setTileLoadFunction';

import { BaseAdapter } from './BaseAdapter';

import type {
  MainLayerAdapter,
  TileAdapterOptions,
  UpdateLayerAdapterOptions,
} from '@nextgis/webmap';
import type Map from 'ol/Map';
import type { Options } from 'ol/source/XYZ';

export class TileAdapter
  extends BaseAdapter<TileLayer<XYZ>>
  implements MainLayerAdapter
{
  constructor(
    public map: Map,
    public options: TileAdapterOptions,
  ) {
    super(map, options);
  }

  addLayer(options: TileAdapterOptions): TileLayer<XYZ> {
    Object.assign(this.options, options);
    const urls: string[] = getUrlsWithSubdomains(
      options.url,
      options.subdomains,
    );
    const xyzOpt: Options = {
      attributions: options.attribution ? [options.attribution] : [],
      urls,
      // tilePixelRatio: 2
    };
    if (options.crossOrigin) {
      xyzOpt.crossOrigin = options.crossOrigin;
    }
    const source = new XYZ(xyzOpt);
    const { headers, withCredentials } = options;
    if (headers || withCredentials) {
      source.setTileLoadFunction((tile, src) => {
        setTileLoadFunction({ tile, src, headers, withCredentials });
      });
    }
    const layer = new TileLayer({
      source,
      opacity: options.opacity ?? undefined,
      ...resolutionOptions(this.map, options),
      ...options.nativeOptions,
    });
    return layer;
  }

  updateLayer(options?: UpdateLayerAdapterOptions): void {
    if (this.layer) {
      const source = this.layer.getSource();
      if (source) {
        const params = options?.params;
        if (params) {
          const currentUrls = source.getUrls();
          if (currentUrls) {
            const newUrls = currentUrls.map((currentUrl) => {
              return updateUrlParams(currentUrl, params);
            });
            source.setUrls(newUrls);
          }
        } else {
          this.layer.getSource()?.refresh();
        }
      }
    }
  }
}
