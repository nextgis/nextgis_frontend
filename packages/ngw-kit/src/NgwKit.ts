/**
 * @module ngw-kit
 */
import NgwConnector from '@nextgis/ngw-connector';
import WebMap, { StarterKit, Type } from '@nextgis/webmap';
import {
  getNgwResourceExtent,
  sendIdentifyRequest,
  pixelsInMeterWidth,
  updateImageParams,
  getLayerAdapterOptions,
  addNgwLayer,
  extendWebMapLayerAdapter,
  setScaleRatio,
} from './utils/utils';

import {
  getIdentifyGeoJson,
  getIdentifyGeoJsonParams,
} from './utils/identifyUtils';

import {
  getNgwLayerItems,
  getNgwLayerItem,
  getNgwLayerFeatures,
  getNgwLayerFeature,
  createGeoJsonFeature,
} from './utils/featureLayerUtils';

import { resourceIdFromLayerOptions } from './utils/resourceIdFromLayerOptions';

import { createBasemapWebmapItemAdapter } from './createBasemapWebmapItemAdapter';
import { createGeoJsonAdapter } from './createGeoJsonAdapter';
import { createRasterAdapter } from './createRasterAdapter';

import {
  NgwKitOptions,
  WebMapAdapterOptions,
  GetClassAdapter,
} from './interfaces';
import { NgwResource } from './NgwResource';
import { WebMapLayerAdapter } from './WebMapLayerAdapter';
import { WebMapLayerItem } from './WebMapLayerItem';
import { classAdapters } from './createAsyncAdapter';

export class NgwKit implements StarterKit {
  static utils = {
    addNgwLayer,
    createBasemapWebmapItemAdapter,
    createGeoJsonFeature,
    createGeoJsonAdapter,
    createRasterAdapter,
    getIdentifyGeoJson,
    getIdentifyGeoJsonParams,
    getNgwResourceExtent,
    getNgwLayerFeature,
    getNgwLayerFeatures,
    getNgwLayerItems,
    getNgwLayerItem,
    pixelsInMeterWidth,
    resourceIdFromLayerOptions,
    sendIdentifyRequest,
    setScaleRatio,
  };

  static classes = {
    WebMapLayerAdapter,
    WebMapLayerItem,
    NgwResource,
  };

  static updateWmsParams = updateImageParams;
  static getLayerAdapterOptions = getLayerAdapterOptions;
  static addNgwLayer = addNgwLayer;

  url: string;
  connector: NgwConnector;
  webMap?: WebMap;

  constructor(public options: NgwKitOptions) {
    if (this.options.connector) {
      this.url = this.options.connector.options.baseUrl || '';
      this.connector = this.options.connector;
    } else {
      if (this.options.baseUrl) {
        this.url = this.options.baseUrl;
      } else {
        throw new Error('url is not defined');
      }
      this.connector = new NgwConnector({
        baseUrl: this.url,
        auth: this.options.auth,
      });
    }
  }

  static addClassAdapters(cls: string, adapter: GetClassAdapter) {
    classAdapters[cls] = adapter;
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
            webMap,
          };
          const layer = (await webMap.addLayer(WebMapLayerAdapter, {
            visibility: true,
            fit: true,
            identification: this.options.identification,
            pixelRadius: this.options.pixelRadius,
            ...options,
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
        Promise.resolve(this._createAdapter(webmap)),
    };
  }

  private _createAdapter(webMap: WebMap): Type<WebMapLayerAdapter> {
    const connector = this.connector;
    const baseUrl = this.url;
    return extendWebMapLayerAdapter({
      webMap,
      connector,
      baseUrl,
    });
  }
}
