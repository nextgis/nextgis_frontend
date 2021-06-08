import type { Feature, Geometry, Polygon } from 'geojson';
import type {
  WebMap,
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
  FilterOptions,
  RasterAdapterOptions,
} from '@nextgis/webmap';
import type { PropertiesFilter } from '@nextgis/properties-filter';
import type NgwConnector from '@nextgis/ngw-connector';
import type {
  ResourceItem,
  LayerFeature,
  FeatureItem,
  FeatureLayerFields,
} from '@nextgis/ngw-connector';
import type { FeatureLayersIdentify } from '@nextgis/ngw-connector';
import type { Type } from '@nextgis/utils';
import type CancelablePromise from '@nextgis/cancelable-promise';

declare module '@nextgis/webmap' {
  interface LayerAdaptersOptions {
    'NGW:WEBMAP': Partial<NgwWebmapAdapterOptions>;
  }
}

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
  | 'MODEL_3D'
  | 'NGW:WEBMAP';

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
  layer_max_scale_denom?: number;
  layer_min_scale_denom?: number;
  layer_style_id: number;
  layer_transparency: number;

  layer_url?: string;

  adapter?: string;
  url?: string;

  updateWmsParams?: (parans: any) => any;
}

export type TileNoData = 200 | 404 | 204;

/**
 * @public
 */
export interface NgwLayerOptionsAdditional<
  T extends NgwLayerAdapterType = NgwLayerAdapterType,
  P = { [name: string]: unknown }
> {
  id?: string;
  adapter?: T;
  adapterOptions?: LayerAdaptersOptions[T];
  headers?: any;
  fit?: boolean;
  meta?: P;
  simplification?: number;
  /**
   * Parameter for `TILE` and `IMAGE` adapters to say NGW what will be returned if there is no data to render.
   *
   * @remarks
   * In NGW api this parameter is written as follows: `nd=204|404|200`, 200 by default.
   * But in frontend libraries default value id 404 (not founded) for performance purpose.
   *
   * @default 204
   */
  tileNoData?: TileNoData;
}

/**
 * @internal
 * @deprecated use resource instead
 */
export interface ResourceIdNgwLayerOptions<
  T extends NgwLayerAdapterType = NgwLayerAdapterType,
  P = { [name: string]: any }
> extends NgwLayerOptionsAdditional<T, P> {
  resourceId: number;
}

/**
 * @internal
 * @deprecated use resource instead
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
> = ResourceNgwLayerOptions<T, P>;

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
export type ResourceIdDef = number | [resourceId: number, layerId: string];

/**
 * @public
 */
export interface NgwKitOptions {
  baseUrl?: string;
  connector?: NgwConnector;
  /** Radius for searching objects in pixels */
  pixelRadius?: number;
  resourceId?: ResourceIdDef;
  auth?: {
    login: string;
    password: string;
  };
}

type A = AdapterOptions & RasterAdapterOptions;

/**
 * @public
 */
export interface NgwWebmapAdapterOptions<M = any> extends A {
  resourceId: ResourceIdDef;
  webMap: WebMap<M>;
  connector: NgwConnector;
  selectable?: boolean;
  /** Radius for searching objects in pixels */
  pixelRadius?: number;
  /**
   * Add baselayer from OsmLayerAdapter if no [webmap_resource].basemap_webmap has been set.
   * @defaultValue false
   */
  defaultBasemap?: boolean;
}

/**
 * @public
 */
export interface IdentifyRequestOptions {
  layers: number[];
  connector: NgwConnector;
  radius?: number;
  geom?: Feature<Polygon> | Polygon;
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
export interface NgwWebmapLayerAdapterEvents extends WebMapEvents {
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
  getExtent?():
    | LngLatBoundsArray
    | Promise<LngLatBoundsArray | undefined>
    | undefined;
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
  requestOptions?: NgwFeatureRequestOptions;
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
  options: GetClassAdapterOptions,
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
  extensions?: string;
  geom_format?: string;
  limit?: number;
  intersects?: string;
  order_by?: string;
  geom?: 'yes' | 'no';
}

type Extensions = keyof FeatureItem['extensions'];

export interface NgwFeatureRequestOptions<
  P extends { [field: string]: any } = { [field: string]: any }
> extends FilterOptions<P> {
  extensions?: Extensions[] | string[] | null | false;
  geom?: boolean;
  srs?: number;
}

export interface GetNgwItemOptions {
  resourceId: number;
  featureId: number;
  connector: NgwConnector;
}

export interface GetNgwItemsOptions {
  resourceId: number;
  connector: NgwConnector;
  filters?: PropertiesFilter;
}

export type FetchNgwItemsOptions<
  P extends { [field: string]: any } = { [field: string]: any }
> = GetNgwItemsOptions & NgwFeatureRequestOptions<P>;

export interface FeatureIdentifyRequestOptions {
  /**
   * WKT Polygon geometry
   */
  geom: string;
  srs: 3857;
  layers: number[];
}

export interface NgwFeatureItemResponse<
  F = FeatureLayerFields,
  G extends Geometry = Geometry
> extends FeatureItem<F, G> {
  /**
   * To get GeoJson from ngw item
   *
   * @remarks
   * if geometry is not available (see {@link NgwFeatureRequestOptions.geom}), this method will return it anyway
   */
  toGeojson(): CancelablePromise<Feature<G, F>>;
}

export interface IdentifyItemOptions {
  feature: LayerFeature;
  connector: NgwConnector;
}
