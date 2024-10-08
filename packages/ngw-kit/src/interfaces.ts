import type CancelablePromise from '@nextgis/cancelable-promise';
import type NgwConnector from '@nextgis/ngw-connector';
import type {
  FeatureItem,
  LayerFeature,
  RequestOptions,
  ResourceDefinition,
  ResourceItem,
} from '@nextgis/ngw-connector';
import type { FeatureLayersIdentify } from '@nextgis/ngw-connector';
import type { PropertiesFilter } from '@nextgis/properties-filter';
import type {
  FeatureProperties,
  LngLatBoundsArray,
  Type,
} from '@nextgis/utils';
import type {
  AdapterOptions,
  FilterOptions,
  GeoJsonAdapterOptions,
  LayerAdapter,
  LayerAdaptersOptions,
  MainLayerAdapter,
  MapClickEvent,
  OnLayerMouseOptions,
  PopupOptions,
  RasterAdapterOptions,
  VectorLayerAdapter,
  WebMap,
  WebMapEvents,
} from '@nextgis/webmap';
import type { Feature, Geometry, Polygon, Position } from 'geojson';

declare module '@nextgis/webmap' {
  interface LayerAdaptersOptions {
    'NGW:WEBMAP': Partial<NgwWebmapAdapterOptions>;
  }
}

export type NgwLayerAdapterType =
  | 'IMAGE'
  | 'TILE'
  | 'GEOJSON'
  | 'MVT'
  | 'WMS'
  | 'TERRAIN'
  | 'MODEL_3D'
  | 'NGW:WEBMAP';

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
  style_parent_id?: number;
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
  layer_max_scale_denom?: number;
  layer_min_scale_denom?: number;
  layer_style_id: number;
  style_parent_id: number;
  layer_transparency: number;
  layer_identifiable: boolean;

  layer_url?: string;

  adapter?: string;
  url?: string;

  updateWmsParams?: (parans: any) => any;
}

export type TileNoData = 200 | 404 | 204;

export interface NgwLayerOptions<
  T extends NgwLayerAdapterType = NgwLayerAdapterType,
  P = FeatureProperties,
  A extends Record<string, any> = Record<string, any>,
> {
  resource: ResourceDefinition;
  id?: string;
  Adapter?: Type<MainLayerAdapter>;
  adapter?: T;
  adapterOptions?: Partial<LayerAdaptersOptions[T] & AdapterOptions<A>>;
  fit?: boolean;
  meta?: P;
  headers?: any;
  withCredentials?: boolean;
  simplification?: number;
  /**
   * Parameter for `TILE` and `IMAGE` adapters to say NGW what will be returned if there is no data to render.
   *
   * @remarks
   * In NGW api this parameter is written as follows: `nd=204|404|200`, 200 by default.
   * @defaultValue 200
   */
  tileNoData?: TileNoData;
}

/** @deprecated use {@link NgwLayerOptions} instead */
export type ResourceNgwLayerOptions<
  T extends NgwLayerAdapterType = NgwLayerAdapterType,
  P = { [name: string]: any },
> = NgwLayerOptions<T, P>;

export interface NgwConfig {
  applicationUrl: string;
  assetUrl: string;
  amdUrl: string;
  id: number;
}

export type ResourceIdDef = number | [resourceId: number, layerId: string];

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

export interface NgwWebmapAdapterOptions<M = any> extends A {
  resourceId: ResourceIdDef;
  webMap: WebMap<M>;
  connector: NgwConnector;
  selectable?: boolean;
  /** Radius for searching objects in pixels */
  pixelRadius?: number;
  /**
   * Add baselayers from ngw webmap basemap settings
   * @defaultValue true
   */
  useBasemap?: boolean;
  /**
   * Add baselayer from OsmLayerAdapter if no [webmap_resource].basemap_webmap has been set.
   * @defaultValue false
   */
  defaultBasemap?: boolean;
  /**
   * Set max extent from ngw webmap basemap settings
   * @defaultValue false;
   */
  useExtentConstrained?: boolean;
  popupOptions?: PopupOptions;
}

export interface FeatureLayerIdentifyOptions extends NgwRequestOptions {
  layers: number[];
  connector: NgwConnector;
  geom: Feature<Polygon> | Polygon | Position[];
}

export interface IdentifyRequestOptions extends NgwRequestOptions {
  layers: number[];
  connector: NgwConnector;
  radius?: number;
  geom?: Feature<Polygon> | Polygon;
}

export interface IdentifyEvent {
  ev: MapClickEvent;
  data: FeatureLayersIdentify;
}

export interface NgwWebmapLayerAdapterEvents extends WebMapEvents {
  identify: IdentifyEvent;
}

export interface ResourceAdapter<
  M = any,
  L = any,
  O extends GeoJsonAdapterOptions = GeoJsonAdapterOptions,
  F extends Feature = Feature,
