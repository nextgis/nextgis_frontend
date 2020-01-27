/**
 * @module ngw-kit
 */

import Item, { ItemOptions } from '@nextgis/item';

import WebMap, { LayerAdaptersOptions, LayerAdapter } from '@nextgis/webmap';
import { TreeGroup, TreeLayer } from './interfaces';
import { setScaleRatio } from './utils/utils';

export class WebMapLayerItem extends Item<ItemOptions> {
  static options: ItemOptions = {
    properties: [
      {
        type: 'boolean',
        name: 'visibility',
        getProperty(item?: WebMapLayerItem) {
          if (item) {
            if (item.item.item_type === 'group') {
              return true;
            } else if (item.item.item_type === 'layer') {
              return item.item.layer_enabled;
            } else if (item.item.item_type === 'root') {
              return true;
            }
          }
          return false;
        },
        onSet(value: boolean, options?: any, item?: WebMapLayerItem) {
          if (item && item.layer && item.item.item_type === 'layer') {
            if (value) {
              item.webMap.showLayer(item.layer);
            } else {
              item.webMap.hideLayer(item.layer);
            }
            item.item['layer_enabled'] = value;
          }
        }
      }
    ]
  };

  item: TreeGroup | TreeLayer;
  layer?: LayerAdapter;

  _rootDescendantsCount = 0;

  constructor(
    public webMap: WebMap,
    item: TreeGroup | TreeLayer,
    options?: ItemOptions,
    parent?: WebMapLayerItem
  ) {
    super({ ...WebMapLayerItem.options, ...options });
    if (parent) {
      this.tree.setParent(parent);
    }
    this.item = item;
    if (this.item.item_type === 'root') {
      this._rootDescendantsCount = this._sumUp(this.item.children);
    } else {
      const root = this.tree.getRoot<this>();
      if (root) {
        this._rootDescendantsCount = root._rootDescendantsCount;
      }
    }

    this.initProperties();
    this._init(item);
  }

  async initItem(item: TreeGroup | TreeLayer) {
    let newLayer = item._layer;
    const i = item;
    if (item.item_type === 'group' || item.item_type === 'root') {
      if (item.children && item.children.length) {
        item.children.reverse().forEach(x => {
          const children = new WebMapLayerItem(
            this.webMap,
            x,
            this.options,
            this
          );
          this.tree.addChild(children);
        });
      }
    } else if (item.item_type === 'layer') {
      const adapter = (item.adapter ||
        item.layer_adapter.toUpperCase()) as keyof LayerAdaptersOptions;
      const maxZoom = item.layer_max_scale_denom
        ? this._mapScaleToZoomLevel(item.layer_max_scale_denom)
        : this.webMap.options.maxZoom;
      const minZoom = item.layer_min_scale_denom
        ? this._mapScaleToZoomLevel(item.layer_min_scale_denom)
        : this.webMap.options.minZoom;
      const options: any = {
        maxZoom,
        minZoom,
        minScale: item.layer_min_scale_denom,
        maxScale: item.layer_max_scale_denom,
        ...item,
        headers: this.options.headers
      };
      if (this.options.order) {
        const subOrder = this.options.drawOrderEnabled
          ? this._rootDescendantsCount - item.draw_order_position
          : this.id;
        options.order = Number((this.options.order | 0) + '.' + subOrder);
      }
      newLayer = await this.webMap.addLayer(adapter, options);
    }
    if (newLayer) {
      i._layer = newLayer;
      this.layer = newLayer;
      if (this.properties && item.item_type === 'layer' && item.layer_enabled) {
        this.properties.property('visibility').set(true);
      }
      const transparency =
        item.item_type === 'layer' && item.layer_transparency;
      if (typeof transparency === 'number') {
        const opacity = (100 - transparency) / 100;
        this.webMap.setLayerOpacity(newLayer, opacity);
      }
    } else {
      // this.properties.get('visibility').set(true);
    }
  }

  bringToFront() {
    //
  }

  fit(): void {
    if (this.item.item_type === 'layer') {
      console.log(this.item);
    }
  }

  private _mapScaleToZoomLevel(scale: number) {
    return setScaleRatio(scale);
  }

  private async _init(item: TreeGroup | TreeLayer) {
    await this.initItem(item);
    this.emitter.emit('init');
  }

  private _sumUp(children: Array<TreeGroup | TreeLayer>, totalValue = 0) {
    for (const child of children) {
      if (child.item_type === 'layer') {
        totalValue += 1;
        child.draw_order_position = child.draw_order_position || totalValue;
      } else if (child.item_type === 'group') {
        totalValue = this._sumUp(child.children, totalValue);
      }
    }
    return totalValue;
  }
}
