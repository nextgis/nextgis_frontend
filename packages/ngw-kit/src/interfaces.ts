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
  GeoJsonAdapterOptions
} from '@nextgis/webmap';
import NgwConnector, { ResourceItem } from '@nextgis/ngw-connector';
import { FeatureLayersIdentify } from '@nextgis/ngw-connector';
import { Feature } from 'geojson';

export type NgwLayerAdapterType = 'IMAGE' | 'TILE' | 'GEOJSON';

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
  item_type: 'root' | 'group' | 'layer';
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
  draw_order_position: any;
  layer_max_scale_denom: any;
  layer_min_scale_denom: any;
  layer_style_id: number;
  layer_transparency: any;

  layer_url?: string;

  adapter?: NgwLayerAdapterType;
  url?: string;

  updateWmsParams?: (parans: any) => any;
}

export interface NgwLayerOptionsAdditional<AA extends NgwLayerAdapterType = NgwLayerAdapterType> {
  id?: string;
  adapter?: AA;
  adapterOptions?: LayerAdaptersOptions[AA];
  headers?: any;
  fit?: boolean;
}

export interface NgwLayerOptions<
  AA extends NgwLayerAdapterType = NgwLayerAdapterType
  > extends NgwLayerOptionsAdditional<AA> {

  resourceId: number;

}

export interface NgwConfig {
  applicationUrl: string;
  assetUrl: string;
  amdUrl: string;
  id: number;
}

export type ResourceDef = number | [number, string];

export interface NgwKitOptions {
  baseUrl?: string;
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
  baseUrl: string;
  resourceId: number | [number, string];
  webMap: WebMap;
  connector: NgwConnector;
  /**
   * Get information from NGW webmap layers by click.
   * @default false
   */
  identification?: boolean;
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
  F extends Feature = Feature> extends VectorLayerAdapter<M, L, O, F> {
  resourceId: number;
  item?: ResourceItem;
  getExtent?(): LngLatBoundsArray | Promise<LngLatBoundsArray> | undefined;
  getIdentificationIds(): Promise<number[] | undefined>;
}
