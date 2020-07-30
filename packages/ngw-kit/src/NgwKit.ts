import NgwConnector from '@nextgis/ngw-connector';
import {
  WebMap,
  StarterKit,
  Type,
  LayerAdapterCreators,
} from '@nextgis/webmap';

import { extendNgwWebmapLayerAdapter } from './utils/utils';
import { NgwWebmapLayerAdapter } from './NgwWebmapLayerAdapter';
import { classAdapters } from './adapters/createAsyncAdapter';

import {
  NgwKitOptions,
  NgwWebmapAdapterOptions,
  GetClassAdapter,
} from './interfaces';

export class NgwKit implements StarterKit {
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

  static addClassAdapters(cls: string, adapter: GetClassAdapter): void {
    classAdapters[cls] = adapter;
  }

  async onLoadSync(webMap: WebMap): Promise<NgwWebmapLayerAdapter | undefined> {
    if (this.options.resourceId && this.url) {
      // TODO: resources from array
      const resourceIds = [this.options.resourceId];

      if (resourceIds.length) {
        for (const r of resourceIds) {
          const options: NgwWebmapAdapterOptions = {
            resourceId: r,
            connector: this.connector,
            webMap,
          };
          const layer = (await webMap.addLayer(NgwWebmapLayerAdapter, {
            visibility: true,
            fit: true,
            identification: this.options.identification,
            pixelRadius: this.options.pixelRadius,
            ...options,
          })) as NgwWebmapLayerAdapter;
          return layer;
        }
      }
    }
  }

  getLayerAdapters(): Promise<LayerAdapterCreators[]> {
    return Promise.resolve([this._getLayerAdapter()]);
  }

  private _getLayerAdapter() {
    return {
      name: 'WEBMAP',
      createAdapter: (webmap: WebMap) =>
        Promise.resolve(this._createAdapter(webmap)),
    };
  }

  private _createAdapter(webMap: WebMap): Type<NgwWebmapLayerAdapter> {
    const connector = this.connector;
    const baseUrl = this.url;
    return extendNgwWebmapLayerAdapter({
      webMap,
      connector,
      baseUrl,
    });
  }
}
