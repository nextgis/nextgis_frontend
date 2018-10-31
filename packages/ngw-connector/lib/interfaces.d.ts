import { ResourceItem } from './types/ResourceItem';
export interface FileMeta {
    id: string;
    mime_type: string;
    name: string;
    size: number;
}
interface FileUploadResp {
    upload_meta: FileMeta[];
}
declare type simple = string | number | boolean;
declare type cbParams = (params: Params) => simple;
export interface Router {
    [name: string]: string[];
}
export interface Params {
    [name: string]: simple | cbParams;
}
export interface RequestItemsResponseMap {
    'resource.item': ResourceItem;
    'resource.child': any;
    'file_upload.upload': FileUploadResp;
    [x: string]: {
        [x: string]: any;
    };
}
export interface AuthOptions {
    login?: string;
    password?: string;
}
export interface NgwConnectorOptions {
    route?: string;
    baseUrl?: string;
    auth?: AuthOptions;
}
export interface RequestHeaders {
    Authorization?: string;
    'Access-Control-Allow-Origin': string | '*';
    'Access-Control-Allow-Headers': string | '*';
}
export interface RequestOptions {
    method?: 'POST' | 'GET';
    data?: any;
    headers?: RequestHeaders;
    mode?: 'cors';
    withCredentials?: boolean;
    file?: File;
    onProgress?: (percentComplete: number) => void;
}
export interface LoadingQueue {
    name: string;
    waiting: Array<{
        resolve: (data: any) => Promise<any>;
        reject: () => Promise<Error>;
        timestamp: Date;
    }>;
}
export interface UserInfo {
    display_name: string;
    id: number;
    keyname: string;
    clientId?: string;
}
export {};
