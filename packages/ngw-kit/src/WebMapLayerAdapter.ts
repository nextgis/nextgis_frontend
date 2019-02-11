import WebMap, { BaseLayerAdapter, LayerExtent } from '@nextgis/webmap';
import { ResourceItem } from '@nextgis/ngw-connector';
import { fixUrlStr, getLayerAdapterOptions, updateWmsParams } from './utils';
import { WebMapLayerItem } from './WebMapLayerItem';
import { TreeGroup, TreeLayer, Adapter, WebMapAdapterOptions } from './interfaces';

let ID = 1;

export class WebMapLayerAdapter implements BaseLayerAdapter {

  name: string;
  options: WebMapAdapterOptions;
  layer?: WebMapLayerItem;

  private _dependsLayers: any[] = [];
  private response?: ResourceItem;

  constructor(map: any, options: WebMapAdapterOptions) {
    const id = (options && options.id) ? options.id : String(ID++);
    this.name = 'webmap-' + id;
    this.options = options;
    this.options.id = id;
  }

  async addLayer(options?: WebMapAdapterOptions): Promise<any> {
    this.options = { ...this.options, ...options };

    this.name = 'webmap-' + this.options.id;

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

  getExtent(): LayerExtent | undefined {
    if (this.response) {
      const { extent_bottom, extent_left, extent_top, extent_right } = this.response.webmap;
      if (extent_bottom && extent_left && extent_top && extent_right) {
        const extent: LayerExtent = [extent_left, extent_bottom, extent_right, extent_top];
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
    if (this.options.id) {
      const webmap = await this.getWebMapConfig(parseInt(this.options.id, 10));
      if (webmap && webmap.root_item) {
        return new Promise<WebMapLayerItem>((resolve) => {
          const layer = new WebMapLayerItem(this.options.webMap, webmap.root_item);
          layer.emitter.on('init', () => resolve(layer));
        });
      }
    }
  }

  private async getWebMapConfig(id: number) {
    try {
      const data = await this.options.connector.request('resource.item', { id });
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
            adapter: item.layer_adapter.toUpperCase() as Adapter,
            id: resourceId
          }, webMap, this.options.baseUrl)
        };
      }
    }
    return item;
  }
}
