import { EventEmitter } from 'events';
import { ItemOptions, Item } from '@nextgis/item';
import {
  WebMap,
  LayerAdapter,
  LayerAdapterDefinition,
  ImageAdapterOptions,
} from '@nextgis/webmap';
import NgwConnector from '@nextgis/ngw-connector';
import { objectAssign } from '@nextgis/utils';

import { setScaleRatio } from './utils/utils';
import { TreeGroup, TreeLayer, TreeItem } from './interfaces';

export class NgwWebmapItem extends Item<ItemOptions> {
  static GetAdapterFromLayerType: {
    [layerType: string]: (
      item: TreeItem,
      options: any,
      webMap: WebMap,
      connector?: NgwConnector
    ) => LayerAdapterDefinition;
  } = {};

  static options: ItemOptions = {
    properties: [
      {
        type: 'boolean',
        name: 'visibility',
        getProperty(item?: NgwWebmapItem): boolean {
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
        onSet(
          value: boolean,
          options?: Record<string, any>,
          item?: NgwWebmapItem
        ): void {
          if (item && item.layer && item.item.item_type === 'layer') {
            if (value) {
              item.webMap.showLayer(item.layer);
            } else {
              item.webMap.hideLayer(item.layer);
            }
            item.item['layer_enabled'] = value;
          }
        },
      },
    ],
  };

  item: TreeGroup | TreeLayer;
  connector?: NgwConnector;
  layer?: LayerAdapter;
  readonly emitter = new EventEmitter();

  protected _rootDescendantsCount = 0;

  constructor(
    public webMap: WebMap,
    item: TreeGroup | TreeLayer,
    options?: ItemOptions,
    connector?: NgwConnector,
    parent?: NgwWebmapItem,
    noInit?: boolean
  ) {
    super({ ...NgwWebmapItem.options, ...options });
    if (connector) {
      this.connector = connector;
    }
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
    if (!noInit) {
      this._init(item);
    }
  }

  static async create(
    webMap: WebMap,
    item: TreeGroup | TreeLayer,
    options?: ItemOptions,
    connector?: NgwConnector,
    parent?: NgwWebmapItem
  ): Promise<NgwWebmapItem> {
    const ngwWebmapItem = new NgwWebmapItem(
      webMap,
      item,
      options,
      connector,
      parent,
      true
    );
    await ngwWebmapItem._init(item);
    return ngwWebmapItem;
  }

  async initItem(item: TreeGroup | TreeLayer): Promise<void> {
    let newLayer = item._layer;
    const i = item;
    const transparency = item.item_type === 'layer' && item.layer_transparency;
    const opacity =
      typeof transparency === 'number' ? (100 - transparency) / 100 : undefined;
    if (item.item_type === 'group' || item.item_type === 'root') {
      if (item.children && item.children.length) {
        this.getChildren(item).forEach((x) => {
          const children = new NgwWebmapItem(
            this.webMap,
            x,
            this.options,
            this.connector,
            this
          );
          this.tree.addChild(children);
        });
      }
    } else {
      let adapter: LayerAdapterDefinition | undefined;
      const options: Partial<ImageAdapterOptions> = {
        visibility: false,
        headers: this.options.headers,
        crossOrigin: this.options.crossOrigin,
      };
      if (this.options.order) {
        const subOrder =
          this.options.drawOrderEnabled && 'draw_order_position' in item
            ? this._rootDescendantsCount - item.draw_order_position
            : this.id;
        options.order = Number((this.options.order | 0) + '.' + subOrder);
      }
      if (item.item_type === 'layer') {
        adapter = item.adapter || item.layer_adapter.toUpperCase();
        const maxZoom = item.layer_max_scale_denom
          ? this._mapScaleToZoomLevel(item.layer_max_scale_denom)
          : this.webMap.options.maxZoom;
        const minZoom = item.layer_min_scale_denom
          ? this._mapScaleToZoomLevel(item.layer_min_scale_denom)
          : this.webMap.options.minZoom;
        objectAssign(options, {
          // FIXME: why items?
          // ...item,
          updateWmsParams: item.updateWmsParams,
          url: item.url,
          headers: this.options.headers,
          maxZoom,
          minZoom,
          minScale: item.layer_min_scale_denom,
          maxScale: item.layer_max_scale_denom,
        });
      } else if (NgwWebmapItem.GetAdapterFromLayerType[item.item_type]) {
        const getAdapter =
          NgwWebmapItem.GetAdapterFromLayerType[item.item_type];
        adapter = await getAdapter(item, options, this.webMap, this.connector);
      }
      if (opacity !== undefined) {
        options.opacity = opacity;
      }
      if (adapter) {
        newLayer = await this.webMap.addLayer(adapter, options);
      }
    }
    if (newLayer) {
      i._layer = newLayer;
      this.layer = newLayer;
      if (this.properties && item.item_type === 'layer' && item.layer_enabled) {
        this.properties.property('visibility').set(true);
      }

      if (opacity !== undefined) {
        this.webMap.setLayerOpacity(newLayer, opacity);
      }
    } else {
      // this.properties.get('visibility').set(true);
    }
  }

  bringToFront(): void {
    //
  }

  fit(): void {
    if (this.item.item_type === 'layer') {
      // console.log(this.item);
    }
  }

  protected getChildren(item: TreeGroup): (TreeGroup | TreeLayer)[] {
    return item.children.reverse();
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
