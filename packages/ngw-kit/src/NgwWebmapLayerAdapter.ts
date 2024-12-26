import { fixUrlStr } from '@nextgis/utils';
import { EventEmitter } from 'events';

import { createOnFirstShowNgwAdapter } from './adapters/createOnFirstShowNgwAdapter';
import { getNgwWebmapExtent } from './utils/fetchNgwExtent';
import { fetchNgwLayerItems } from './utils/fetchNgwLayerItems';
import { ngwApiToAdapterOptions } from './utils/ngwApiToAdapterOptions';
import { updateImageParams } from './utils/utils';
import { BookmarkItem } from './BookmarkItem';
import { WEBMAP_BASELAYER_ID_PREFIX } from './constants';
import { NgwWebmapItem } from './NgwWebmapItem';

import type { ItemOptions } from '@nextgis/item';
import type { BaseRequestOptions, LayerLegend } from '@nextgis/ngw-connector';
import type { LngLatBoundsArray, Type } from '@nextgis/utils';
import type { RasterAdapterOptions, WebMap } from '@nextgis/webmap';
import type { BasemapWebMapRead } from '@nextgisweb/basemap/type/api';
import type { CompositeRead } from '@nextgisweb/resource/type/api';
import type { WebMapRead } from '@nextgisweb/webmap/type/api';
import type StrictEventEmitter from 'strict-event-emitter-types';

import type {
  NgwLayerAdapterType,
  NgwWebmapAdapterOptions,
  NgwWebmapLayerAdapterEvents,
  ResourceAdapter,
  TreeChildItem,
  TreeItem,
  TreeLayer,
} from './interfaces';

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

  private webmapResource?: WebMapRead;

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
    const extentConstrained = this.webmapResource?.constraining_extent;
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
      // @ts-expect-error Update x interface
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
    delete this.webmapResource;
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
    const webmap = this.webmapResource;
    if (webmap) {
      return getNgwWebmapExtent(webmap);
    }
  }

  getDependLayers(): Array<NgwWebmapItem> {
    return (this.layer && this.layer.tree.getDescendants()) || [];
  }

  getBookmarksResourceId(): number | undefined {
    const webmap = this.webmapResource;
    if (webmap && webmap.bookmark_resource) {
      return webmap.bookmark_resource.id;
    }
  }

  fetchBookmarks(options: BaseRequestOptions): Promise<BookmarkItem[]> {
    const bookmarkResId = this.getBookmarksResourceId();
    const connector = this.options.connector;
    if (bookmarkResId) {
      return connector
        .getResourceOrFail(bookmarkResId, options)
        .then((item) => {
          const labelField = item.feature_layer?.fields.find(
            (x) => x.label_field,
          );
          const keyname = labelField && labelField.keyname;
          return fetchNgwLayerItems({
            connector,
            resourceId: bookmarkResId,
            geom: false,
            fields: keyname ? [keyname] : undefined,
            ...options,
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

  async getLegend(options?: BaseRequestOptions): Promise<LayerLegend[]> {
    const legends: LayerLegend[] = [];

    let deps = this.getDependLayers();
    deps = deps.sort((a, b) => b.id - a.id);
    for (const d of deps) {
      const layerLegend = await d.getLegend(options);
      legends.push(...layerLegend);
    }

    return legends;
  }

  async getIdentificationIds(options?: BaseRequestOptions): Promise<number[]> {
    const visibleLayers: number[] = [];

    let deps = this.getDependLayers();
    deps = deps.sort((a, b) => b.id - a.id);
    deps.forEach((x) => {
      const item = x.item;
      const parentId =
      'style_parent_id' in item ? item.style_parent_id : undefined;
      if (
        parentId !== undefined &&
        parentId !== null &&
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

    return visibleLayers;
  }

  protected async _getWebMapLayerItem(): Promise<NgwWebmapItem | undefined> {
    if (!this.resourceId) {
      return undefined;
    }

    const webmap = await this.getWebMapConfig(this.resourceId);
    if (!webmap || !webmap.root_item) {
      return undefined;
    }

    return new Promise<NgwWebmapItem>((resolve) => {
      const connector = this.options.connector;
      const headers = connector?.options.auth
        ? connector.getAuthorizationHeaders()
        : undefined;
      const withCredentials = connector.withCredentials;

      const options: ItemOptions = {
        ...this.options,
        withCredentials,
        headers,
        drawOrderEnabled: webmap.draw_order_enabled ?? false,
      };

      const layer = new this.NgwWebmapItem(
        this.options.webMap,
        webmap.root_item,
        options,
        connector,
      );

      layer.emitter.on('init', () => {
        resolve(layer);
      });
    });
  }

  private async getWebMapConfig(id: number) {
    const data = await this.options.connector.getResource(id);
    if (data) {
      const webmap = data[
        this.webmapClassName as keyof CompositeRead
      ] as WebMapRead;
      this.webmapResource = webmap;
      this._setupBaselayers(data);
      if (webmap) {
        this._extent = webmap.initial_extent ?? undefined;
        this._updateItemsParams(webmap.root_item, this.options.webMap, data);
        return webmap;
      } else {
        // TODO: resource is no webmap
      }
    }
  }

  private _setupBaselayers(data: CompositeRead) {
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

  private _setBasemaps(baseWebmap: BasemapWebMapRead) {
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
            if (l.id) this._webmapBaselayersIds.push(l.id);
          });
      });
    }
  }

  private _updateItemsParams(
    item: TreeItem,
    webMap: WebMap,
    data: CompositeRead,
  ) {
    if (item) {
      if (item.item_type === 'group' || item.item_type === 'root') {
        if ('children' in item && item.children) {
          const children = item.children.map((x) =>
            this._updateItemsParams(x, webMap, data),
          );
          item.children = children as TreeChildItem[];
        }
        if (item.item_type === 'root') {
          item.display_name = data.resource.display_name;
        }
      } else if (item.item_type === 'layer') {
        const layerItem = item as TreeLayer;

        const url = fixUrlStr(
          this.options.connector.options.baseUrl +
            '/api/component/render/image',
        );
        const resourceId = layerItem.layer_style_id;
        layerItem.url = url;
        layerItem.resourceId = resourceId;
        layerItem.updateWmsParams = (params) =>
          updateImageParams(params, resourceId);
        const adapter =
          layerItem.layer_adapter.toUpperCase() as NgwLayerAdapterType;
        const layerAdapterOptions = ngwApiToAdapterOptions({
          options: {
            adapter,
            resource: resourceId,
          },
          webMap,
          baseUrl: this.options.connector.options.baseUrl || '',
        }) as RasterAdapterOptions;
        item = {
          ...layerItem,
          ...layerAdapterOptions,
        };
      }
    }
    return item;
  }
}
