import WebMap, { StarterKit, AdapterOptions, LayerAdaptersOptions, LayerAdapter } from '@nextgis/webmap';

export interface QmsOptions {
  url: string;
}

type QmsLayerType = 'tms';

export interface QmsAdapterOptions extends AdapterOptions {
  name: string;
  qmsid?: number;
}

interface GeoserviceInList {
  id: number;
  guid: string;
  name: string;
  desc: string;
  type: string;
  epsg: number;
}

interface Geoservice {
  id: number;
  guid: string;
  name: string;
  desc: string;
  type: QmsLayerType;
  epsg: number;
  license_name: string;
  license_url: string;
  copyright_text: string;
  copyright_url: string;
  terms_of_use_url: string;
  url: string;
  z_min: any;
  z_max: any;
  y_origin_top: boolean;
  icon: number;
}

export default class QmsKit implements StarterKit {

  options: QmsOptions = {
    url: 'https://qms.nextgis.com',
  };

  url: string;
  map?: WebMap;

  constructor(options?: QmsOptions) {
    this.options = { ...this.options, ...options };
    this.url = this.options.url;
  }

  getLayerAdapters() {
    return Promise.resolve([{
      name: 'QMS',
      createAdapter: (webmap: WebMap) => Promise.resolve(this._createAdapter(webmap)),
    }]);
  }

  async getQmsServices() {
    return loadJSON<GeoserviceInList[]>(this.url + '/api/v1/geoservices/');
  }

  private _getNameFromOptions(options: QmsAdapterOptions) {
    if (options.qmsid) {
      return 'qms-' + (typeof options.qmsid === 'string' ? parseInt(options.qmsid, 10) : options.qmsid);
    } else if (options.id) {
      return options.id;
    }
  }

  private _createAdapter(webMap: WebMap) {
    const url = this.url;
    this.map = webMap;
    const alias: { [key in QmsLayerType]: keyof LayerAdaptersOptions } = {
      tms: 'TILE',
    };

    const getNameFromOptions = this._getNameFromOptions;

    const adapter = function (this: LayerAdapter, m: WebMap, options: QmsAdapterOptions) {
      this.map = m;
      const name = getNameFromOptions(options);
      if (name) {
        this.name = name;
      }
      this.options = options;
    };

    adapter.prototype.addLayer = async function (options: QmsAdapterOptions) {

      // qmsid for request, id for store
      const service = await loadJSON<Geoservice>(url + '/api/v1/geoservices/' + (options.qmsid || options.id));
      if (service) {
        const type = alias[service.type];
        const webMapAdapter = webMap.mapAdapter.layerAdapters[type];
        if (webMapAdapter) {
          if (type === 'TILE') {
            const protocol = (location.protocol === 'https:' ? 'https' : 'http') + '://';
            const serviceUrl = service.url.replace(/^(https?|ftp):\/\//, protocol);
            options.id = getNameFromOptions(options);
            options.url = serviceUrl;
            options.name = service.name;
            options.attribution = service.copyright_text;

            options.maxZoom = webMap.options.maxZoom;
            options.minZoom = webMap.options.minZoom;
            this.options = { ...this.options, ...options };
            return webMapAdapter.prototype.addLayer.call(this, options);
          }
        }
      }
    };
    return adapter;
  }
}

function loadJSON<T = any>(url: string): Promise<T> {
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

function fixUrlStr(url: string) {
  // remove double slash
  return url.replace(/([^:]\/)\/+/g, '$1');
}
