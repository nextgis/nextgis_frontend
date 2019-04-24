/**
 * @module ngw-kit
 */

import NgwConnector from '@nextgis/ngw-connector';
import WebMap, { StarterKit, MapClickEvent, Type } from '@nextgis/webmap';
import {
  updateWmsParams,
  getLayerAdapterOptions,
  addNgwLayer,
  extendWebMapLayerAdapter
} from './utils';
import { NgwKitOptions, WebMapAdapterOptions, IdentifyRequestOptions } from './interfaces';
import { WebMapLayerAdapter } from './WebMapLayerAdapter';

export class NgwKit implements StarterKit {

  static updateWmsParams = updateWmsParams;

  static getLayerAdapterOptions = getLayerAdapterOptions;

  static addNgwLayer = addNgwLayer;

  url: string;
  connector: NgwConnector;
  webMap?: WebMap;

  constructor(public options: NgwKitOptions) {

    if (this.options.baseUrl) {
      this.url = this.options.baseUrl;
    } else {
      throw new Error('url is not defined');
    }
    this.connector = new NgwConnector({ baseUrl: this.url, auth: this.options.auth });
  }

  async onLoadSync(webMap: WebMap) {
    if (this.options.resourceId && this.options.baseUrl) {
      // TODO: resources from array
      const resourceIds = [this.options.resourceId];

      if (resourceIds.length) {
        for (const r of resourceIds) {
          const options: WebMapAdapterOptions = {
            resourceId: r,
            connector: this.connector,
            baseUrl: this.options.baseUrl,
            webMap
          };
          const layer = await webMap.addLayer(WebMapLayerAdapter, {
            visibility: true,
            fit: true,
            identification: this.options.identification,
            pixelRadius: this.options.pixelRadius,
            ...options
          }) as WebMapLayerAdapter;
        }
      }
    }
  }

  getLayerAdapters() {
    return Promise.resolve([this._getLayerAdapter()]);
  }

  private _getLayerAdapter() {
    return {
      name: 'WEBMAP',
      createAdapter: (webmap: WebMap) => Promise.resolve(this._createAdapter(webmap)),
    };
  }

  private _createAdapter(webMap: WebMap): Type<WebMapLayerAdapter> {
    const connector = this.connector;
    const baseUrl = this.options.baseUrl;
    return extendWebMapLayerAdapter({
      webMap, connector, baseUrl
    });
  }

}