> extends VectorLayerAdapter<M, L, O, F> {
  resourceId: number;
  item?: ResourceItem;
  baselayer?: boolean;
  getBounds?():
    | LngLatBoundsArray
    | Promise<LngLatBoundsArray | undefined>
    | undefined;
  /** @deprecated use {@link ResourceAdapter.getBounds} */
  getExtent?():
    | LngLatBoundsArray
    | Promise<LngLatBoundsArray | undefined>
    | undefined;

  getIdentificationIds(): Promise<number[] | undefined>;
}

export type VectorResourceAdapter<
  M = any,
  L = any,
  O extends GeoJsonAdapterOptions = GeoJsonAdapterOptions,
  F extends Feature = Feature,
> = ResourceAdapter<M, L, O, F> & VectorLayerAdapter<M, L, O, F>;

interface NgwVectorIdentify {
  resources?: number[];
  sourceType: 'vector';
  event: OnLayerMouseOptions;
}

interface NgwRasterIdentify {
  resources?: number[];
  sourceType: 'raster';
  event: MapClickEvent;
}

export interface NgwIdentifyItem {
  resourceId: number;
  featureId: number;
  feature: LayerFeature;
}

export type NgwIdentify = FeatureLayersIdentify &
  (NgwVectorIdentify | NgwRasterIdentify);

export interface GetIdentifyGeoJsonOptions<
  P extends FeatureProperties = FeatureProperties,
> {
  identify: NgwIdentify;
  connector: NgwConnector;
  multiple?: boolean;
  requestOptions?: NgwFeatureRequestOptions<P>;
}

export interface GetClassAdapterOptions {
  layerOptions: NgwLayerOptions;
  webMap: WebMap;
  connector: NgwConnector;
  item: ResourceItem;
  Adapter?: Type<MainLayerAdapter>;
  /** This is some kind of dirty hack. Get rid of */
  addLayerOptionsPriority?: false;
}

export type ClassAdapter = Promise<Type<LayerAdapter> | undefined>;

export type GetClassAdapterCallback = (
  options: GetClassAdapterOptions,
) => Promise<Type<LayerAdapter> | undefined> | undefined;

export type GetClassAdapterByType = {
  [adapterType: string]: GetClassAdapterCallback;
};

export type GetClassAdapter = GetClassAdapterCallback | GetClassAdapterByType;

export interface CompanyLogoOptions {
  padding?: string;
  cssClass?: string;
}

export type GeomFormat = 'wkt' | 'geojson';

export interface FeatureRequestParams {
  srs?: number;
  fields?: string;
  extensions?: string;
  geom_format?: GeomFormat;
  limit?: number;
  intersects?: string;
  order_by?: string;
  geom?: 'yes' | 'no';
  ilike?: string;
  like?: string;
}

type Extensions = keyof FeatureItem['extensions'];

export interface NgwFeatureRequestOptions<
  P extends FeatureProperties = FeatureProperties,
> extends FilterOptions<P> {
  ilike?: string;
  like?: string;
  extensions?: Extensions[] | string[] | null | false;
  geom?: boolean;
  geomFormat?: GeomFormat;
  srs?: number;
}

export interface GetNgwItemOptions extends FetchNgwLayerExtentOptions {
  featureId: number;
}

export type NgwRequestOptions = Pick<RequestOptions, 'cache' | 'signal'>;

export interface FetchNgwLayerExtentOptions extends NgwRequestOptions {
  // TODO: safe rename to resource
  resourceId: number | string;
  connector: NgwConnector;
}

export interface FetchNgwLayerItemExtentOptions
  extends FetchNgwLayerExtentOptions {
  featureId: number;
}

export interface FetchNgwResourceExtent extends NgwRequestOptions {
  resource?: ResourceDefinition | ResourceItem;
  connector: NgwConnector;
}

export type PropertiesForNgwFilter<
  P extends FeatureProperties = FeatureProperties,
> = P & { id: number };

export interface GetNgwItemsOptions<
  P extends FeatureProperties = FeatureProperties,
> extends FetchNgwLayerExtentOptions {
  paramList?: [string, any][];
  filters?: PropertiesFilter<PropertiesForNgwFilter<P>>;
}

export type FetchNgwItemOptions<
  P extends FeatureProperties = FeatureProperties,
> = GetNgwItemOptions & NgwFeatureRequestOptions<P>;

export type FetchNgwItemsOptions<
  P extends FeatureProperties = FeatureProperties,
> = GetNgwItemsOptions<P> &
  NgwFeatureRequestOptions<P> & { clientFilterValidate?: boolean };

export interface FeatureIdentifyRequestOptions {
  /**
   * WKT Polygon geometry
   */
  geom: string;
  srs: 3857;
  layers: number[];
}

export interface NgwFeatureItemResponse<
  F = FeatureProperties,
  G extends Geometry = Geometry,
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

export interface FetchNgwLayerCountOptions {
  connector: NgwConnector;
  resourceId: number;
  cache?: boolean;
}
