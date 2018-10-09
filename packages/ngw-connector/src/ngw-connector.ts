
import './polyfills';

import { RequestItemsParamsMap } from './types/RequestItemsParamsMap';
import {
  NgwConnectorOptions, Router,
  RequestItemsResponseMap, RequestOptions,
  Params, LoadingQueue, UserInfo,
} from './interfaces';

export * from './interfaces';

const OPTIONS: NgwConnectorOptions = {
  route: '/api/component/pyramid/route',
  // baseUrl: 'http://'
};

export class NgwConnector {

  options: NgwConnectorOptions = {};

  private route;
  private _loadingQueue: { [name: string]: LoadingQueue } = {};
  private _loadingStatus = {};

  constructor(options: NgwConnectorOptions) {
    this.options = Object.assign({}, OPTIONS, options || {});
  }

  async connect(): Promise<Router> {
    if (this.route) {
      return Promise.resolve(this.route);
    } else {
      if (this.options.auth) {
        console.log(1234);
        const { login, password } = this.options.auth;
        if (login && password) {
          await this.getUserInfo();
        }
      }
      return await this.makeQuery(this.options.route, {}, {}).then((route) => {
        this.route = route;
        return route;
      });
    }
  }

  getUserInfo(): Promise<any> {
    const client = this.makeClientId();
    // return this.request('auth.current_user', {}, {
    return this.makeQuery('/api/component/auth/current_user', {}, {
      headers: {
        'Authorization': 'Basic ' + client,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
      },
      // withCredentials: true,
      mode: 'cors',
    }).then((data: UserInfo) => {
      console.log(data);
      if (data.keyname !== 'guest') {
        data.clientId = this.makeClientId();
        if (localStorage) {
          localStorage.setItem('nguser', JSON.stringify(data));
        }
      }
    });
    // return fetch(this.options.baseUrl + '/api/component/auth/current_user', {
    //   headers: {
    //     Authorization: 'Basic ' + client,
    //     // 'Access-Control-Allow-Origin': '*',
    //     // 'Access-Control-Allow-Headers': '*',
    //   },
    //   mode: 'cors',
    // }).then((resp) => {
    //   console.log(resp);
    //   resp.json().then((data) => {
    //     if (data.keyname !== 'guest') {
    //       data.clientId = this.makeClientId();
    //       if (localStorage) {
    //         localStorage.setItem('nguser', JSON.stringify(data));
    //       }
    //     }
    //   });
    // });
  }

  makeClientId() {
    const { login, password } = this.options.auth;
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
    return this.request(name, params, options);
  }

  makeQuery(
    url: string,
    params: Params,
    options: RequestOptions): Promise<any> {

    url = (this.options.baseUrl ? this.options.baseUrl : '') + url;
    if (url) {
      if (params) {
        url = template(url, params);
      }
      // remove double slash
      url = url.replace(/([^:]\/)\/+/g, '$1');
      if (!this._loadingStatus[url]) {
        this._loadingStatus[url] = true;

        return this._getJson(url, options).then((data) => {
          this._loadingStatus[url] = false;
          this._exequteLoadingQueue(url, data);
          return data;
        }).catch((er) => {
          this._loadingStatus[url] = false;
          this._exequteLoadingQueue(url, er, true);
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

  _exequteLoadingQueue(name, data, isError?) {
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
      loadJSON(url, resolve, options, reject);
    });
  }
}

function loadJSON(url, callback, options: RequestOptions = {}, error) {
  options.method = options.method || 'GET';
  let xmlHttp: XMLHttpRequest;
  if (options.mode === 'cors') {
    xmlHttp = createCORSRequest(options.method, url);
  } else {
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open(options.method || 'GET', url, true); // true for asynchronous
  }
  xmlHttp.onreadystatechange = () => {
    if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
      if (xmlHttp.responseText) {
        try {
          callback(JSON.parse(xmlHttp.responseText));
        } catch (er) {
          error(er);
        }
      }
    }
  };

  const headers = options.headers;
  if (headers) {
    for (const h in headers) {
      if (headers.hasOwnProperty(h)) {
        xmlHttp.setRequestHeader(h, headers[h]);
      }
    }
  }
  xmlHttp.withCredentials = options.withCredentials;
  xmlHttp.send(options.data ? JSON.stringify(options.data) : null);
}

function createCORSRequest(method, url) {
  let xhr = new XMLHttpRequest();
  if ('withCredentials' in xhr) {
    // Check if the XMLHttpRequest object has a "withCredentials" property.
    // "withCredentials" only exists on XMLHTTPRequest2 objects.
    xhr.open(method, url, true);
  } else {
    // @ts-ignore
    const X = XDomainRequest;
    if (typeof X !== 'undefined') {
      // Otherwise, check if XDomainRequest.
      // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
      xhr = new X();
      xhr.open(method, url);
    } else {
      // Otherwise, CORS is not supported by the browser.
      xhr = null;
    }
  }
  return xhr;
}

// https://github.com/Leaflet/Leaflet/blob/b507e21c510b53cd704fb8d3f89bb46ea925c8eb/src/core/Util.js#L165
const templateRe = /\{ *([\w_-]+) *\}/g;

function template(str, data) {
  return str.replace(templateRe, (s, key) => {
    let value = data[key];

    if (value === undefined) {
      throw new Error('No value provided for letiable ' + s);

    } else if (typeof value === 'function') {
      value = value(data);
    }
    return value;
  });
}
