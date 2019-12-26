/**
 * @module ngw-connector
 */
import { CancelablePromise } from './CancelablePromise';

import { RequestItemsParamsMap } from './types/RequestItemsParamsMap';
import {
  NgwConnectorOptions,
  Router,
  GetRequestItemsResponseMap,
  RequestOptions,
  Params,
  LoadingQueue,
  UserInfo,
  Credentials,
  PyramidRoute,
  RequestHeaders,
  PostRequestItemsResponseMap,
  PatchRequestItemsResponseMap,
  RequestItemKeys,
  DeleteRequestItemsResponseMap,
  PutRequestItemsResponseMap
} from './interfaces';
import { loadJSON, template } from './utils';
import { EventEmitter } from 'events';
import { ResourceItem } from './types/ResourceItem';

export class NgwConnector {
  emitter = new EventEmitter();
  user?: UserInfo;
  private routeStr = '/api/component/pyramid/route';
  private route?: PyramidRoute;
  private _loadingQueue: { [name: string]: LoadingQueue } = {};
  private _loadingStatus: { [url: string]: boolean } = {};
  private _keynames: Record<string, ResourceItem> = {};

  constructor(public options: NgwConnectorOptions) {
    if (this.options.route) {
      this.routeStr = this.options.route;
    }
  }

  setNextGisWeb(url: string) {
    this.logout();
    this.options.baseUrl = url;
  }

  async connect(): CancelablePromise<Router> {
    if (this.route) {
      return Promise.resolve(this.route);
    } else {
      if (this.options.auth) {
        const { login, password } = this.options.auth;
        if (login && password) {
          await this.getUserInfo({ login, password });
        }
      }

      return await this.makeQuery(this.routeStr, {}, {}).then(
        (route: PyramidRoute) => {
          this.route = route;
          return route;
        }
      );
    }
  }

  async login(credentials: Credentials) {
    this.logout();
    return this.getUserInfo(credentials);
  }

  logout() {
    this._rejectLoadingQueue();
    this._loadingStatus = {};
    this.options.auth = undefined;
    this.route = undefined;
    this.user = undefined;
    this.emitter.emit('logout');
  }

  getUserInfo(credentials: Credentials): CancelablePromise<UserInfo> {
    if (this.user && this.user.id) {
      return CancelablePromise.resolve(this.user);
    }
    if (credentials) {
      this.options.auth = credentials;
    }
    const options: RequestOptions = {
      headers: this.getAuthorizationHeaders(credentials)
      // withCredentials: true
    };

    // Do not use request('auth.current_user') to avoid circular-references
    return this.makeQuery('/api/component/auth/current_user', {}, options)
      .then((data: UserInfo) => {
        this.user = data;
        this.emitter.emit('login', data);
        return data;
      })
      .catch(er => {
        this.emitter.emit('login:error', er);
        throw er;
      });
  }

  getAuthorizationHeaders(
    credentials?: Credentials
  ): RequestHeaders | undefined {
    const client = this.makeClientId(credentials);
    if (client) {
      return {
        Authorization: 'Basic ' + client
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

  async getResourceByKeyname(keyname: string) {
    let resource: ResourceItem = this._keynames['keyname'];
    if (!resource) {
      const resources = await this.get('resource.search', null, { keyname });
      resource = resources[0];
      if (resource) {
        this._keynames[keyname] = resource;
      }
    }
    return resource;
  }

  async getResourceChildren(opt: {
    keyname?: string;
    resourceId?: number;
  }): Promise<ResourceItem[]> {
    let parent = opt.resourceId;
    if (!opt.keyname && !opt.resourceId) {
      throw new Error('No keyname or resourceId is set');
    }
    if (opt.keyname) {
      const item = await this.getResourceByKeyname(opt.keyname);
      parent = item.resource.id;
    }
    return await this.get('resource.collection', null, {
      parent
    });
  }

  async request<
    K extends keyof RequestItemsParamsMap,
    P extends RequestItemKeys = RequestItemKeys
  >(
    name: K,
    params: (RequestItemsParamsMap[K] | {}) & { [name: string]: any } = {},
    options?: RequestOptions
  ): CancelablePromise<P[K]> {
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
            throw new Error(
              '`' + arg + '`' + ' url api argument is not specified'
            );
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
          if (apiItem.indexOf(p) === -1) {
            paramArray.push(`${p}=${params[p]}`);
          }
        }
        if (paramArray.length) {
          url = url + '?' + paramArray.join('&');
        }
      }
      if (url) {
        return this.makeQuery(url, params, options);
      } else {
        throw new Error('request url is not set');
      }
    }
    return CancelablePromise.resolve({} as P[K]);
  }

