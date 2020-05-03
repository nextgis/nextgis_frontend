/**
 * @module ngw-kit
 */

import WebMap, {
  AdapterOptions,
  LayerAdaptersOptions,
  WebMapEvents,
  MapClickEvent,
  LngLatBoundsArray,
  VectorLayerAdapter,
  GeoJsonAdapterOptions,
  OnLayerClickOptions,
  LayerAdapter,
  BaseLayerAdapter,
} from '@nextgis/webmap';
import NgwConnector, { ResourceItem } from '@nextgis/ngw-connector';
import { FeatureLayersIdentify } from '@nextgis/ngw-connector';
import { Type } from '@nextgis/utils';
import { Feature } from 'geojson';

export type NgwLayerAdapterType =
  | 'IMAGE'
  | 'TILE'
  | 'GEOJSON'
  | 'MVT'
  | 'WMS'
  | 'TERRAIN'
  | 'MODEL_3D';

export interface AppSettings {
  extent_left?: number;
  extent_right?: number;
  extent_bottom?: number;
  extent_top?: number;
  draw_order_enabled?: any;
  bookmark_resource?: any;
  root_item?: TreeGroup;
}

export interface TreeItem {
  item_type: 'root' | 'group' | 'layer' | string;
  display_name?: string;
  resourceId?: number | [number, string];
  parentId?: number;
  _layer?: any;
}

export interface TreeGroup extends TreeItem {
  item_type: 'root' | 'group';
  group_expanded?: boolean;
  children: Array<TreeLayer | TreeGroup>;
}

export interface TreeLayer extends TreeItem {
  item_type: 'layer';
  layer_adapter: string;
  layer_enabled: boolean;
  draw_order_position: number;
  layer_max_scale_denom: number;
  layer_min_scale_denom: number;
  layer_style_id: number;
  layer_transparency: number;

  layer_url?: string;

  adapter?: NgwLayerAdapterType;
  url?: string;

  updateWmsParams?: (parans: any) => any;
}

export interface NgwLayerOptionsAdditional<
  T extends NgwLayerAdapterType = NgwLayerAdapterType,
  P = { [name: string]: unknown }
> {
  id?: string;
  adapter?: T;
  layers?: string;
  adapterOptions?: LayerAdaptersOptions[T];
  headers?: any;
  fit?: boolean;
  meta?: P;
  simplification?: number;
}

export interface ResourceIdNgwLayerOptions<
  T extends NgwLayerAdapterType = NgwLayerAdapterType,
  P = { [name: string]: any }
> extends NgwLayerOptionsAdditional<T, P> {
  resourceId: number;
}
export interface KeynamedNgwLayerOptions<
  T extends NgwLayerAdapterType = NgwLayerAdapterType,
  P = { [name: string]: any }
> extends NgwLayerOptionsAdditional<T, P> {
  keyname: string;
}
export interface ResourceNgwLayerOptions<
  T extends NgwLayerAdapterType = NgwLayerAdapterType,
  P = { [name: string]: any }
> extends NgwLayerOptionsAdditional<T, P> {
  resource: number | string | NgwLayerOptions | ResourceItem;
}

export type NgwLayerOptions<
  T extends NgwLayerAdapterType = NgwLayerAdapterType,
  P = { [name: string]: any }
> =
  | ResourceNgwLayerOptions<T, P>
  | ResourceIdNgwLayerOptions<T, P>
  | KeynamedNgwLayerOptions<T, P>;

export interface NgwConfig {
  applicationUrl: string;
  assetUrl: string;
  amdUrl: string;
  id: number;
}

export type ResourceDef = number | [number, string];

export interface NgwKitOptions {
  baseUrl?: string;
  connector?: NgwConnector;
  /** Radius for searching objects in pixels */
  pixelRadius?: number;
  resourceId?: ResourceDef;
  auth?: {
    login: string;
    password: string;
  };
  /**
   * Get information from NGW webmap layers by click.
   * @default false
   */
  identification?: boolean;
}

type A = AdapterOptions; // & TreeLayer & TreeGroup;

export interface WebMapAdapterOptions extends A {
  resourceId: number | [number, string];
  webMap: WebMap;
  connector: NgwConnector;
  /**
   * Get information from NGW webmap layers by click.
   * @default false
   */
  identification?: boolean;
  selectable?: boolean;
  /** Radius for searching objects in pixels */
  pixelRadius?: number;
}

export interface IdentifyRequestOptions {
  layers: number[];
  connector: NgwConnector;
  radius?: number;
}

export interface IdentifyEvent {
  ev: MapClickEvent;
  data: FeatureLayersIdentify;
}

export interface WebMapLayerAdapterEvents extends WebMapEvents {
  identify: IdentifyEvent;
}

export interface ResourceAdapter<
  M = any,
  L = any,
  O extends GeoJsonAdapterOptions = GeoJsonAdapterOptions,
  F extends Feature = Feature
> extends VectorLayerAdapter<M, L, O, F> {
  resourceId: number;
  item?: ResourceItem;
  baseLayer?: boolean;
  getExtent?(): LngLatBoundsArray | Promise<LngLatBoundsArray> | undefined;
  getIdentificationIds(): Promise<number[] | undefined>;
}

export type VectorResourceAdapter<
  M = any,
  L = any,
  O extends GeoJsonAdapterOptions = GeoJsonAdapterOptions,
  F extends Feature = Feature
> = ResourceAdapter<M, L, O, F> & VectorLayerAdapter<M, L, O, F>;

interface NgwVectorIdentify {
  resources?: number[];
  sourceType: 'vector';
  event: OnLayerClickOptions;
}

interface NgwRasterIdentify {
  resources?: number[];
  sourceType: 'raster';
  event: MapClickEvent;
}

export type NgwIdentify = FeatureLayersIdentify &
  (NgwVectorIdentify | NgwRasterIdentify);

export interface GetIdentifyGeoJsonOptions {
  identify: NgwIdentify;
  connector: NgwConnector;
  multiple?: boolean;
}

export interface GetClassAdapterOptions {
  layerOptions: NgwLayerOptions;
  webMap: WebMap;
  connector: NgwConnector;
  item: ResourceItem;
  Adapter?: Type<BaseLayerAdapter>;
}

export type ClassAdapter = Promise<Type<LayerAdapter> | undefined>;

export type GetClassAdapterCallback = (
  options: GetClassAdapterOptions
) => Promise<Type<LayerAdapter> | undefined> | undefined;

export type GetClassAdapterByType = {
  [adapterType: string]: GetClassAdapterCallback;
};

export type GetClassAdapter = GetClassAdapterCallback | GetClassAdapterByType;
