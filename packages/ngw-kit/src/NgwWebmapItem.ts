import { EventEmitter } from 'events';

import { Item } from '@nextgis/item';
import { treeSome } from '@nextgis/tree';

import { WebmapLayerOpacityPropertyHandler } from './utils/WebmapLayerOpacityPropertyHandler';
import { setScaleRatio } from './utils/utils';

import type { TreeGroup, TreeItem, TreeLayer } from './interfaces';
import type { ItemOptions } from '@nextgis/item';
import type NgwConnector from '@nextgis/ngw-connector';
import type {
  GetLegendOptions,
  ImageAdapterOptions,
  LayerAdapter,
  LayerAdapterDefinition,
  LayerLegend,
  VectorAdapterOptions,
  WebMap,
} from '@nextgis/webmap';

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
    if (item.item_type === 'group' || item.item_type === 'root') {
      return this.initGroupItem(item as TreeGroup);
    } else {
      return this.initLayerItem(item as TreeLayer);
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

  getLayer() {
    return this.layer;
  }

  async getLegend(options?: GetLegendOptions): Promise<LayerLegend[]> {
    const id = this.layer?.id;
    if (id !== undefined) {
      const connector = this.connector;
      if (connector) {
        const ngwLegend = await connector.get('render.legend_symbols', {
          params: { id: this.item.resourceId },
          ...options,
        });
        const legend: LayerLegend = {
          layerId: id,
          legend: ngwLegend.map(({ display_name, icon }) => ({
            name: display_name,
            symbol: icon,
          })),
        };
        return [legend];
      }
    }

    return [];
  }

  protected getItemOptions(item: TreeGroup | TreeLayer): Record<string, any> {
    const transparency = item.item_type === 'layer' && item.layer_transparency;
    const opacity =
      typeof transparency === 'number' ? (100 - transparency) / 100 : undefined;
    const options: Partial<ImageAdapterOptions> &
      Pick<VectorAdapterOptions, 'popupOptions'> = {
      visibility: false,
      name: item.display_name,
      ...this.options,
      params: { resource: this.item.resourceId, item: this.item },
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
    if (this.options.popupOptions) {
      options.popupOptions = this.options.popupOptions;
    }
    if (item.item_type === 'layer') {
      const { maxZoom, minZoom } = this._getZoomRange(item);

      Object.assign(options, {
        updateWmsParams: item.updateWmsParams,
        ...this.options,
        url: item.url,
        maxZoom,
        minZoom,
        minScale: item.layer_min_scale_denom,
        maxScale: item.layer_max_scale_denom,
        interactive: item.layer_identifiable,
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

  private initGroupItem(group: TreeGroup): Promise<void> {
    if (group.children && group.children.length) {
      const children = this.getChildren(group);
      for (const child of children) {
        const childItem = new (this.constructor as typeof NgwWebmapItem)(
          this.webMap,
          child,
          this.options,
          this.connector,
          this,
        );
        this.tree.addChild(childItem);
      }
    }
    return Promise.resolve();
  }

  private initLayerItem(layer: TreeLayer): Promise<void> {
    const options: Partial<ImageAdapterOptions> = this.getItemOptions(layer);
    const setNewLayer = (l: LayerAdapter) => {
      layer._layer = l;
      this.layer = l;
      const enabled = this.properties.get('visibility');
      if (enabled) {
        this.properties.set('visibility', true);
      }

      if (options.opacity !== undefined) {
        this.webMap.setLayerOpacity(l, options.opacity);
      }
    };

    let adapter: LayerAdapterDefinition | undefined;
    if (layer.item_type === 'layer') {
      adapter = layer.adapter || layer.layer_adapter.toUpperCase();
    } else if (NgwWebmapItem.GetAdapterFromLayerType[layer.item_type]) {
      const getAdapter = NgwWebmapItem.GetAdapterFromLayerType[layer.item_type];
      adapter = getAdapter(layer, options, this.webMap, this.connector);
    }

    if (adapter) {
      return this.webMap.addLayer(adapter, options).then((newLayer) => {
        setNewLayer(newLayer);
      });
    }

    if (layer._layer) {
      return Promise.resolve(setNewLayer(layer._layer));
    }

    return Promise.reject('No layer added');
  }

  private _getZoomRange(item: TreeLayer) {
    const minZoomWebmap = this.options.minZoom;
    const maxZoomWebmap = this.options.maxZoom;

    const minZoomLayer = item.layer_min_scale_denom
      ? this._mapScaleToZoomLevel(item.layer_min_scale_denom)
      : undefined;
    const maxZoomLayer = item.layer_max_scale_denom
      ? this._mapScaleToZoomLevel(item.layer_max_scale_denom)
      : undefined;

    const minZooms = [minZoomWebmap, minZoomLayer].filter(Boolean) as number[];
    const maxZooms = [maxZoomWebmap, maxZoomLayer].filter(Boolean) as number[];
    const minZoom = minZooms.length ? Math.max(...minZooms) : undefined;
    const maxZoom = maxZooms.length ? Math.min(...maxZooms) : undefined;
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
