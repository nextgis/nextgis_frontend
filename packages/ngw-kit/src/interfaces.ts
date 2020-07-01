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
  MainLayerAdapter,
} from '@nextgis/webmap';
import { PropertiesFilter } from '@nextgis/properties-filter';
import NgwConnector, {
  ResourceItem,
  LayerFeature,
} from '@nextgis/ngw-connector';
import { FeatureLayersIdentify } from '@nextgis/ngw-connector';
import { Type } from '@nextgis/utils';
import { Feature } from 'geojson';

/**
 * @public
 */
export type NgwLayerAdapterType =
  | 'IMAGE'
  | 'TILE'
  | 'GEOJSON'
  | 'MVT'
  | 'WMS'
  | 'TERRAIN'
  | 'MODEL_3D';

/**
 * @public
 */
export interface AppSettings {
  extent_left?: number;
  extent_right?: number;
  extent_bottom?: number;
  extent_top?: number;
  draw_order_enabled?: any;
  bookmark_resource?: any;
  root_item?: TreeGroup;
}

/**
 * @public
 */
export interface TreeItem {
  item_type: 'root' | 'group' | 'layer' | string;
  display_name?: string;
  resourceId?: number | [number, string];
  parentId?: number;
  _layer?: any;
}

/**
 * @public
 */
export interface TreeGroup extends TreeItem {
  item_type: 'root' | 'group';
  group_expanded?: boolean;
  children: Array<TreeLayer | TreeGroup>;
}

/**
 * @public
 */
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

  adapter?: string;
  url?: string;

  updateWmsParams?: (parans: any) => any;
}

/**
 * @public
 */
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

/**
 * @public
 */
export interface ResourceIdNgwLayerOptions<
  T extends NgwLayerAdapterType = NgwLayerAdapterType,
  P = { [name: string]: any }
> extends NgwLayerOptionsAdditional<T, P> {
  resourceId: number;
}

/**
 * @public
 */
export interface KeynamedNgwLayerOptions<
  T extends NgwLayerAdapterType = NgwLayerAdapterType,
  P = { [name: string]: any }
> extends NgwLayerOptionsAdditional<T, P> {
  keyname: string;
}

/**
 * @public
 */
export interface ResourceNgwLayerOptions<
  T extends NgwLayerAdapterType = NgwLayerAdapterType,
  P = { [name: string]: any }
> extends NgwLayerOptionsAdditional<T, P> {
  resource: number | string | NgwLayerOptions | ResourceItem;
}

/**
 * @public
 */
export type NgwLayerOptions<
  T extends NgwLayerAdapterType = NgwLayerAdapterType,
  P = { [name: string]: any }
> =
  | ResourceNgwLayerOptions<T, P>
  | ResourceIdNgwLayerOptions<T, P>
  | KeynamedNgwLayerOptions<T, P>;

/**
 * @public
 */
export interface NgwConfig {
  applicationUrl: string;
  assetUrl: string;
  amdUrl: string;
  id: number;
}

/**
 * @public
 */
export type ResourceDef = number | [number, string];

/**
 * @public
 */
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
   * @defaultValue false
   */
  identification?: boolean;
}

type A = AdapterOptions; // & TreeLayer & TreeGroup;

/**
 * @public
 */
export interface WebMapAdapterOptions extends A {
  resourceId: number | [number, string];
  webMap: WebMap;
  connector: NgwConnector;
  /**
   * Get information from NGW webmap layers by click.
   * @defaultValue false
   */
  identification?: boolean;
  selectable?: boolean;
  /** Radius for searching objects in pixels */
  pixelRadius?: number;
}

/**
 * @public
 */
export interface IdentifyRequestOptions {
  layers: number[];
  connector: NgwConnector;
  radius?: number;
}

/**
 * @public
 */
export interface IdentifyEvent {
  ev: MapClickEvent;
  data: FeatureLayersIdentify;
}

/**
 * @public
 */
export interface WebMapLayerAdapterEvents extends WebMapEvents {
  identify: IdentifyEvent;
}

/**
 * @public
 */
export interface ResourceAdapter<
  M = any,
  L = any,
  O extends GeoJsonAdapterOptions = GeoJsonAdapterOptions,
  F extends Feature = Feature
> extends VectorLayerAdapter<M, L, O, F> {
  resourceId: number;
  item?: ResourceItem;
  baselayer?: boolean;
  getExtent?(): LngLatBoundsArray | Promise<LngLatBoundsArray> | undefined;
  getIdentificationIds(): Promise<number[] | undefined>;
}

/**
 * @public
 */
export type VectorResourceAdapter<
  M = any,
  L = any,
  O extends GeoJsonAdapterOptions = GeoJsonAdapterOptions,
  F extends Feature = Feature
> = ResourceAdapter<M, L, O, F> & VectorLayerAdapter<M, L, O, F>;

/**
 * @public
 */
interface NgwVectorIdentify {
  resources?: number[];
  sourceType: 'vector';
  event: OnLayerClickOptions;
}

/**
 * @public
 */
interface NgwRasterIdentify {
  resources?: number[];
  sourceType: 'raster';
  event: MapClickEvent;
}

/**
 * @public
 */
export interface NgwIdentifyItem {
  resourceId: number;
  featureId: number;
  feature: LayerFeature;
}

/**
 * @public
 */
export type NgwIdentify = FeatureLayersIdentify &
  (NgwVectorIdentify | NgwRasterIdentify);

/**
 * @public
 */
export interface GetIdentifyGeoJsonOptions {
  identify: NgwIdentify;
  connector: NgwConnector;
  multiple?: boolean;
}

/**
 * @public
 */
export interface GetClassAdapterOptions {
  layerOptions: NgwLayerOptions;
  webMap: WebMap;
  connector: NgwConnector;
  item: ResourceItem;
  Adapter?: Type<MainLayerAdapter>;
  addLayerOptionsPriority?: false;
}

/**
 * @public
 */
export type ClassAdapter = Promise<Type<LayerAdapter> | undefined>;

/**
 * @public
 */
export type GetClassAdapterCallback = (
  options: GetClassAdapterOptions
) => Promise<Type<LayerAdapter> | undefined> | undefined;

/**
 * @public
 */
export type GetClassAdapterByType = {
  [adapterType: string]: GetClassAdapterCallback;
};

/**
 * @public
 */
export type GetClassAdapter = GetClassAdapterCallback | GetClassAdapterByType;

/**
 * @public
 */
export interface CompanyLogoOptions {
  padding?: string;
  cssClass?: string;
}

export interface FeatureRequestParams {
  srs?: number;
  fields?: string;
  geom_format?: string;
  limit?: number;
  intersects?: string;
  order_by?: string;
}

export interface GetNgwLayerItemsOptions {
  resourceId: number;
  connector: NgwConnector;
  filters?: PropertiesFilter;
}
