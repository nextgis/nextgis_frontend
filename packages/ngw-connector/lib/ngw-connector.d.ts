import { ResourceItem } from './types/ResourceItem';
import { RequestItemsParamsMap } from './types/RequestItemsParamsMap';
declare type simple = string | number | boolean;
declare type cbParams = (params: Params) => simple;
interface Router {
    [name: string]: string[];
}
interface Params {
    [name: string]: simple | cbParams;
}
interface RequestItemsResponseMap {
    'resource.item': ResourceItem;
    'resource.child': any;
    [x: string]: {
        [x: string]: any;
    };
}
export interface NgwConnectorOptions {
    route?: string;
    baseUrl?: string;
}
export interface RequestOptions {
    method?: 'POST' | 'GET';
    data?: any;
}
export declare class NgwConnector {
    options: NgwConnectorOptions;
    private route;
    private _loadingQueue;
    private _loadingStatus;
    constructor(options: any);
    connect(callback: (router: Router) => void, context: any): void;
    request<K extends keyof RequestItemsParamsMap>(name: K, callback?: (data: RequestItemsResponseMap[K]) => void, params?: RequestItemsParamsMap[K] | {}, options?: RequestOptions, error?: (er: Error) => void, context?: any): void;
    post<K extends keyof RequestItemsParamsMap>(name: K, callback: (data: RequestItemsResponseMap[K]) => void, options?: RequestOptions, error?: (er: Error) => void, params?: RequestItemsParamsMap[K] | {}, context?: any): void;
    makeQuery(url: string, callback: ({}: {}) => void, params: Params, options: RequestOptions, context: any, error?: (er: Error) => void): void;
    _setLoadingQueue(name: any, callback: any, context: any, error: any): void;
    _exequteLoadingQueue(name: any, data: any, isError?: any): void;
    _getJson(url: string, callback: any, options: RequestOptions, context: any, error: any): void;
}
export {};
