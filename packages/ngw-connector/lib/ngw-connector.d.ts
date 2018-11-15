/// <reference types="node" />
import './polyfills';
import { RequestItemsParamsMap } from './types/RequestItemsParamsMap';
import { NgwConnectorOptions, Router, RequestItemsResponseMap, RequestOptions, Params, UserInfo } from './interfaces';
import { EventEmitter } from 'events';
export * from './interfaces';
export default class NgwConnector {
    options: NgwConnectorOptions;
    user: UserInfo;
    emitter: EventEmitter;
    private route;
    private _loadingQueue;
    private _loadingStatus;
    constructor(options: NgwConnectorOptions);
    connect(): Promise<Router>;
    getUserInfo(): Promise<any>;
    getAuthorizationHeaders(): {
        'Authorization': string;
    };
    makeClientId(): string;
    request<K extends keyof RequestItemsParamsMap>(name: K, params?: RequestItemsParamsMap[K] | {}, options?: RequestOptions): Promise<RequestItemsResponseMap[K]>;
    post<K extends keyof RequestItemsParamsMap>(name: K, options?: RequestOptions, params?: RequestItemsParamsMap[K] | {}): Promise<RequestItemsResponseMap[K]>;
    makeQuery(url: string, params: Params, options?: RequestOptions): Promise<any>;
    _setLoadingQueue(name: any, resolve: any, reject: any): void;
    _executeLoadingQueue(name: any, data: any, isError?: any): void;
    _getJson(url: string, options: RequestOptions): Promise<any>;
}
