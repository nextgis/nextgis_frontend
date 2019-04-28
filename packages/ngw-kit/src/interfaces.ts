/**
 * @module ngw-kit
 */

import WebMap, { AdapterOptions, LayerAdaptersOptions, WebMapEvents, MapClickEvent } from '@nextgis/webmap';
import NgwConnector from '@nextgis/ngw-connector';
import { FeatureLayersIdentify } from '@nextgis/ngw-connector';

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
  resourceId?: number;
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

export interface NgwLayerOptions<A extends NgwLayerAdapterType = NgwLayerAdapterType> {
  resourceId: number;
  id?: string;
  adapter?: A;
  adapterOptions?: LayerAdaptersOptions[A];
  headers?: any;
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

export interface WebMapAdapterOptions extends AdapterOptions {
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
  /**
   * WKT Polygon geometry
   */
  geom: string;
  srs: 3857;
  layers: string[];
}

export interface IdentifyEvent {
  ev: MapClickEvent;
  data: FeatureLayersIdentify;
}

export interface WebMapLayerAdapterEvents extends WebMapEvents {
  identify: IdentifyEvent;
}