  post<K extends keyof RequestItemsParamsMap>(
    name: K,
    options?: RequestOptions<'POST'>,
    params?: RequestItemsParamsMap[K] & { [name: string]: any }
  ): CancelablePromise<PostRequestItemsResponseMap[K]> {
    options = options || {};
    options.method = 'POST';
    options.nocache = true;
    return this.request<K, PostRequestItemsResponseMap>(name, params, options);
  }

  get<K extends keyof RequestItemsParamsMap>(
    name: K,
    options?: RequestOptions | undefined | null,
    params?: RequestItemsParamsMap[K] & { [name: string]: any }
  ): CancelablePromise<GetRequestItemsResponseMap[K]> {
    options = options || {};
    options.method = 'GET';
    options.nocache = true;
    return this.request<K, GetRequestItemsResponseMap>(name, params, options);
  }

  patch<K extends keyof RequestItemsParamsMap>(
    name: K,
    options?: RequestOptions,
    params?: RequestItemsParamsMap[K] & { [name: string]: any }
  ): CancelablePromise<PatchRequestItemsResponseMap[K]> {
    options = options || {};
    options.method = 'PATCH';
    options.nocache = true;
    return this.request<K, PatchRequestItemsResponseMap>(name, params, options);
  }

  put<K extends keyof RequestItemsParamsMap>(
    name: K,
    options?: RequestOptions,
    params?: RequestItemsParamsMap[K] & { [name: string]: any }
  ): CancelablePromise<PutRequestItemsResponseMap[K]> {
    options = options || {};
    options.method = 'PUT';
    options.nocache = true;
    return this.request<K, PutRequestItemsResponseMap>(name, params, options);
  }

  delete<K extends keyof RequestItemsParamsMap>(
    name: K,
    options?: RequestOptions | undefined | null,
    params?: RequestItemsParamsMap[K] & { [name: string]: any }
  ): CancelablePromise<DeleteRequestItemsResponseMap[K]> {
    options = options || {};
    options.method = 'DELETE';
    options.nocache = true;
    return this.request<K, DeleteRequestItemsResponseMap>(
      name,
      params,
      options
    );
  }

  makeQuery(
    url: string,
    params?: Params,
    options: RequestOptions = {}
  ): CancelablePromise<any> {
    url = (this.options.baseUrl ? this.options.baseUrl : '') + url;
    if (url) {
      if (params) {
        url = template(url, params);
      }
      // remove double slash
      url = url.replace(/([^:]\/)\/+/g, '$1');
      if (!this._loadingStatus[url] || options.nocache) {
        this._loadingStatus[url] = true;

        return this._getJson(url, options)
          .then(data => {
            this._loadingStatus[url] = false;
            this._executeLoadingQueue(url, data);
            return data;
          })
          .catch(er => {
            this._loadingStatus[url] = false;
            this._executeLoadingQueue(url, er, true);
            this.emitter.emit('error', er);
            throw er;
          });
      } else {
        this._loadingStatus[url] = false;
        return new CancelablePromise((resolve, reject) => {
          this._setLoadingQueue(url, resolve, reject);
        });
      }
    } else {
      throw new Error('No `url` parameter set for option ' + name);
    }
  }

  _setLoadingQueue(
    name: string,
    resolve: (...args: any[]) => any,
    reject: (...args: any[]) => any
  ) {
    this._loadingQueue[name] = this._loadingQueue[name] || {
      name,
      waiting: []
    };
    this._loadingQueue[name].waiting.push({
      resolve,
      reject,
      timestamp: new Date()
    });
  }

  _rejectLoadingQueue() {
    for (const q in this._loadingQueue) {
      const queue = this._loadingQueue[q];
      queue.waiting.forEach(x => {
        x.reject();
      });
      delete this._loadingQueue[q];
    }
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

  _getJson(url: string, options: RequestOptions): CancelablePromise<any> {
    const onCancel: (() => void)[] = [];
    options.responseType = options.responseType || 'json';
    return new CancelablePromise(
      (resolve, reject) => {
        if (this.user) {
          options = options || {};
          // options.withCredentials = true;
          options.headers = {
            ...this.getAuthorizationHeaders(),
            ...options.headers
          };
        }
        loadJSON(url, resolve, options, reject, onCancel);
      },
      () => {
        onCancel.forEach(x => x());
      }
    );
  }
}
