/**
 * @module ngw-connector
 */
import './polyfills';

import { RequestItemsParamsMap } from './types/RequestItemsParamsMap';
import {
  NgwConnectorOptions, Router,
  GetRequestItemsResponseMap, RequestOptions,
  Params, LoadingQueue, UserInfo, Credentials,
  PyramidRoute, RequestHeaders, PostRequestItemsResponseMap
} from './interfaces';
import { loadJSON, template } from './utils';
import { EventEmitter } from 'events';

export class NgwConnector {

  emitter = new EventEmitter();
  user?: UserInfo;
  private routeStr = '/api/component/pyramid/route';
  private route?: PyramidRoute;
  private _loadingQueue: { [name: string]: LoadingQueue } = {};
  private _loadingStatus: { [url: string]: boolean } = {};

  constructor(public options: NgwConnectorOptions = {}) {
    if (this.options.route) {
      this.routeStr = this.options.route;
    }
  }

  async connect(): Promise<Router> {
    if (this.route) {
      return Promise.resolve(this.route);
    } else {
      if (this.options.auth) {
        const { login, password } = this.options.auth;
        if (login && password) {
          await this.getUserInfo({ login, password });
        }
      }

      return await this.makeQuery(this.routeStr, {}, {}).then((route: PyramidRoute) => {
        this.route = route;
        return route;
      });
    }
  }

  getUserInfo(credentials: Credentials): Promise<UserInfo> {
    if (credentials) {
      this.options.auth = credentials;
    }
    const options: RequestOptions = {
      headers: this.getAuthorizationHeaders(credentials)
      // withCredentials: true
    };

    // Do not use request('auth.current_user') to avoid circular-references
    return this.makeQuery('/api/component/auth/current_user', {}, options).then((data: UserInfo) => {
      this.user = data;
      this.emitter.emit('login', data);
      return data;
    }).catch((er) => {
      this.emitter.emit('login:error', er);
      throw er;
    });
  }

  getAuthorizationHeaders(credentials?: Credentials): RequestHeaders | undefined {
    const client = this.makeClientId(credentials);
    if (client) {
      return {
        'Authorization': 'Basic ' + client
      };
    }
  }

  makeClientId(credentials?: Credentials) {
    credentials = credentials || this.options.auth;
    if (credentials) {
      const { login, password } = credentials;
      return window.btoa(unescape(encodeURIComponent(`${login}:${password}`)));
    }
  }

  async request<K extends keyof RequestItemsParamsMap>(
    name: K,
    params: RequestItemsParamsMap[K] & { [name: string]: any } = {},
    options?: RequestOptions): Promise<GetRequestItemsResponseMap[K] | PostRequestItemsResponseMap[K]> {

    const apiItems = await this.connect();
    let apiItem = apiItems && apiItems[name];
    if (apiItem) {
      apiItem = [...apiItem];
      let url = apiItem.shift();
      if (apiItem.length) {
        const replaceParams: {
          [num: number]: string;
        } = {};
        for (let fry = 0; fry < apiItem.length; fry++) {
          const arg = apiItem[fry];
          replaceParams[fry] = '{' + arg + '}';
          if (params[arg] === undefined) {
            throw new Error('`' + arg + '`' + ' url api argument is not specified');
          }
        }
        if (url) {
          url = template(url, replaceParams);
        }
      }
      // Transfer part of the parameters from `params` to the URL string
      if (params) {
        const paramArray = [];
        for (const p in params) {
          if (params.hasOwnProperty(p) && apiItem.indexOf(p) === -1) {
            paramArray.push(`${p}=${params[p]}`);
          }
        }
        if (paramArray.length) {
          url = url + '/?' + paramArray.join('&');
        }
      }
      if (url) {
        return this.makeQuery(url, params, options);
      } else {
        throw new Error('request url is not set');
      }
    }

  }

  post<K extends keyof RequestItemsParamsMap>(
    name: K,
    options?: RequestOptions,
    params?: RequestItemsParamsMap[K] & { [name: string]: any }): Promise<PostRequestItemsResponseMap[K]> {

    options = options || {};
    options.method = 'POST';
    options.nocache = true;
    return this.request(name, params, options);
  }

  get<K extends keyof RequestItemsParamsMap>(
    name: K,
    options?: RequestOptions | undefined | null,
    params?: RequestItemsParamsMap[K] & { [name: string]: any }): Promise<GetRequestItemsResponseMap[K]> {

    options = options || {};
    options.method = 'GET';
    options.nocache = true;
    return this.request(name, params, options);
  }

  makeQuery(
    url: string,
    params: Params,
    options: RequestOptions = {}): Promise<any> {

    url = (this.options.baseUrl ? this.options.baseUrl : '') + url;
    if (url) {
      if (params) {
        url = template(url, params);
      }
      // remove double slash
      url = url.replace(/([^:]\/)\/+/g, '$1');
      if (!this._loadingStatus[url] || options.nocache) {
        this._loadingStatus[url] = true;

        return this._getJson(url, options).then((data) => {
          this._loadingStatus[url] = false;
          this._executeLoadingQueue(url, data);
          return data;
        }).catch((er) => {
          this._loadingStatus[url] = false;
          this._executeLoadingQueue(url, er, true);
          this.emitter.emit('error', er);
          throw er;
        });
      } else {
        this._loadingStatus[url] = false;
        const promise = new Promise((resolve, reject) => {
          this._setLoadingQueue(url, resolve, reject);
        });
        return promise;
      }
    } else {
      throw new Error('No `url` parameter set for option ' + name);
    }

  }

  _setLoadingQueue(name: string, resolve: (...args: any[]) => any, reject: (...args: any[]) => any) {
    this._loadingQueue[name] = this._loadingQueue[name] || {
      name,
      waiting: [],
    };
    this._loadingQueue[name].waiting.push({
      resolve,
      reject,
      timestamp: new Date(),
    });
  }

  _executeLoadingQueue(name: string, data: any, isError?: boolean) {
    const queue = this._loadingQueue[name];
    if (queue) {
      for (let fry = 0; fry < queue.waiting.length; fry++) {
        const wait = queue.waiting[fry];
        if (isError) {
          if (wait.reject) {
            wait.reject();
          }
        } else {
          wait.resolve(data);
        }
      }
      queue.waiting = [];
    }
  }

  _getJson(url: string, options: RequestOptions): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.user) {
        options = options || {};
        // options.withCredentials = true;
        options.headers = this.getAuthorizationHeaders();
      }
      loadJSON(url, resolve, options, reject);
    });
  }
}
