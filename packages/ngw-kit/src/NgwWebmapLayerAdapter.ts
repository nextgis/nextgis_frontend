import { EventEmitter } from 'events';

import {
  WEBMAP_BASELAYER_ID_PREFIX,
  fetchNgwLayerItems,
} from '@nextgis/ngw-kit';
import { fixUrlStr } from '@nextgis/utils';

import { BookmarkItem } from './BookmarkItem';
import { NgwWebmapItem } from './NgwWebmapItem';
import { createOnFirstShowNgwAdapter } from './adapters/createOnFirstShowNgwAdapter';
import { getNgwWebmapExtent } from './utils/fetchNgwExtent';
import { ngwApiToAdapterOptions } from './utils/ngwApiToAdapterOptions';
import { updateImageParams } from './utils/utils';

import type {
  NgwLayerAdapterType,
  NgwWebmapAdapterOptions,
  NgwWebmapLayerAdapterEvents,
  ResourceAdapter,
  TreeGroup,
  TreeLayer,
} from './interfaces';
import type CancelablePromise from '@nextgis/cancelable-promise';
import type { ItemOptions } from '@nextgis/item';
import type {
  BasemapWebmap,
  ResourceItem,
  WebmapResource,
} from '@nextgis/ngw-connector';
import type { LngLatBoundsArray, Type } from '@nextgis/utils';
import type { LayerLegend } from '@nextgis/webmap';
import type { RasterAdapterOptions, WebMap } from '@nextgis/webmap';
import type StrictEventEmitter from 'strict-event-emitter-types';

export class NgwWebmapLayerAdapter<M = any> implements ResourceAdapter<M> {
  layer?: NgwWebmapItem;

  NgwWebmapItem: Type<NgwWebmapItem> = NgwWebmapItem;
  /**
   * Radius for searching objects in pixels
   */
  pixelRadius = 10; // webmapSettings.identify_radius,
  resourceId!: number;
  webmapClassName = 'webmap';
  readonly emitter: StrictEventEmitter<
    EventEmitter,
    NgwWebmapLayerAdapterEvents
  > = new EventEmitter();
  protected _extent?: LngLatBoundsArray;

  private response?: ResourceItem;
  private _webmapLayersIds?: number[];
  private _webmapBaselayersIds: string[] = [];
  private _lastActiveBaselayer?: string;

