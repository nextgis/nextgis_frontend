
import { ResourceItem } from './types/ResourceItem';
import { RequestItemsParamsMap } from './types/RequestItemsParamsMap';

// region inline polyfills
// tslint:disable-next-line:max-line-length
// Object.assign || Object.defineProperty(Object, "assign", { enumerable: !1, configurable: !0, writable: !0, value: function (e, r) { "use strict"; if (null == e) throw new TypeError("Cannot convert first argument to object"); for (let t = Object(e), n = 1; n < arguments.length; n++) { let o = arguments[n]; if (null != o) for (let a = Object.keys(Object(o)), c = 0, b = a.length; c < b; c++) { let i = a[c], l = Object.getOwnPropertyDescriptor(o, i); void 0 !== l && l.enumerable && (t[i] = o[i]) } } return t } });

type simple = string | number | boolean;

type cbParams = (params: Params) => simple;

interface Router {
  [name: string]: string[];
}

interface Params {
  [name: string]: simple | cbParams;
}

interface RequestItemsResponseMap {
  'resource.item': ResourceItem;
  'resource.child': any;
  [x: string]: {[x: string]: any};
}

export interface NgwConnectorOptions {
  route?: string;
  baseUrl?: string;
}

const OPTIONS: NgwConnectorOptions = {
  route: '/api/component/pyramid/route',
  // baseUrl: 'http://'
};

export class NgwConnector {

  options: NgwConnectorOptions = {};
  private route;

  private _loadingQueue = {};
  private _loadingStatus = {};

  constructor(options) {
    this.options = Object.assign({}, OPTIONS, options || {});
  }

  connect(callback: (router: Router) => void, context: any): void {
    const self = this;
    if (this.route) {
      callback.call(context || this, this.route);
    } else {
      this.makeQuery(this.options.route, function (route) {
        self.route = route;
        callback.call(this, route);
      }, {}, context);
    }
  }

  request<K extends keyof RequestItemsParamsMap>(
    name: K,
    callback: (data: RequestItemsResponseMap[K]) => void,
    params?: RequestItemsParamsMap[K] | {},
    error?: (er: Error) => void,
    context?: any): void {
    this.connect((apiItems) => {
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
            this.makeQuery(url, callback, params, this, error);
          }
        }
      }
    }, context || this);
  }

  makeQuery(
    url: string,
    callback: ({ }) => void,
    params: Params,
    context: any,
    error?: (er: Error) => void): void {

    context = context || this;
    url = (this.options.baseUrl ? this.options.baseUrl : '') + url;
    if (url) {
      if (params) {
        url = template(url, params);
      }
      // remove double slash
      url = url.replace(/([^:]\/)\/+/g, '$1');
      if (!this._loadingStatus[url]) {
        this._loadingStatus[url] = true;
        this._getJson(url, (data) => {
          callback.call(context, data);
          this._loadingStatus[url] = false;
          this._exequteLoadingQueue(url, data);
        }, context, (er) => {
          this._loadingStatus[url] = false;
          this._exequteLoadingQueue(url, er, true);
          if (error) {
            error.call(context, er);
          } else {
            throw new Error(er);
          }
        });
      } else {
        this._loadingStatus[url] = false;
        this._setLoadingQueue(url, callback, context, error);
      }
    } else {
      throw new Error('No `url` parameter set for option ' + name);
    }

  }

  _setLoadingQueue(name, callback, context, error) {
    this._loadingQueue[name] = this._loadingQueue[name] || {
      name,
      waiting: [],
    };
    this._loadingQueue[name].waiting.push({
      callback,
      error,
      context,
      timestamp: new Date(),
    });
  }

  _exequteLoadingQueue(name, data, isError?) {
    const queue = this._loadingQueue[name];
    if (queue) {
      for (let fry = 0; fry < queue.waiting.length; fry++) {
        const wait = queue.waiting[fry];
        if (isError) {
          if (wait.error) {
            wait.error.call(wait.context, data);
          }
        } else {
          wait.callback.call(wait.context, data);
        }
      }
      queue.waiting = [];
    }
  }

  _getJson(url, callback, context, error) {
    return loadJSON(url, callback, context, error);
  }
}

function loadJSON (url, callback, context, error) {
  const xmlHttp = new XMLHttpRequest();
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
  xmlHttp.open('GET', url, true); // true for asynchronous
  xmlHttp.send(null);
}

// https://github.com/Leaflet/Leaflet/blob/b507e21c510b53cd704fb8d3f89bb46ea925c8eb/src/core/Util.js#L165
const templateRe = /\{ *([\w_-]+) *\}/g;

function template (str, data) {
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
