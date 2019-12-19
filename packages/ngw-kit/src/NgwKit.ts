/**
 * @module ngw-kit
 */

import NgwConnector from '@nextgis/ngw-connector';
import WebMap, { StarterKit, Type } from '@nextgis/webmap';
import {
  getNgwResourceExtent,
  sendIdentifyRequest,
  pixelsInMeterWidth,
  updateWmsParams,
  getLayerAdapterOptions,
  addNgwLayer,
  extendWebMapLayerAdapter,
  setScaleRatio
} from './utils/utils';

import {
  getIdentifyGeoJson,
  getIdentifyGeoJsonParams
} from './utils/identifyUtils';

import {
  getNgwLayerItems,
  getNgwLayerItem,
  getNgwLayerFeatures,
  getNgwLayerFeature,
  createGeoJsonFeature
} from './utils/featureLayerUtils';

import { NgwKitOptions, WebMapAdapterOptions } from './interfaces';
import { WebMapLayerAdapter } from './WebMapLayerAdapter';

export class NgwKit implements StarterKit {
  static utils = {
    addNgwLayer,
    getNgwResourceExtent,
    sendIdentifyRequest,
    pixelsInMeterWidth,
    getNgwLayerFeature,
    getNgwLayerFeatures,
    getNgwLayerItems,
    getNgwLayerItem,
    getIdentifyGeoJson,
    getIdentifyGeoJsonParams,
    createGeoJsonFeature,
    setScaleRatio
  };

  static updateWmsParams = updateWmsParams;

  static getLayerAdapterOptions = getLayerAdapterOptions;

  static addNgwLayer = addNgwLayer;

  url: string;
  connector: NgwConnector;
  webMap?: WebMap;

  constructor(public options: NgwKitOptions) {
    if (this.options.connector) {
      this.url = this.options.connector.options.baseUrl;
      this.connector = this.options.connector;
    } else {
      if (this.options.baseUrl) {
        this.url = this.options.baseUrl;
      } else {
        throw new Error('url is not defined');
      }
      this.connector = new NgwConnector({
        baseUrl: this.url,
        auth: this.options.auth
      });
    }
  }

  async onLoadSync(webMap: WebMap) {
    if (this.options.resourceId && this.url) {
      // TODO: resources from array
      const resourceIds = [this.options.resourceId];

      if (resourceIds.length) {
        for (const r of resourceIds) {
          const options: WebMapAdapterOptions = {
            resourceId: r,
            connector: this.connector,
            baseUrl: this.url,
            webMap
          };
          const layer = (await webMap.addLayer(WebMapLayerAdapter, {
            visibility: true,
            fit: true,
            identification: this.options.identification,
            pixelRadius: this.options.pixelRadius,
            ...options
          })) as WebMapLayerAdapter;
          return layer;
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
      createAdapter: (webmap: WebMap) =>
        Promise.resolve(this._createAdapter(webmap))
    };
  }

  private _createAdapter(webMap: WebMap): Type<WebMapLayerAdapter> {
    const connector = this.connector;
    const baseUrl = this.url;
    return extendWebMapLayerAdapter({
      webMap,
      connector,
      baseUrl
    });
  }
}
