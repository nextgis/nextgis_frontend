import { ResourceItem, FeatureLayerField } from './types/ResourceItem';
import { RequestItemsParamsMap } from './types/RequestItemsParamsMap';
import { FeatureLayersIdentify, FeatureItem } from './types/FeatureLayer';
import { ResourceStoreItem } from './types/ResourceStore';

export interface FileMeta {
  id: string;
  mime_type: string;
  name: string;
  size: number;
}

export interface NgwExtent {
  extent: {
    minLon: number;
    minLat: number;
    maxLon: number;
    maxLat: number;
  };
}

export interface SrsItem {
  auth_name: string;
  auth_srid: number;
  display_name: string;
  id: number;
  wkt: string;
}

export interface FeatureLayerCount {
  total_count: number;
}

export type ResourceDefinition = string | number;

export interface FileUploadResp {
  upload_meta: FileMeta[];
}

export interface PyramidSettingsPyramidCompanyLogo {
  link?: 'string';
  enabled: boolean;
}

export interface PyramidSettingsPyramid {
  support_url?: string;
  units: 'metric';
  degree_format: 'dd';
  measurement_srid: 4326;
  company_logo?: PyramidSettingsPyramidCompanyLogo;
}

export type PyramidSettings = PyramidSettingsPyramid | Record<string, any>;

export interface PyramidRoute {
  [requestItemName: string]: string[];
}
export type Router = PyramidRoute;

type simple = string | number | boolean;

type cbParams = (params: Params) => simple;

export interface Params {
  [name: string]: simple | cbParams;
}

export type RequestItemKeys = {
  readonly [T in keyof RequestItemsParamsMap]?: any; //{ [x: string]: any };
};

export interface RequestItemsResponseMap {
  GET: GetRequestItemsResponseMap;
  POST: PostRequestItemsResponseMap;
}

export interface GetRequestItemsResponseMap extends RequestItemKeys {
  'pyramid.route': PyramidRoute;
  'pyramid.settings': PyramidSettings;
  'resource.item': ResourceItem;
  'resource.search': ResourceItem[];
  'resource.child': any;
  'resource.collection': ResourceItem[];
  'file_upload.upload': FileUploadResp;
  'layer.extent': NgwExtent;
  'feature_layer.feature.item': FeatureItem;
  'feature_layer.feature.collection': FeatureItem[];
  'feature_layer.store': ResourceStoreItem[];
  'feature_layer.field': FeatureLayerField[];
  'feature_layer.feature.item_extent': NgwExtent;
  'feature_layer.feature.count': FeatureLayerCount;
  'pyramid.company_logo': string;
  'spatial_ref_sys.collection': SrsItem[];
}

export interface CreatedResource {
  id: number;
  parent: {
    id: number;
  };
}

export interface PostRequestItemsResponseMap extends RequestItemKeys {
  'resource.collection': CreatedResource;
  'feature_layer.identify': FeatureLayersIdentify;
}

export interface PatchRequestItemsResponseMap extends RequestItemKeys {
  'feature_layer.feature.collection': { id: number }[];
}

export interface PutRequestItemsResponseMap extends RequestItemKeys {
  'feature_layer.feature.item': { id: number };
}

export interface DeleteRequestItemsResponseMap extends RequestItemKeys {
  'feature_layer.feature.item': any;
}

export interface Credentials {
  login: string;
  password: string;
}

export interface NgwConnectorOptions {
  baseUrl?: string;
  route?: string;
  auth?: Credentials;
}

export interface RequestHeaders {
  [header: string]: string | undefined;
  Authorization?: string;
  Accept?: string;
  'Access-Control-Allow-Origin'?: string;
  'Access-Control-Allow-Headers'?: string;
}

export type RequestMethods = 'POST' | 'GET' | 'PATCH' | 'DELETE' | 'PUT';

export interface RequestOptions<M = RequestMethods> {
  method?: M;
  data?: any;
  headers?: RequestHeaders;
  withCredentials?: boolean;
  file?: File;
  responseType?: 'json' | 'blob';
  onProgress?: (percentComplete: number, event: ProgressEvent) => void;
}

export type RequestItemAdditionalParams = { [name: string]: any } & {
  paramList?: [string, any][];
};

export type RequestItemsParams<K extends keyof RequestItemsParamsMap> = (
  | RequestItemsParamsMap[K]
  | Record<string, unknown>
) &
  RequestItemAdditionalParams;

export interface LoadingQueue {
  name: string;
  waiting: Array<{
    resolve: (...args: any[]) => Promise<any>;
    reject: (...args: any[]) => Promise<Error>;
    timestamp: Date;
  }>;
}

export interface UserInfo {
  display_name: string;
  id: number;
  // @defaultValue 'guest'
  keyname: 'guest' | string;
  clientId?: string;
}

export type NgwExceptions =
  | 'nextgisweb.resource.exception.ResourceNotFound'
  | 'nextgisweb.core.exception.InsufficientPermissions';
