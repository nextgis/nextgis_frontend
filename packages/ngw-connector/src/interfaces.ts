/**
 * @module ngw-connector
 */

import { ResourceItem } from './types/ResourceItem';
import { RequestItemsParamsMap } from './types/RequestItemsParamsMap';
import { FeatureLayersIdentify, FeatureItem } from './types/FeatureLayer';

export interface FileMeta {
  id: string;
  mime_type: string;
  name: string;
  size: number;
}

export interface FileUploadResp {
  upload_meta: FileMeta[];
}

export interface PyramidRoute {
  [requestItemName: string]: string[];
}

interface ResourceCreatedRest {
  id: number;
  parent: { id: number };
}

type simple = string | number | boolean;

type cbParams = (params: Params) => simple;

export interface Router {
  [name: string]: string[];
}

export interface Params {
  [name: string]: simple | cbParams;
}

type RequestItemKeys = { readonly [T in keyof RequestItemsParamsMap]?: { [x: string]: any } };

export interface RequestItemsResponseMap {
  'GET': GetRequestItemsResponseMap;
  POST: PostRequestItemsResponseMap;
}

export interface GetRequestItemsResponseMap extends RequestItemKeys {
  'pyramid.route': PyramidRoute;
  'resource.item': ResourceItem;
  'resource.child': any;
  'resource.collection': ResourceItem[];
  'file_upload.upload': FileUploadResp;
  'feature_layer.feature.item': FeatureItem;
  'feature_layer.feature.collection': FeatureItem[];
  // [x: string]: { [x: string]: any };
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

export interface Credentials {
  login: string;
  password: string;
}

export interface NgwConnectorOptions {
  route?: string;
  baseUrl?: string;
  auth?: Credentials;
}

export interface RequestHeaders {
  Authorization?: string;
  Accept?: string;
  'Access-Control-Allow-Origin'?: string;
  'Access-Control-Allow-Headers'?: string;
  [header: string]: string | undefined;
}

export interface RequestOptions {
  method?: 'POST' | 'GET';
  data?: any;
  headers?: RequestHeaders;
  withCredentials?: boolean;
  file?: File;
  responseType?: 'json' | 'blob';
  onProgress?: (percentComplete: number) => void;
  nocache?: boolean;
}

export interface LoadingQueue {
  name: string;
  waiting: Array<{
    resolve: (...args: any[]) => Promise<any>,
    reject: (...args: any[]) => Promise<Error>,
    timestamp: Date;
  }>;
}

export interface UserInfo {
  display_name: string;
  id: number;
  // @default 'guest'
  keyname: string;
  clientId?: string;
}
