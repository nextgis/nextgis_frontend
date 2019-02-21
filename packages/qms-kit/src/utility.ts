import { WebMap, BaseLayerAdapter, LayerAdaptersOptions, Type } from '@nextgis/webmap';
import { QmsAdapterOptions, Geoservice, QmsLayerType } from './interfaces';

const alias: { [key in QmsLayerType]: keyof LayerAdaptersOptions } = {
  tms: 'TILE',
};

export function createQmsAdapter(webMap: WebMap, url: string): Type<BaseLayerAdapter> {

  class QmsAdapter implements BaseLayerAdapter {
    constructor(public map: any, public options: QmsAdapterOptions) {
      this.options = options;
    }

    async addLayer(options: QmsAdapterOptions) {

      // qmsId for request, id for store
      const service = await loadJSON<Geoservice>(url + '/api/v1/geoservices/' + options.qmsId);
      if (service) {
        const type = alias[service.type];
        const webMapAdapter = webMap.mapAdapter.layerAdapters[type];
        if (webMapAdapter) {
          if (type === 'TILE') {
            const protocol = (location.protocol === 'https:' ? 'https' : 'http') + '://';
            const serviceUrl = service.url.replace(/^(https?|ftp):\/\//, protocol);

            options.url = serviceUrl;
            options.name = service.name;
            options.attribution = service.copyright_text;

            options.maxZoom = webMap.options.maxZoom;
            options.minZoom = webMap.options.minZoom;
            this.options = { ...this.options, ...options, baseLayer: true };
            const adapter = new webMapAdapter(this.map, options);
            return adapter.addLayer(options);
          }
        }
      }
    }
  }
  return QmsAdapter;
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

export function fixUrlStr(url: string): string {
  // remove double slash
  return url.replace(/([^:]\/)\/+/g, '$1');
}
