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

  constructor(public webMap: WebMap, item: TreeGroup | TreeLayer, options?: ItemOptions, parent?: WebMapLayerItem) {
    super({ ...WebMapLayerItem.options, ...options });

    this.item = item;
    if (parent) {
      this.tree.setParent(parent);
    }
    this.initProperties();
    this._init(item);
  }

  async initItem(item: TreeGroup | TreeLayer) {
    let newLayer = item._layer;
    const i = item;
    if (item.item_type === 'group' || item.item_type === 'root') {
      if (item.children && item.children.length) {
        item.children
          .reverse()
          .sort((a, b) => {
            if (a.item_type === 'layer' && b.item_type === 'layer') {
              return b.draw_order_position - a.draw_order_position;
            }
            return 0;
          })
          .forEach(x => {
            const children = new WebMapLayerItem(this.webMap, x, this.options, this);
            this.tree.addChild(children);
          });
      }
    } else if (item.item_type === 'layer') {
      const adapter = (item.adapter || item.layer_adapter.toUpperCase()) as keyof LayerAdaptersOptions;
      const maxZoom = item.layer_max_scale_denom
        ? this._mapScaleToZoomLevel(item.layer_max_scale_denom)
        : this.webMap.options.maxZoom;
      const minZoom = item.layer_min_scale_denom
        ? this._mapScaleToZoomLevel(item.layer_min_scale_denom)
        : this.webMap.options.minZoom;
      const options: any = {
        maxZoom,
        minZoom,
        ...item,
        headers: this.options.headers
      };
      newLayer = await this.webMap.addLayer(adapter, options);
    }
    if (newLayer) {
      i._layer = newLayer;
      this.layer = newLayer;
      if (this.properties && item.item_type === 'layer' && item.layer_enabled) {
        this.properties.property('visibility').set(true);
      }
      const transparency = item.item_type === 'layer' && item.layer_transparency;
      if (transparency !== undefined) {
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
}
