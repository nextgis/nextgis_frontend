import WebMap, { StarterKit, Type, BaseLayerAdapter } from '@nextgis/webmap';
import { QmsOptions } from './interfaces';
import { createQmsAdapter } from './utility';

export class QmsKit implements StarterKit {

  options: QmsOptions = {
    url: 'https://qms.nextgis.com',
  };

  url: string;

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

  // async getQmsServices() {
  //   return loadJSON<GeoserviceInList[]>(this.url + '/api/v1/geoservices/');
  // }

  private _createAdapter(webMap: WebMap): Type<BaseLayerAdapter> {
    return createQmsAdapter(webMap, this.url);
  }
}
