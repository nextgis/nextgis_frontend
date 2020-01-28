/**
 * @module ngw-connector
 */

export interface TreeItem {
  item_type: 'root' | 'group' | 'layer';
  display_name?: string;
  id?: number;

  _layer?: any;
  _parent?: TreeGroup;
}

export interface TreeGroup extends TreeItem {
  item_type: 'group';
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
}

export interface Permission {
  action: string;
  principal: {
    id: number;
  };
  identity: string;
  scope: string;
  permission: string;
  propagate: boolean;
}

export type ResourceCls =
  | 'vector_layer'
  | 'resource_group'
  | 'postgis_layer'
  | 'wmsserver_service'
  | 'basemap_layer'
  | 'postgis_connection'
  | 'webmap'
  | 'wfsserver_service'
  | 'vector_layer'
  | 'raster_layer'
  | 'mapserver_style'
  | 'qgis_vector_style'
  | 'qgis_raster_style'
  | 'raster_style'
  | 'file_bucket'
  | 'lookup_table'
  | 'wmsclient_layer'
  | 'wmsclient_connection'
  | 'formbuilder_form';

export interface ResourceHierarchy {
  id: number;
  parent: {
    id: any;
  };
}

export interface Resource {
  id: number;
  cls: ResourceCls;
  parent: ResourceHierarchy;
  owner_user: {
    id: number;
  };
  permissions: Permission[];
  keyname: any;
  display_name: string;
  description: string;
  children: boolean;
  interfaces: any[];
  scopes: string[];
}

export interface BookmarkProperties {
  name: string;
  place: string;
}

export interface NgwDateFormat {
  year: number;
  month: number;
  day: number;
}

export interface WebmapResource {
  extent_left: number;
  extent_right: number;
  extent_bottom: number;
  extent_top: number;
  draw_order_enabled: any;
  bookmark_resource: ResourceHierarchy;
  root_item: TreeGroup;
}

export interface BasemapResource {
  url: string;
  /**
   * Parse to qms-kit.BasemapQms
   */
  qms: string;
}

export interface LookupTableResource {
  items: Record<string, string>;
}

export type ResourceItemDatatype = 'STRING' | 'REAL' | 'DATE' | 'BIGINT';

export interface FeatureLayerField {
  datatype: ResourceItemDatatype;
  display_name: string;
  grid_visibility: boolean;
  id: number;
  keyname: string;
  label_field: boolean;
  typemod?: unknown;
}

export interface FeatureResource {
  fields: FeatureLayerField[];
}

// Ngw api settings
export interface ResourceItem {
  resource: Resource;
  resmeta: {
    items: {};
  };
  webmap?: WebmapResource;
  feature_layer?: FeatureResource;
  basemap_layer?: BasemapResource;
  lookup_table?: LookupTableResource;
}
