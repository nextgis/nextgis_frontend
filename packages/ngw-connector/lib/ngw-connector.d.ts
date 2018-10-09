import './polyfills';
import { RequestItemsParamsMap } from './types/RequestItemsParamsMap';
import { NgwConnectorOptions, Router, RequestItemsResponseMap, RequestOptions, Params } from './interfaces';
export * from './interfaces';
export declare class NgwConnector {
    options: NgwConnectorOptions;
    private route;
    private _loadingQueue;
    private _loadingStatus;
    constructor(options: NgwConnectorOptions);
    connect(): Promise<Router>;
    getUserInfo(): Promise<any>;
    makeClientId(): string;
    request<K extends keyof RequestItemsParamsMap>(name: K, params?: RequestItemsParamsMap[K] | {}, options?: RequestOptions): Promise<RequestItemsResponseMap[K]>;
    post<K extends keyof RequestItemsParamsMap>(name: K, options?: RequestOptions, params?: RequestItemsParamsMap[K] | {}): Promise<RequestItemsResponseMap[K]>;
    makeQuery(url: string, params: Params, options: RequestOptions): Promise<any>;
    _setLoadingQueue(name: any, resolve: any, reject: any): void;
    _exequteLoadingQueue(name: any, data: any, isError?: any): void;
    _getJson(url: string, options: RequestOptions): Promise<any>;
}
