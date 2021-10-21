import { EventEmitter } from 'events';
import { Item } from '@nextgis/item';
import { treeSome } from '@nextgis/tree';
import {
  WebMap,
  LayerAdapter,
  ImageAdapterOptions,
  LayerAdapterDefinition,
} from '@nextgis/webmap';
import { objectAssign } from '@nextgis/utils';

import { setScaleRatio } from './utils/utils';
import { WebmapLayerOpacityPropertyHandler } from './utils/WebmapLayerOpacityPropertyHandler';

import type { ItemOptions } from '@nextgis/item';
import type NgwConnector from '@nextgis/ngw-connector';
import type { TreeGroup, TreeLayer, TreeItem } from './interfaces';

export class NgwWebmapItem extends Item<ItemOptions> {
  static GetAdapterFromLayerType: {
    [layerType: string]: (
      item: TreeItem,
      options: any,
      webMap: WebMap,
      connector?: NgwConnector,
    ) => LayerAdapterDefinition;
  } = {};

  static options: ItemOptions = {
    properties: [
      {
        type: 'boolean',
        name: 'visibility',
        getProperty(item?: NgwWebmapItem): boolean {
          if (item) {
            if (
              item.item.item_type === 'group' ||
              item.item.item_type === 'root'
            ) {
              return treeSome<TreeGroup | TreeLayer>(
                item.item,
                (i) => ('layer_enabled' in i ? i.layer_enabled : false),
                (i) => (i as TreeGroup).children,
              );
            } else if (item.item.item_type === 'layer') {
              return item.item.layer_enabled;
            }
            // else if (item.item.item_type === 'root') {
            //   return true;
            // }
          }
          return false;
        },
        onSet(
          value: boolean,
          options?: Record<string, any>,
          item?: NgwWebmapItem,
        ): void {
          if (item && item.item.item_type === 'layer') {
            if (item.layer) {
              if (value) {
                item.webMap.showLayer(item.layer);
              } else {
                item.webMap.hideLayer(item.layer);
              }
            }
            item.item['layer_enabled'] = value;
          }
        },
      },
      {
        name: 'opacity',
        handler: WebmapLayerOpacityPropertyHandler,
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
    noInit?: boolean,
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
    parent?: NgwWebmapItem,
  ): Promise<NgwWebmapItem> {
    const ngwWebmapItem = new NgwWebmapItem(
      webMap,
      item,
      options,
      connector,
      parent,
      true,
    );
    await ngwWebmapItem._init(item);
    return ngwWebmapItem;
  }

  initItem(item: TreeGroup | TreeLayer): Promise<void> {
    const i = item;
    const options: Partial<ImageAdapterOptions> = this.getItemOptions(item);
    const setNewLayer = (l: LayerAdapter) => {
      i._layer = l;
      this.layer = l;
      const enabled = this.properties.get('visibility');
      if (enabled) {
        this.properties.set('visibility', true);
      }

      if (options.opacity !== undefined) {
        this.webMap.setLayerOpacity(l, options.opacity);
      }
    };

    if (item.item_type === 'group' || item.item_type === 'root') {
      if (item.children && item.children.length) {
        this.getChildren(item).forEach((x) => {
          const children = new NgwWebmapItem(
            this.webMap,
            x,
            this.options,
            this.connector,
            this,
          );
          this.tree.addChild(children);
        });
      }
      return Promise.resolve();
    } else {
      let adapter: LayerAdapterDefinition | undefined;
      if (item.item_type === 'layer') {
        adapter = item.adapter || item.layer_adapter.toUpperCase();
      } else if (NgwWebmapItem.GetAdapterFromLayerType[item.item_type]) {
        const getAdapter =
          NgwWebmapItem.GetAdapterFromLayerType[item.item_type];
        adapter = getAdapter(item, options, this.webMap, this.connector);
      }

      if (adapter) {
        return this.webMap.addLayer(adapter, options).then((newLayer) => {
          setNewLayer(newLayer);
        });
      }
    }
    if (item._layer) {
      return Promise.resolve(setNewLayer(item._layer));
    }
    return Promise.reject('No layer added');
  }

  bringToFront(): void {
    //
  }

  fit(): void {
    if (this.item.item_type === 'layer') {
      // console.log(this.item);
    }
  }

  getLayer() {
    return this.layer;
  }

  protected getItemOptions(item: TreeGroup | TreeLayer): Record<string, any> {
    const transparency = item.item_type === 'layer' && item.layer_transparency;
    const opacity =
      typeof transparency === 'number' ? (100 - transparency) / 100 : undefined;
    const options: Partial<ImageAdapterOptions> = {
      visibility: false,
      headers: this.options.headers,
      crossOrigin: this.options.crossOrigin,
      setViewDelay: this.options.setViewDelay,
      params: { resource: this.item.resourceId },
    };
    if (this.options.order) {
      const subOrder =
        this.options.drawOrderEnabled && 'draw_order_position' in item
          ? this._rootDescendantsCount - item.draw_order_position
          : this.id;

      // 9 > 0009, 11 > 0011
      // TODO: find better way to set order in sub level, not limit by 1000 layer in group
      const subLevel = String(subOrder).padStart(4, '0');
      options.order = Number((this.options.order | 0) + '.' + subLevel);
    }
    if (item.item_type === 'layer') {
      const { maxZoom, minZoom } = this._getZoomRange(item);

      objectAssign(options, {
        updateWmsParams: item.updateWmsParams,
        url: item.url,
        headers: this.options.headers,
        ratio: this.options.ratio,
        maxZoom,
        minZoom,
        minScale: item.layer_min_scale_denom,
        maxScale: item.layer_max_scale_denom,
      });
    }
    if (opacity !== undefined) {
      options.opacity = opacity;
    }
    return options;
  }

  protected getChildren(item: TreeGroup): (TreeGroup | TreeLayer)[] {
    return [...item.children].reverse();
  }

  private _mapScaleToZoomLevel(scale: number) {
    return setScaleRatio(scale);
  }

  private _getZoomRange(item: TreeLayer) {
    const minZoomMap = this.webMap.options.minZoom;
    const maxZoomMap = this.webMap.options.maxZoom;

    const minZoomWebmap = this.options.minZoom;
    const maxZoomWebmap = this.options.maxZoom;

    const minZoomLayer = item.layer_min_scale_denom
      ? this._mapScaleToZoomLevel(item.layer_min_scale_denom)
      : undefined;
    const maxZoomLayer = item.layer_max_scale_denom
      ? this._mapScaleToZoomLevel(item.layer_max_scale_denom)
      : undefined;

    const minZooms = [minZoomMap, minZoomWebmap, minZoomLayer].filter(
      Boolean,
    ) as number[];
    const maxZooms = [maxZoomMap, maxZoomWebmap, maxZoomLayer].filter(
      Boolean,
    ) as number[];
    const minZoom = Math.max(...minZooms);
    const maxZoom = Math.min(...maxZooms);
    return { minZoom, maxZoom };
  }

  private _init(item: TreeGroup | TreeLayer) {
    this.initItem(item).then(() => {
      this.emitter.emit('init');
    });
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
