import type { FeatureItem, FeatureLayersIdentify } from './types/FeatureLayer';
import type { RequestItemsParamsMap } from './types/RequestItemsParamsMap';
import type { FeatureLayerField } from './types/ResourceItem';
import type { ResourceStoreItem } from './types/ResourceStore';
import type { DeepPartial } from '@nextgis/utils';
import type { LegendSymbol } from '@nextgisweb/render/type/api';
import type {
  CompositeRead,
  ResourceRead,
} from '@nextgisweb/resource/type/api';

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

export type ResourceIdKeynameDef = string | number;
export type ResourceDefinition =
  | ResourceIdKeynameDef
  | DeepPartial<ResourceRead>;

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
  [requestItemName: string]: [url: string, ...params: string[]];
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
  'resource.item': CompositeRead;
  'resource.search': CompositeRead[];
  'resource.child': any;
  'resource.collection': CompositeRead[];
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
  'render.legend_symbols': LegendSymbol[];
}

export interface IdOnly {
  id: number;
}

export interface CreatedResource extends IdOnly {
  parent: IdOnly;
}

export interface PostRequestItemsResponseMap extends RequestItemKeys {
  'resource.collection': CreatedResource;
  'feature_layer.identify': FeatureLayersIdentify;
  'file_upload.upload': FileUploadResp;
  'feature_attachment.collection': IdOnly;
}

export interface PatchRequestItemsResponseMap extends RequestItemKeys {
  'feature_layer.feature.collection': IdOnly[];
}

export interface PutRequestItemsResponseMap extends RequestItemKeys {
  'feature_layer.feature.item': IdOnly;
}

export interface DeleteRequestItemsResponseMap extends RequestItemKeys {
  'feature_layer.feature.item': any;
}

/**
 * User credentials for authorization.
 */
export interface Credentials {
  /**
   * The login username for the user.
   */
  login: string;

  /**
   * The password for the user.
   */
  password: string;
}

export type RequestTransformFunction = (
  url: string,
  options: RequestOptions,
) => [url: string, options: RequestOptions];

export interface NgwConnectorOptions {
  /**
   * The base URL of the NextGIS Web (NGW) server.
   * Example: "https://demo.nextgis.com"
   */
  baseUrl?: string;
  /**
   * The API route path to use for requests.
   * If not specified, the default route "/api/component/pyramid/route" will be used.
   */
  route?: string;
  /**
   * User credentials for authorization in NGW.
   * These credentials will be used for authentication in NGW requests.
   */
  auth?: Credentials;
  /**
   * Indicates whether to include credentials such as cookies, authentication headers,
   * or TLS client certificates in cross-site Access-Control requests.
   * Setting this property ensures that cookies from another domain are used in the requests.
   * Note that setting this property has no effect on same-origin requests.
   */
  withCredentials?: boolean;
  /**
   * A function to transform the request before sending it.
   * This function can be used to modify the URL, headers, or other options.
   */
  requestTransform?: RequestTransformFunction;
  /**
   * Identifier for caching requests.
   * This can be used to segregate cached data for different connectors.
   */
  cacheId?: string;
}

export interface RequestHeaders {
  [header: string]: string | undefined;
  Authorization?: string;
  Accept?: string;
  'Access-Control-Allow-Origin'?: string;
  'Access-Control-Allow-Headers'?: string;
}

export type RequestMethods = 'POST' | 'GET' | 'PATCH' | 'DELETE' | 'PUT';

export type NgwExceptions =
  | 'nextgisweb.resource.exception.ResourceNotFound'
  | 'nextgisweb.core.exception.InsufficientPermissions';

export interface BaseRequestOptions {
  cache?: boolean;
  signal?: AbortSignal | null;
}

/**
 * Options for configuring requests to NGW.
 */
export interface RequestOptions<
  M extends RequestMethods = RequestMethods,
  K extends keyof RequestItemsParamsMap = keyof RequestItemsParamsMap,
> extends BaseRequestOptions {
  /**
   * Data to be sent as the request body.
   * Typically used with POST, PUT, or PATCH requests.
   */
  data?: any;

  /**
   * File to be sent in the request.
   */
  file?: File;

  /**
   * HTTP method to be used for the request.
   * Example: 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'
   */
  method?: M;

  /**
   * HTTP headers to be included in the request.
   */
  headers?: RequestHeaders;

  /**
   * Indicates whether to include credentials such as cookies, authentication headers,
   * or TLS client certificates in cross-site Access-Control requests.
   */
  withCredentials?: boolean;

  /**
   * The type of data that the server will respond with.
   * Can be either 'json' or 'blob'.
   */
  responseType?: 'json' | 'blob';

  /**
   * Whether to cache the request.
   * When set to true, the response will be stored in the cache.
   */
  cache?: boolean;

  /**
   * Signal object that allows you to communicate with a DOM request (such as fetch) and abort it if desired via an AbortController.
   */
  signal?: AbortSignal | null;

  /**
   * Parameters to be included in the request URL.
   */
  params?: RequestItemsParams<K>;

  /**
   * A function to be called to monitor the progress of the request.
   * @param percentComplete - The percentage of the request that has been completed.
   * @param event - The progress event.
   */
  onProgress?: (percentComplete: number, event: ProgressEvent) => void;

  /**
   * Name to use for caching the request.
   */
  cacheName?: string;

  /**
   * Properties to override default cache behavior.
   */
  cacheProps?: Record<string, unknown>;
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
  /** @defaultValue 'guest' */
  keyname: 'guest' | string;
  clientId?: string;
}

export interface GetChildrenOfOptions extends Pick<RequestOptions, 'cache'> {
  recursive?: boolean;
}
