import WebMap, { LngLatBoundsArray, MapClickEvent } from '@nextgis/webmap';
import { ResourceItem, CancelablePromise } from '@nextgis/ngw-connector';
import { fixUrlStr } from '@nextgis/utils';
import {
  getLayerAdapterOptions,
  updateWmsParams,
  sendIdentifyRequest,
  getWebMapExtent
} from './utils/utils';
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
  readonly emitter: StrictEventEmitter<
    EventEmitter,
    WebMapLayerAdapterEvents
  > = new EventEmitter();
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
      const ids = await this._getWebMapIds();
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
    this.getDependLayers().forEach(x => {
      if (!('layer' in x)) return;
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

  getDependLayers(): Array<WebMapLayerItem> {
    return (this.layer && this.layer.tree.getDescendants()) || [];
  }

  async getIdentificationIds() {
    const visibleLayers: number[] = [];
    let ids = this._webmapLayersIds;
    if (!ids) {
      ids = await this._getWebMapIds();
      this._webmapLayersIds = ids;
    }
    if (ids && ids.length) {
      let deps = this.getDependLayers();
      deps = deps.sort((a, b) => a.id - b.id);
      deps.forEach(x => {
        const item = x.item;
        const parentId = item.parentId;
        if (parentId !== undefined && item.item_type === 'layer') {
          const visible = x.properties.property('visibility');
          const isVisible = visible.get() && !visible.isBlocked();
          if (isVisible) {
            visibleLayers.push(parentId);
          }
        }
      });
    }
    return visibleLayers;
  }

  private async _getWebMapLayerItem(): Promise<WebMapLayerItem | undefined> {
    if (this.resourceId) {
      const webmap = await this.getWebMapConfig(this.resourceId);
      if (webmap && webmap.root_item) {
        return new Promise<WebMapLayerItem>(resolve => {
          const options: ItemOptions = {};
          if (this.options.connector && this.options.connector.options.auth) {
            const headers = this.options.connector.getAuthorizationHeaders();
            if (headers) {
              options.headers = headers;
            }
          }
          options.order = this.options.order;
          options.drawOrderEnabled = webmap.draw_order_enabled;
          const layer = new WebMapLayerItem(
            this.options.webMap,
            webmap.root_item,
            options
          );
          layer.emitter.on('init', () => resolve(layer));
        });
      }
    }
  }

  private async getWebMapConfig(id: number) {
    try {
      const data = await this.options.connector.get('resource.item', null, {
        id
      });
      this.response = data;
      const webmap = data.webmap;
      if (webmap) {
        this._updateItemsParams(webmap.root_item, this.options.webMap, data);
        return webmap;
      } else {
        // TODO: resource is no webmap
      }
    } catch (er) {
      throw er;
    }
  }

  private _updateItemsParams(
    item: TreeGroup | TreeLayer,
    webMap: WebMap,
    data: ResourceItem
  ) {
    if (item) {
      if (item.item_type === 'group' || item.item_type === 'root') {
        if (item.children) {
          item.children = item.children.map(x =>
            this._updateItemsParams(x, webMap, data)
          );
        }
        if (item.item_type === 'root') {
          item.display_name = data.resource.display_name;
        }
      } else if (item.item_type === 'layer') {
        const url = fixUrlStr(
          this.options.baseUrl + '/api/component/render/image'
        );
        const resourceId = item.layer_style_id;
        item.url = url;
        item.resourceId = resourceId;
        item.updateWmsParams = params => updateWmsParams(params, resourceId);
        item = {
          ...item,
          ...getLayerAdapterOptions(
            {
              adapter: item.layer_adapter.toUpperCase() as NgwLayerAdapterType,
              resourceId
            },
            webMap,
            this.options.baseUrl
          )
        };
      }
    }
    return item;
  }

  private async _getWebMapIds(): Promise<number[] | undefined> {
    const webMapItem = this.layer;
    if (webMapItem && webMapItem.item.item_type === 'root') {
      const layers = webMapItem.tree.getDescendants();
      const promises: Array<CancelablePromise<any>> = [];
      layers.forEach((x: WebMapLayerItem) => {
        const item = x.item;
        if (item.item_type === 'layer') {
          const id = item.layer_style_id;
          const promise = this.options.connector
            .get('resource.item', {}, { id })
            .then(y => {
              if (y) {
                const parentId = Number(y.resource.parent.id);
                item.parentId = parentId;
                return parentId;
              }
            });
          promises.push(promise);
        }
      });
      const ids = await Promise.all(promises);
      return ids.filter(x => x !== undefined);
      // const id = item['layer_style_id']
    }
  }

  private _sendIdentifyRequest(ev: MapClickEvent) {
    if (this._webmapLayersIds) {
      return sendIdentifyRequest(ev, {
        layers: this._webmapLayersIds,
        connector: this.options.connector,
        radius: this.pixelRadius
      }).then(resp => {
        this.emitter.emit('identify', { ev, data: resp });
        return resp;
      });
    }
  }

  private _onMapClick(ev: MapClickEvent) {
    this._sendIdentifyRequest(ev);
  }
}
