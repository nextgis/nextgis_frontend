import WebMap, { LngLatBoundsArray, MapClickEvent } from '@nextgis/webmap';
import { ResourceItem, CancelablePromise } from '@nextgis/ngw-connector';
import {
  fixUrlStr,
  getLayerAdapterOptions,
  updateWmsParams,
  sendIdentifyRequest,
  getWebMapExtent
} from './utils';
import { WebMapLayerItem } from './WebMapLayerItem';
import { ItemOptions } from '@nextgis/item';

import StrictEventEmitter from 'strict-event-emitter-types';
import { EventEmitter } from 'events';

import {
  TreeGroup,
  TreeLayer,
  NgwLayerAdapterType,
  WebMapAdapterOptions,
  WebMapLayerAdapterEvents,
  ResourceAdapter
} from './interfaces';

export class WebMapLayerAdapter implements ResourceAdapter {

  layer?: WebMapLayerItem;

  /**
   * Radius for searching objects in pixels
   */
  pixelRadius = 10; // webmapSettings.identify_radius,
  resourceId!: number;
  readonly emitter: StrictEventEmitter<EventEmitter, WebMapLayerAdapterEvents> = new EventEmitter();
  private response?: ResourceItem;
  private _webmapLayersIds?: number[];

  private $$onMapClick?: (ev: MapClickEvent) => void;

  constructor(public map: any, public options: WebMapAdapterOptions) {
    const r = options.resourceId;
    if (Array.isArray(r)) {
      this.resourceId = r[0];
      this.options.id = r[1];
    } else {
      this.resourceId = r;
    }

    if (!this.resourceId) {
      throw new Error('NGW `resourceId` is not defined');
    }
  }

  async addLayer(options: WebMapAdapterOptions): Promise<any> {
    this.options = { ...this.options, ...options };

    this.layer = await this._getWebMapLayerItem();

    if (this.options.identification) {
      const ids = await this._getWebmapIds();
      if (ids) {
        this._webmapLayersIds = ids;
        this.$$onMapClick = (ev: MapClickEvent) => this._onMapClick(ev);
        this.options.webMap.emitter.on('click', this.$$onMapClick);
      }
    }
    return this.layer;
  }

  removeLayer() {
    const mapAdapter = this.options.webMap.mapAdapter;
    if (this.$$onMapClick) {
      this.options.webMap.emitter.off('click', this.$$onMapClick);
    }
    this.getDependLayers().forEach((x) => {
      // @ts-ignore Update x interface
      mapAdapter.removeLayer(x.layer.layer);
    });
    this.$$onMapClick = undefined;
    delete this.options;
    delete this.layer;
    delete this.response;
    delete this._webmapLayersIds;

  }

  showLayer() {
    if (this.layer && this.layer.properties) {
      this.layer.properties.property('visibility').set(true);
    }
  }

  hideLayer() {
    if (this.layer && this.layer.properties) {
      this.layer.properties.property('visibility').set(false);
    }
  }

  getExtent(): LngLatBoundsArray | undefined {
    const webmap = this.response && this.response.webmap;
    if (webmap) {
      return getWebMapExtent(webmap);
    }
  }

  getDependLayers(): Array<TreeGroup | TreeLayer> {
    return (this.layer && this.layer.tree.getDescendants()) || [];
  }

  async getIdentificationIds() {
    if (this._webmapLayersIds) {
      return this._webmapLayersIds;
    } else {
      return await this._getWebmapIds();
    }
  }

  private async _getWebMapLayerItem(): Promise<WebMapLayerItem | undefined> {
    if (this.resourceId) {
      const webmap = await this.getWebMapConfig(this.resourceId);
      if (webmap && webmap.root_item) {
        return new Promise<WebMapLayerItem>((resolve) => {
          const options: ItemOptions = {};
          if (this.options.connector && this.options.connector.options.auth) {
            const headers = this.options.connector.getAuthorizationHeaders();
            if (headers) {
              options.headers = headers;
            }
          }

          const layer = new WebMapLayerItem(this.options.webMap, webmap.root_item, options);
          layer.emitter.on('init', () => resolve(layer));
        });
      }
    }
  }

  private async getWebMapConfig(id: number) {
    try {
      const data = await this.options.connector.get('resource.item', null, { id });
      this.response = data;
      const webmap = data.webmap;
      if (webmap) {
        this._updateItemsParams(webmap.root_item, this.options.webMap);
        return webmap;
      } else {
        // TODO: resource is no webmap
      }
    } catch (er) {
      throw er;
    }
  }

  private _updateItemsParams(item: TreeGroup | TreeLayer, webMap: WebMap) {
    if (item) {
      if (item.item_type === 'group' || item.item_type === 'root') {
        if (item.children) {
          item.children = item.children.map((x) => this._updateItemsParams(x, webMap));
        }
      } else if (item.item_type === 'layer') {
        const url = fixUrlStr(this.options.baseUrl + '/api/component/render/image');
        const resourceId = item.layer_style_id;
        item.url = url;
        item.resourceId = resourceId;
        item.updateWmsParams = (params) => updateWmsParams(params, resourceId);
        item = {
          ...item,
          ...getLayerAdapterOptions({
            adapter: item.layer_adapter.toUpperCase() as NgwLayerAdapterType,
            resourceId,
          }, webMap, this.options.baseUrl)
        };
      }
    }
    return item;
  }

  private async _getWebmapIds(): Promise<number[] | undefined> {
    const webMapItem = this.layer;
    if (webMapItem && webMapItem.item.item_type === 'root') {
      const layers = webMapItem.item.children;
      const promises: Array<CancelablePromise<any>> = [];
      layers.forEach((x) => {
        if (x.item_type === 'layer') {
          const id = x.layer_style_id;
          const promise = this.options.connector.get('resource.item', {}, { id }).then((y) => {
            if (y) {
              const parentId = Number(y.resource.parent.id);
              x.parentId = parentId;
              return parentId;
            }
          });
          promises.push(promise);
        }
      });
      const ids = await Promise.all(promises);
      return ids.filter((x) => x !== undefined);
      // const id = item['layer_style_id']
    }
  }

  // options is temporal to set list of layers id, because layers id is not item parameter now
  private _sendIdentifyRequest(ev: MapClickEvent, options: { layers?: string[] } = {}) {
    if (this._webmapLayersIds) {
      return sendIdentifyRequest(ev, {
        layers: this._webmapLayersIds,
        connector: this.options.connector,
        radius: this.pixelRadius
      }).then((resp) => {
        this.emitter.emit('identify', { ev, data: resp });
        return resp;
      });
    }
  }

  private _onMapClick(ev: MapClickEvent) {
    this._sendIdentifyRequest(ev);
  }
}
