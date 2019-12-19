import {
  WebMap,
  BaseLayerAdapter,
  LayerAdaptersOptions,
  Type,
  AdapterOptions
} from '@nextgis/webmap';
import { fixUrlStr } from '@nextgis/utils';
import {
  QmsAdapterOptions,
  QmsBasemap,
  QmsLayerType,
  QmsAdapter as QA
} from './interfaces';

const alias: { [key in QmsLayerType]: keyof LayerAdaptersOptions } = {
  tms: 'TILE'
};

export function updateQmsOptions(
  qms: QmsBasemap
): AdapterOptions & { url: string } {
  const protocol = (location.protocol === 'https:' ? 'https' : 'http') + '://';
  const serviceUrl = qms.url.replace(/^(https?|ftp):\/\//, protocol);
  return {
    url: serviceUrl,
    name: qms.name,
    attribution: qms.copyright_text,
    maxZoom: qms.z_max,
    minZoom: qms.z_min
  };
}

export function loadJSON<T = any>(url: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = () => {
      if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
        if (xmlHttp.responseText) {
          try {
            resolve(JSON.parse(xmlHttp.responseText));
          } catch (er) {
            reject(er);
          }
        }
      }
    };
    xmlHttp.open('GET', fixUrlStr(url), true); // true for asynchronous
    xmlHttp.send();
  });
}

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
        this.qms = await loadJSON<QmsBasemap>(
          url + '/api/v1/geoservices/' + options.qmsId
        );
      }
      const qms = this.qms;
      if (qms) {
        const type = alias[qms.type || 'tms'];
        const webMapAdapter = webMap.mapAdapter.layerAdapters[type];
        if (webMapAdapter) {
          if (type === 'TILE') {
            options = {
              maxZoom: webMap.options.maxZoom,
              minZoom: webMap.options.minZoom,
              ...this.options,
              ...updateQmsOptions(qms)
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