  constructor(
    public map: M,
    public options: NgwWebmapAdapterOptions,
  ) {
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

  async addLayer(options: NgwWebmapAdapterOptions): Promise<any> {
    this.options = { ...this.options, ...options };
    this.layer = await this._getWebMapLayerItem();
    const extentConstrained = this.response?.webmap?.extent_constrained;
    if (
      this.options.useExtentConstrained &&
      this._extent &&
      extentConstrained
    ) {
      this.options.webMap.setView({ maxBounds: this._extent });
    }
    return this.layer;
  }

  removeLayer(): void {
    const mapAdapter = this.options.webMap.mapAdapter;

    this.getDependLayers().forEach((x) => {
      if (!('layer' in x)) return;
      // @ts-ignore Update x interface
      mapAdapter.removeLayer(x.layer.layer);
    });

    if (this._webmapBaselayersIds.length) {
      for (const b of this._webmapBaselayersIds) {
        this.options.webMap.removeLayer(b);
      }
      if (this._lastActiveBaselayer) {
        this.options.webMap.showLayer(this._lastActiveBaselayer);
      }
    }

    if (this.options.useExtentConstrained && this._extent) {
      this.options.webMap.setView({ maxBounds: null });
    }

    delete this.layer;
    delete this.response;
    delete this._webmapLayersIds;
  }

  async showLayer(): Promise<void> {
    if (this.layer && this.layer.properties) {
      return this.layer.properties.property('visibility').set(true);
    }
  }

  async hideLayer(): Promise<void> {
    if (this.layer && this.layer.properties) {
      return this.layer.properties.property('visibility').set(false);
    }
  }

  async setOpacity(val: number): Promise<void> {
    if (this.layer && this.layer.properties) {
      return this.layer.properties.property('opacity').set(val);
    }
  }

  /** @deprecated use {@link NgwWebmapLayerAdapter.getBounds} instead */
  getExtent(): LngLatBoundsArray | undefined {
    return this.getBounds();
  }

  getBounds(): LngLatBoundsArray | undefined {
    const webmap = this.response && this.response.webmap;
    if (webmap) {
      return getNgwWebmapExtent(webmap);
    }
  }

  getDependLayers(): Array<NgwWebmapItem> {
    return (this.layer && this.layer.tree.getDescendants()) || [];
  }

  getBookmarksResourceId(): number | undefined {
    const webmap = this.response && this.response.webmap;
    if (webmap) {
      return webmap.bookmark_resource.id;
    }
  }

  fetchBookmarks(): CancelablePromise<BookmarkItem[]> {
    const bookmarkResId = this.getBookmarksResourceId();
    const connector = this.options.connector;
    if (bookmarkResId) {
      return connector.getResourceOrFail(bookmarkResId).then((item) => {
        const labelField = item.feature_layer?.fields.find(
          (x) => x.label_field,
        );
        const keyname = labelField && labelField.keyname;
        return fetchNgwLayerItems({
          connector,
          resourceId: bookmarkResId,
          geom: false,
          fields: keyname ? [keyname] : undefined,
        }).then((items) => {
          const bookmarks: BookmarkItem[] = [];
          for (const i of items) {
            const bookmark = new BookmarkItem({
              item: i,
              resourceId: bookmarkResId,
              labelField: keyname,
              connector,
            });
            bookmarks.push(bookmark);
          }
          return bookmarks;
        });
      });
    }
    throw new Error(
      'Webmap was not loaded correctly, it is impossible to extract bookmarks',
    );
  }

  async getLegend(): Promise<LayerLegend[]> {
    const legends: LayerLegend[] = [];

    let deps = this.getDependLayers();
    deps = deps.sort((a, b) => b.id - a.id);
    for (const d of deps) {
      const layerLegend = await d.getLegend();
      legends.push(...layerLegend);
    }

    return legends;
  }

  async getIdentificationIds(): Promise<number[]> {
    const visibleLayers: number[] = [];
    let ids = this._webmapLayersIds;
    if (!ids) {
      ids = await this._getWebMapIds();
      this._webmapLayersIds = ids;
    }
    if (ids && ids.length) {
      let deps = this.getDependLayers();
      deps = deps.sort((a, b) => b.id - a.id);
      deps.forEach((x) => {
        const item = x.item;
        const parentId = item.parentId;
        if (
          parentId !== undefined &&
          item.item_type === 'layer' &&
          item.layer_identifiable
        ) {
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

  protected async _getWebMapLayerItem(): Promise<NgwWebmapItem | undefined> {
    if (this.resourceId) {
      const webmap = await this.getWebMapConfig(this.resourceId);
      if (webmap && webmap.root_item) {
        return new Promise<NgwWebmapItem>((resolve) => {
          const options: ItemOptions = {};
          if (this.options.connector && this.options.connector.options.auth) {
            const headers = this.options.connector.getAuthorizationHeaders();
            if (headers) {
              options.headers = headers;
            }
          }
          options.setViewDelay = this.options.setViewDelay;
          options.order = this.options.order;
          options.ratio = this.options.ratio;
          options.crossOrigin = this.options.crossOrigin;
          options.minZoom = this.options.minZoom;
          options.maxZoom = this.options.maxZoom;
          options.drawOrderEnabled = webmap.draw_order_enabled;
          options.popupOptions = this.options.popupOptions;
          const layer = new this.NgwWebmapItem(
            this.options.webMap,
            webmap.root_item,
            options,
            this.options.connector,
          );
          layer.emitter.on('init', () => resolve(layer));
        });
      }
    }
  }

  private async getWebMapConfig(id: number) {
    const data = await this.options.connector.getResource(id);
    if (data) {
      this.response = data;
      const webmap = data[
        this.webmapClassName as keyof ResourceItem
      ] as WebmapResource;
      this._setupBaselayers(data);
      if (webmap) {
        this._extent = [
          webmap.extent_left,
          webmap.extent_bottom,
          webmap.extent_right,
          webmap.extent_top,
        ];
        this._updateItemsParams(webmap.root_item, this.options.webMap, data);
        return webmap;
      } else {
        // TODO: resource is no webmap
      }
    }
  }

  private _setupBaselayers(data: ResourceItem) {
    const webMap = this.options.webMap;
    const basemap = this.options.useBasemap ?? true;
    if (basemap) {
      if (data.basemap_webmap && data.basemap_webmap.basemaps.length) {
        const activeBaselayer = webMap.getActiveBaseLayer();
        this._lastActiveBaselayer = activeBaselayer
          ? activeBaselayer.id
          : undefined;
        this._setBasemaps(data.basemap_webmap);
      } else if (this.options.defaultBasemap) {
        webMap.addBaseLayer('OSM', {
          id: 'webmap-default-baselayer',
          name: 'OpenStreetMap',
        });
      }
    }
  }

  private _setBasemaps(baseWebmap: BasemapWebmap) {
    const webMap = this.options.webMap;
    // to avoid set many basemaps on init
    let enabledAlreadySet = false;
    for (const x of baseWebmap.basemaps) {
      createOnFirstShowNgwAdapter({
        webMap,
        connector: this.options.connector,
        item: x,
        adapterOptions: { crossOrigin: this.options.crossOrigin },
      }).then((adapter) => {
        const visibility = enabledAlreadySet ? false : x.enabled;
        if (x.enabled) {
          enabledAlreadySet = true;
        }
        return webMap
          .addBaseLayer(adapter, {
            id: WEBMAP_BASELAYER_ID_PREFIX + x.resource_id,
            name: x.display_name,
            opacity: x.opacity,
            visibility,
          })
          .then((l) => {
            l.id && this._webmapBaselayersIds.push(l.id);
          });
      });
    }
  }

  private _updateItemsParams(
    item: TreeGroup | TreeLayer,
    webMap: WebMap,
    data: ResourceItem,
  ) {
    if (item) {
      if (item.item_type === 'group' || item.item_type === 'root') {
        if (item.children) {
          item.children = item.children.map((x) =>
            this._updateItemsParams(x, webMap, data),
          );
        }
        if (item.item_type === 'root') {
          item.display_name = data.resource.display_name;
        }
      } else if (item.item_type === 'layer') {
        const url = fixUrlStr(
          this.options.connector.options.baseUrl +
            '/api/component/render/image',
        );
        const resourceId = item.layer_style_id;
        item.url = url;
        item.resourceId = resourceId;
        item.updateWmsParams = (params) =>
          updateImageParams(params, resourceId);
        const adapter = item.layer_adapter.toUpperCase() as NgwLayerAdapterType;
        const layerAdapterOptions = ngwApiToAdapterOptions({
          options: {
            adapter,
            resource: resourceId,
          },
          webMap,
          baseUrl: this.options.connector.options.baseUrl || '',
        }) as RasterAdapterOptions;
        item = {
          ...item,
          ...layerAdapterOptions,
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
      for (const x of layers) {
        const item = x.item;
        if (item.item_type === 'layer') {
          const id = item.layer_style_id;
          const promise = this.options.connector.getResource(id).then((y) => {
            if (y) {
              const parentId = Number(y.resource.parent.id);
              item.parentId = parentId;
              return parentId;
            }
          });
          promises.push(promise);
        }
      }
      const ids = await Promise.all(promises);
      return ids.filter((x) => x !== undefined);
    }
  }
}
