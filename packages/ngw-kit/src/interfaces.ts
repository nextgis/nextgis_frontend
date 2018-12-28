import WebMap, { AdapterOptions } from '@nextgis/webmap';
import NgwConnector from '@nextgis/ngw-connector';

export type Adapter = 'IMAGE' | 'TILE' | 'GEOJSON';

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
  id?: number;

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

  adapter?: Adapter;
  url?: string;
  resourceId?: number;
  updateWmsParams?: (parans: any) => any;
}

export interface NgwLayerOptions {
  id: number;
  adapter?: Adapter;
}

export interface NgwConfig {
  applicationUrl: string;
  assetUrl: string;
  amdUrl: string;
  id: number;
}

export interface NgwKitOptions {
  baseUrl?: string;
  pixelRadius?: number;
  resourceId?: number;
  auth?: {
    login: string;
    password: string;
  };
}

export interface RequestOptions {
  srs: number;
  geom: any;
  layers: string[];
}

export interface WebMapAdapterOptions extends AdapterOptions {
  baseUrl: string;
  webMap: WebMap;
  connector: NgwConnector;
}
