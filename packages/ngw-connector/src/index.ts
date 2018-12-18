
import './polyfills';

import { RequestItemsParamsMap } from './types/RequestItemsParamsMap';
import {
  NgwConnectorOptions, Router,
  RequestItemsResponseMap, RequestOptions,
  Params, LoadingQueue, UserInfo, Credentials
} from './interfaces';
import { loadJSON, template } from './utils';
import { EventEmitter } from 'events';

export * from './interfaces';

const OPTIONS: NgwConnectorOptions = {
  route: '/api/component/pyramid/route',
  // baseUrl: 'http://'
};

export default class NgwConnector {

  options: NgwConnectorOptions = {};

  user: UserInfo;
  emitter = new EventEmitter();
  private route;
  private _loadingQueue: { [name: string]: LoadingQueue } = {};
  private _loadingStatus = {};

  constructor(options: NgwConnectorOptions) {
    this.options = { ...OPTIONS, ...(options || {}) };
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
      return await this.makeQuery(this.options.route, {}, {}).then((route) => {
        this.route = route;
        return route;
      });
    }
  }

  getUserInfo(credentials: Credentials): Promise<UserInfo> {
    if (credentials) {
      this.options.auth = credentials;
    }
    // Do not use request('auth.current_user') to avoid circular-references
    return this.makeQuery('/api/component/auth/current_user', {}, {
      headers: this.getAuthorizationHeaders(credentials),
      withCredentials: true
    }).then((data: UserInfo) => {
      this.user = data;
      this.emitter.emit('login', data);
      return data;
    }).catch((er) => {
      this.emitter.emit('login:error', er);
      throw er;
    });
  }

  getAuthorizationHeaders(credentials?: Credentials) {
    const client = this.makeClientId(credentials);
    return {
      'Authorization': 'Basic ' + client
    };
  }

  makeClientId(credentials?: Credentials) {
    const { login, password } = credentials || this.options.auth;
    return window.btoa(unescape(encodeURIComponent(`${login}:${password}`)));
  }

  request<K extends keyof RequestItemsParamsMap>(
    name: K,
    params?: RequestItemsParamsMap[K] | {},
    options?: RequestOptions): Promise<RequestItemsResponseMap[K]> {

    return this.connect().then((apiItems) => {
      for (const a in apiItems) {
        if (apiItems.hasOwnProperty(a)) {
          if (a === name) {
            const apiItem = apiItems[a].slice();
            let url = apiItem.shift();
            if (apiItem.length) {
              params = params || {};
              const replaceParams = {};
              for (let fry = 0; fry < apiItem.length; fry++) {
                const arg = apiItem[fry];
                replaceParams[fry] = '{' + arg + '}';
                if (params[arg] === undefined) {
                  throw new Error('`' + arg + '`' + ' url api argument is not specified');
                }
              }
              url = template(url, replaceParams);
            } else if (params) {
              const paramArray = [];
              for (const p in params) {
                if (params.hasOwnProperty(p)) {
                  paramArray.push(`${p}=${params[p]}`);
                }
              }
              url = url + '/?' + paramArray.join('&');
            }
            return this.makeQuery(url, params, options);
          }
        }
      }
    });
  }

  post<K extends keyof RequestItemsParamsMap>(
    name: K,
    options?: RequestOptions,
    params?: RequestItemsParamsMap[K] | {}): Promise<RequestItemsResponseMap[K]> {

    options = options || {};
    options.method = 'POST';
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

  _setLoadingQueue(name, resolve, reject) {
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

  _executeLoadingQueue(name, data, isError?) {
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
