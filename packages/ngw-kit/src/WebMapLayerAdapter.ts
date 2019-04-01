import WebMap, { BaseLayerAdapter, LngLatBoundsArray } from '@nextgis/webmap';
import { ResourceItem } from '@nextgis/ngw-connector';
import { fixUrlStr, getLayerAdapterOptions, updateWmsParams } from './utils';
import { WebMapLayerItem } from './WebMapLayerItem';
import { ItemOptions } from '@nextgis/item';
import { TreeGroup, TreeLayer, NgwLayerAdapterType, WebMapAdapterOptions } from './interfaces';

export class WebMapLayerAdapter implements BaseLayerAdapter {

  layer?: WebMapLayerItem;
  private resourceId?: number;
  private _dependsLayers: Array<TreeGroup | TreeLayer> = [];
  private response?: ResourceItem;

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
    return this.layer;
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
      const { extent_bottom, extent_left, extent_top, extent_right } = webmap;
      if (extent_bottom && extent_left && extent_top && extent_right) {
        const extent: LngLatBoundsArray = [extent_left, extent_bottom, extent_right, extent_top];
        if (extent[3] > 82) {
          extent[3] = 82;
        }
        if (extent[1] < -82) {
          extent[1] = -82;
        }
        return extent;
      }
    }
  }

  getDependLayers() {
    if (!this._dependsLayers && this.layer) {
      this._dependsLayers = [];
      this.layer.tree.getDescendants().forEach((x) => {
        if (x.adapter) {
          this._dependsLayers.push(x.adapter.layer);
        }
      });
    }
    return this._dependsLayers;
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
}
