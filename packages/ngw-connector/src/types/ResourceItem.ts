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

export type ResourceCls = 'vector_layer' |
  'resource_group' |
  'postgis_layer' |
  'wmsserver_service' |
  'basemap_layer' |
  'postgis_connection' |
  'webmap' |
  'wfsserver_service' |
  'vector_layer' |
  'raster_layer' |
  'mapserver_style' |
  'qgis_vector_style' |
  'raster_style' |
  'file_bucket' |
  'lookup_table' |
  'wmsclient_layer' |
  'wmsclient_connection' |
  'formbuilder_form';

export interface Resource {
  id: number;
  cls: ResourceCls;
  parent: {
    id: number;
    parent: {
      id: any;
    };
  };
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

// Ngw api settings
export interface ResourceItem {
  resource: Resource;
  resmeta: {
    items: {};
  };
  webmap?: {
    extent_left: number;
    extent_right: number;
    extent_bottom: number;
    extent_top: number;
    draw_order_enabled: any;
    bookmark_resource: any;
    root_item: TreeGroup;
  };
}
