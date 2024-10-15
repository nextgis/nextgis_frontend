// import {
//   BasemapWebMapItemRead,
//   BasemapWebMapRead,
// } from '@nextgisweb/basemap/type/api';
// import { FeatureLayerRead } from '@nextgisweb/feature-layer/type/api';
// import { WebMapRead } from '@nextgisweb/webmap/type/api';

// import type {
//   CompositeRead,
//   ResourceCls as NGWResourceCls,
//   ResourceRead,
// } from '@nextgisweb/resource/type/api';
// import type { VectorLayerRead } from '@nextgisweb/vector-layer/type/api';

export interface TreeItem {
  item_type: 'root' | 'group' | 'layer';
  display_name?: string;
  id?: number;

  _layer?: any;
  _parent?: TreeGroup;
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

// export type ResourceCls = NGWResourceCls;
export interface ResourceHierarchy {
  id: number;
  parent: {
    id: any;
  };
}

// export type Resource = ResourceRead;

export interface BookmarkProperties {
  name: string;
  place: string;
}

export interface NgwDateFormat {
  year: number;
  month: number;
  day: number;
}

export interface NgwTimeFormat {
  hour: number;
  minute: number;
  second: number;
}

export type NgwDateTimeFormat = NgwDateFormat & NgwTimeFormat;

// export type WebmapResource = WebMapRead;

export interface BasemapResource {
  url: string;
  /**
   * Parse to qms-kit.BasemapQms
   */
  qms: string;
}

// export type BasemapWebmapItem = BasemapWebMapItemRead;

// export type BasemapWebmap = BasemapWebMapRead;

export interface LookupTableResource {
  items: Record<string, string>;
}

export type VectorFieldDatatype =
  | 'STRING'
  | 'REAL'
  | 'DATE'
  | 'TIME'
  | 'DATETIME'
  | 'BIGINT'
  | 'INTEGER'
  | 'BOOLEAN';

/** @deprecated - use {@link VectorFieldDatatype} instead */
export type ResourceItemDatatype = VectorFieldDatatype;

export interface FeatureLayerField {
  datatype: VectorFieldDatatype;
  display_name: string;
  grid_visibility: boolean;
  id: number;
  keyname: string;
  label_field: boolean;
  typemod?: unknown;
}

// export type FeatureResource = FeatureLayerRead;

export type GeometryType =
  | 'POINT'
  | 'LINESTRING'
  | 'POLYGON'
  | 'MULTIPOINT'
  | 'MULTILINESTRING'
  | 'MULTIPOLYGON'
  | 'POINTZ'
  | 'LINESTRINGZ'
  | 'POLYGONZ'
  | 'MULTIPOINTZ'
  | 'MULTILINESTRINGZ'
  | 'MULTIPOLYGONZ';

// export type VectorLayer = VectorLayerRead;

export interface FileBucket {
  files: NgwFile[];
  tstamp?: any;
  main_tileset?: string;
}

export interface WmsServerService {
  /**
   * Array or WMS service layers. keyname, display_name and resource_id are mandatory.
   */
  layers: WmsServerServiceLayer[];
}

export interface WmsClientLayer {
  /** WMS connection. */
  connection: {
    id: number;
  };
  srs: {
    id: number;
  };
  /**
   *  Image format. Available values can fetched from WMS connection ('image/png').
   */
  imgformat: string;
  /**
   * String with layer identifiers separated with comma. Available layers can fetched from WMS connection.
   */
  wmslayers: string;
  /** Additional parameters added to each request. This is key and value list. */
  vendor_params: Record<string, string>;
}

export interface WmsClientConnection {
  /** WMS service url */
  url: string;
  /** User name to connect to service */
  username?: string;
  /** Password to connect to service */
  password?: string;
  /** WMS version */
  version?: string;
  /** If equal query - query capabilities from service */
  capcache?: string;
}

export interface WmsServerServiceLayer {
  /**
   * Key name for WMS service item. Name may be only ASCII symbols without spaces.
   * */
  keyname: string;
  /**
   * Service item name.
   * */
  display_name: string;
  /**
   * Resource identifier which will be WMS layer datasource. Supported types are: vector layer style, raster style, WMS layer.
   * */
  resource_id: number;
  /**
   * Minimum scale to show WMS layer. String in form of `1 : 100000`.
   */
  min_scale_denom?: string | null;
  /**
   *  Maximum scale to show WMS layer. String in form of `1 : 100000`.
   */
  max_scale_denom?: string | null;
}

export interface NgwFile {
  name: string;
  mime_type: string;
  size: number;
}

export interface Resmeta {
  items: Record<string, any>;
}

// Ngw api settings
// export type ResourceItem = CompositeRead;
