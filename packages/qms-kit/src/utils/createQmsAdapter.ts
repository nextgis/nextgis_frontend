import { mixinProperties } from '@nextgis/utils';
import { alias, updateQmsOptions } from './updateQmsOptions';
import { loadJson } from './loadJson';
import { getSubdomainsOriginUrl } from './getSubmodulesFromOriginUrl';

import type { Type } from '@nextgis/utils';
import type { WebMap, MainLayerAdapter } from '@nextgis/webmap';
import type {
  QmsAdapterOptions,
  QmsBasemap,
  QmsAdapter as QA,
} from '../interfaces';

export function createQmsAdapter(
  webMap: WebMap,
  url = 'https://qms.nextgis.com',
): Type<MainLayerAdapter> {
  class QmsAdapter<M = any> implements MainLayerAdapter<M>, QA {
    qms?: QmsBasemap;

    options: QmsAdapterOptions;
    map: M;

    constructor(map: M, options: QmsAdapterOptions) {
      this.map = map;
      this.options = options;
      this.options.baselayer = true;
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
        const webMapAdapter = webMap.mapAdapter.layerAdapters[type];
        if (webMapAdapter) {
          mixinProperties(QmsAdapter, webMapAdapter, [
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
            const adapter = new webMapAdapter(this.map, options);
            return adapter.addLayer(options);
          }
        }
      }
    }
  }
  return QmsAdapter;
}
