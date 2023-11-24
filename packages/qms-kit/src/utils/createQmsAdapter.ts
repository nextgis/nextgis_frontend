import { mixinProperties } from '@nextgis/utils';

import { getSubdomainsOriginUrl } from './getSubmodulesFromOriginUrl';
import { loadJson } from './loadJson';
import { alias, updateQmsOptions } from './updateQmsOptions';

import type {
  CreateQmsAdapterOptions,
  QmsAdapter as QA,
  QmsAdapterOptions,
  QmsBasemap,
} from '../interfaces';
import type { Type } from '@nextgis/utils';
import type { MainLayerAdapter, WebMap } from '@nextgis/webmap';

const URL = 'https://qms.nextgis.com';

export function createQmsAdapter(
  options: CreateQmsAdapterOptions,
): Type<MainLayerAdapter>;
export function createQmsAdapter(
  webMap: WebMap,
  url?: string,
  createOpt?: Partial<QmsAdapterOptions>,
): Type<MainLayerAdapter>;
export function createQmsAdapter(
  webMapOrOptions: WebMap | CreateQmsAdapterOptions,
  url = URL,
  createOpt: Partial<QmsAdapterOptions> = {},
): Type<MainLayerAdapter> {
  let webMap: WebMap;
  if ('webMap' in webMapOrOptions) {
    const { webMap: webMap_, url: url_, ...adapterOptions } = webMapOrOptions;
    webMap = webMap_;
    if (url_) {
      url = url_;
    }
    if (adapterOptions) {
      createOpt = adapterOptions;
    }
  } else {
    webMap = webMapOrOptions;
  }

  if (!url) {
    url = URL;
  }
  class QmsAdapter<M = any> implements MainLayerAdapter<M>, QA {
    qms?: QmsBasemap;

    options: QmsAdapterOptions;
    map: M;

    constructor(map: M, options: QmsAdapterOptions) {
      this.map = map;
      const opt = { ...createOpt, ...options };
      this.options = opt;
      this.options.baselayer = true;
      if (opt.qms) {
        this.qms = opt.qms;
      }
    }

    async addLayer(options: QmsAdapterOptions): Promise<any> {
      // qmsId for request, id for store
      if (!this.qms && options.qmsId) {
        try {
          this.qms = await loadJson<QmsBasemap>(
            url + '/api/v1/geoservices/' + options.qmsId,
          );
        } catch (er) {
          console.error(er);
        }
      }
      const qms = this.qms;
      if (qms) {
        const type = alias[qms.type || 'tms'];
        const WebMapAdapter = webMap.mapAdapter.layerAdapters[type];
        if (WebMapAdapter) {
          mixinProperties(QmsAdapter, WebMapAdapter, [
            'showLayer',
            'hideLayer',
          ]);
          if (type === 'TILE') {
            options = {
              order: 0,
              maxZoom: webMap.options.maxZoom,
              minZoom: webMap.options.minZoom,
              ...this.options,
              ...updateQmsOptions(qms),
            };
            if (qms.origin_url) {
              const [url, subdomains] = getSubdomainsOriginUrl(qms.origin_url);
              if (subdomains.length) {
                options.subdomains = subdomains;
                options.url = url;
              }
            }
            this.options = options;
            const adapter = new WebMapAdapter(this.map, options);
            return adapter.addLayer(options);
          }
        }
      }
    }
  }
  return QmsAdapter;
}
