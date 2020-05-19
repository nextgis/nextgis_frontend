/**
 * @module qms-kit
 */
import { WebMap, BaseLayerAdapter } from '@nextgis/webmap';
import { Type, mixinProperties } from '@nextgis/utils';
import { QmsAdapterOptions, QmsBasemap, QmsAdapter as QA } from '../interfaces';
import { alias, updateQmsOptions } from './updateQmsOptions';
import { loadJson } from './loadJson';

export function createQmsAdapter(
  webMap: WebMap,
  url = 'https://qms.nextgis.com'
): Type<BaseLayerAdapter> {
  class QmsAdapter<M = any> implements BaseLayerAdapter<M>, QA {
    qms?: QmsBasemap;

    options: QmsAdapterOptions;
    map: M;

    constructor(map: M, options: QmsAdapterOptions) {
      this.map = map;
      this.options = options;
      this.options.baseLayer = true;
    }

    async addLayer(options: QmsAdapterOptions): Promise<any> {
      // qmsId for request, id for store
      if (!this.qms && options.qmsId) {
        try {
          this.qms = await loadJson<QmsBasemap>(
            url + '/api/v1/geoservices/' + options.qmsId
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
