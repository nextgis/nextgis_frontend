import { StarterKit } from '@nextgis/webmap';

export interface QmsOptions {
  url: string;
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
  type: string;
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

export class QmsKit implements StarterKit {

  options: QmsOptions = {
    url: 'https://qms.nextgis.com',
  };

  url: string;
  map;

  constructor(options?: QmsOptions) {
    this.options = { ...this.options, ...options };
    this.url = this.options.url;

  }

  getLayerAdapters() {
    return Promise.resolve([{
      name: 'QMS',
      createAdapter: (webmap) => Promise.resolve(this._createAdapter(webmap)),
    }]);

  }

  async getQmsServices() {
    return loadJSON<GeoserviceInList[]>(this.url + '/api/v1/geoservices/');
  }

  private _createAdapter(map) {
    const url = this.url;
    this.map = map;
    const alias = {
      tms: 'TILE',
    };
    const adapter = function(m, options) {
      this.map = m;
      this.name = options.id;
    };

    adapter.prototype.addLayer = function(options) {
      return loadJSON<Geoservice>(url + '/api/v1/geoservices/' + options.qmsid).then((service) => {
        if (service) {
          const type = alias[service.type];
          const webMapAdapter = map.layerAdapters[type];
          if (webMapAdapter) {
            if (type === 'TILE') {
              options.url = service.url;
              return webMapAdapter.prototype.addLayer.call(this, options);
            }
          }
        }
      });
    };
    return adapter;
  }
}

function loadJSON<T = any>(url): Promise<T> {
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
    xmlHttp.send(null);
  });
}

function fixUrlStr(url: string) {
  // remove double slash
  return url.replace(/([^:]\/)\/+/g, '$1');
}
