import CancelablePromise from '@nextgis/cancelable-promise';
import { DeepPartial, defined } from '@nextgis/utils';
import { EventEmitter } from 'events';

import { RequestItemsParamsMap } from './types/RequestItemsParamsMap';
import { ResourceItem, Resource } from './types/ResourceItem';
import {
  NgwConnectorOptions,
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
  PutRequestItemsResponseMap,
  RequestItemsParams,
  ResourceDefinition,
} from './interfaces';
import { loadData } from './utils/loadData';
import { template } from './utils/template';
import { resourceToQuery } from './utils/resourceToQuery';
import { resourceCompare } from './utils/resourceCompare';
import { ResourceNotFoundError } from './errors/ResourceNotFoundError';
import { NgwError } from './errors/NgwError';
import { isObject } from './utils/isObject';
import { InsufficientPermissionsError } from './errors/InsufficientPermissionsError';

export class NgwConnector {
  static errors = {
    NgwError,
    ResourceNotFoundError,
  };

  emitter = new EventEmitter();
  user?: UserInfo;
  requestControl = CancelablePromise.createControl();

  private routeStr = '/api/component/pyramid/route';
  private route?: PyramidRoute;
  private _loadingQueue: { [name: string]: LoadingQueue } = {};
  private _loadingStatus: { [url: string]: boolean } = {};
  private _queriesCache: { [url: string]: any } = {};
  private _resourcesCache: Record<number, ResourceItem> = {};

  constructor(public options: NgwConnectorOptions) {
    if (this.options.route) {
      this.routeStr = this.options.route;
    }
  }

  /**
   * Fast way to specify the connection address to NextGIS Web.
   * The current connection will be severed.
   * @param baseUrl - NGW url
   */
  setNgw(baseUrl: string): void {
    this.logout();
    this.options.baseUrl = baseUrl;
  }

  /**
   * Establishing a connection with NextGIS Web to fulfill all other requests.
   * @remarks
   * This method need not be called manually as it is used when forming a request in {@link NgwConnector.apiRequest | apiRequest}.
   * Can be used to check connection.
   * @example
   * ```javascript
   * const connector = new NgwConnector({baseUrl: 'https://demo.nextgis.com'});
   * connector.connect()
   *   .then(() => console.log('Ok'))
   *   .catch((er) => console.log('Connection problem', er));
   * ```
   */
  connect(): CancelablePromise<PyramidRoute> {
    return new CancelablePromise((resolve, reject) => {
      const makeQuery = () => {
        return this.makeQuery(this.routeStr, {}, {})
          .then((route: PyramidRoute) => {
            this.route = route;
            resolve(route);
          })
          .catch((er) => {
            reject(er);
          });
      };
      if (this.route) {
        return resolve(this.route);
      } else {
        if (this.options.auth) {
          const { login, password } = this.options.auth;
          if (login && password) {
            return this.getUserInfo({ login, password })
              .then(() => makeQuery())
              .catch((er) => reject(er));
          }
        }
        return makeQuery();
      }
    });
  }

  /**
   * Quick way to change NextGIS Web user.
   * @param credentials - New user credentials
   */
  login(credentials: Credentials): CancelablePromise<UserInfo> {
    this.logout();
    return this.getUserInfo(credentials);
  }

  /**
   * Disconnecting a user. Aborting all current requests
   */
  logout(): void {
    this.requestControl.abort();
    this._rejectLoadingQueue();
    this._loadingStatus = {};
    this.options.auth = undefined;
    this.route = undefined;
    this.user = undefined;
    this.emitter.emit('logout');
  }

  // TODO: rename
  getUserInfo(credentials?: Credentials): CancelablePromise<UserInfo> {
    if (this.user && this.user.id) {
      return CancelablePromise.resolve(this.user);
    }
    if (credentials) {
      this.options.auth = credentials;
    }
    const options: RequestOptions = {
      headers: this.getAuthorizationHeaders(credentials),
      // withCredentials: true
    };

    // Do not use request('auth.current_user') to avoid circular-references
    return this.makeQuery('/api/component/auth/current_user', {}, options)
      .then((data: UserInfo) => {
        this.user = data;
        this.emitter.emit('login', data);
        return data;
      })
      .catch((er) => {
        this.emitter.emit('login:error', er);
        throw er;
      });
  }

  /**
   * Obtaining the required Headers for authentication of requests in the NGW.
   */
  getAuthorizationHeaders(
    credentials?: Credentials
  ): RequestHeaders | undefined {
    const client = this.makeClientId(credentials);
    if (client) {
      return {
        Authorization: 'Basic ' + client,
      };
    }
  }

  makeClientId(credentials?: Credentials): string | undefined {
    credentials = credentials || this.options.auth;
    if (credentials) {
      const { login, password } = credentials;
      const str = unescape(encodeURIComponent(`${login}:${password}`));
      if (__BROWSER__) {
        return window.btoa(str);
      } else {
        return Buffer.from(str).toString('base64');
      }
    }
  }

  /**
   * Compose request for NGW api router.
   * @param name - NGW route name from {@link https://docs.nextgis.com/docs_ngweb_dev/doc/developer/resource.html#routes | routes}
   * @param params - Request item params or query params
   * @param options - Request options
   *
   * @example
   * ```javascript
   *
   * // there is such an NGW route item
   * // "feature_layer.feature.item": [
   * //   "/api/resource/{0}/feature/{1}",
   * //   "id",
   * //   "fid"
   * // ],
   *
   * const connector = new NgwConnector({ baseUrl: 'https://example.nextgis.com' });
   * connector.apiRequest('feature_layer.feature.item', {
   *   // request params for {0} and {1}
   *   'id': 2011,
   *   'fid': 101,
   *   // query params
   *   'srs': 4326,
   *   'geom_format': 'geojson',
   * }, { method: 'GET' });
   * // send get-request to 'https://example.nextgis.com/api/resource/2011/feature/101?srs=4326&geom_format=geojson'
   *
   * ```
   */
  apiRequest<
    K extends keyof RequestItemsParamsMap,
    P extends RequestItemKeys = RequestItemKeys
  >(
    name: K,
    params: RequestItemsParams<K> = {},
    options?: RequestOptions
  ): CancelablePromise<P[K]> {
    return new CancelablePromise((resolve, reject) => {
      this.connect()
        .then((apiItems) => {
          // const apiItems = this.route;
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
              const paramList = params.paramList;
              if (Array.isArray(paramList)) {
                delete params.paramList;
                paramList.forEach((x) => {
                  paramArray.push(`${x[0]}=${x[1]}`);
                });
              }
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
              return this.makeQuery(url, params, options)
                .then((resp) => {
                  resolve(resp);
                })
                .catch(reject);
            } else {
              reject(new Error('request url is not set'));
            }
          } else {
            resolve({} as P[K]);
          }
        })
        .catch((er) => {
          reject(er);
        });
    });
  }

  post<K extends keyof RequestItemsParamsMap>(
    name: K,
    options?: RequestOptions<'POST'>,
    params?: RequestItemsParams<K>
  ): CancelablePromise<PostRequestItemsResponseMap[K]> {
    options = options || {};
    options.method = 'POST';
    options.nocache = true;
    return this.apiRequest<K, PostRequestItemsResponseMap>(
      name,
      params,
      options
    );
  }

  get<K extends keyof RequestItemsParamsMap>(
    name: K,
    options?: RequestOptions | undefined | null,
    params?: RequestItemsParams<K>
  ): CancelablePromise<GetRequestItemsResponseMap[K]> {
    options = options || {};
    options.method = 'GET';
    options.nocache = true;
    return this.apiRequest<K, GetRequestItemsResponseMap>(
      name,
      params,
      options
    );
  }

  patch<K extends keyof RequestItemsParamsMap>(
    name: K,
    options?: RequestOptions,
    params?: RequestItemsParams<K>
  ): CancelablePromise<PatchRequestItemsResponseMap[K]> {
    options = options || {};
    options.method = 'PATCH';
    options.nocache = true;
    return this.apiRequest<K, PatchRequestItemsResponseMap>(
      name,
      params,
      options
    );
  }

  put<K extends keyof RequestItemsParamsMap>(
    name: K,
    options?: RequestOptions,
    params?: RequestItemsParams<K>
  ): CancelablePromise<PutRequestItemsResponseMap[K]> {
    options = options || {};
    options.method = 'PUT';
    options.nocache = true;
    return this.apiRequest<K, PutRequestItemsResponseMap>(
      name,
      params,
      options
    );
  }

  delete<K extends keyof RequestItemsParamsMap>(
    name: K,
    options?: RequestOptions | undefined | null,
    params?: RequestItemsParams<K>
  ): CancelablePromise<DeleteRequestItemsResponseMap[K]> {
    options = options || {};
    options.method = 'DELETE';
    options.nocache = true;
    return this.apiRequest<K, DeleteRequestItemsResponseMap>(
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
      if (options.cache && this._queriesCache[url]) {
        return this._queriesCache[url];
      }
      if (!this._loadingStatus[url] || options.nocache) {
        this._loadingStatus[url] = true;
        return this.requestControl.add(
          this._loadData(url, options)
            .then((data) => {
              this._loadingStatus[url] = false;
              if (options.cache) {
                this._queriesCache[url] = data;
              }
              this._executeLoadingQueue(url, data);
              return data;
            })
            .catch((er) => {
              this._loadingStatus[url] = false;
              this._executeLoadingQueue(url, er, true);
              throw er;
            })
        );
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

  // -------------------------------------------------------------------------
  // Resource Methods
  // -------------------------------------------------------------------------

  getResource(
    resource: ResourceDefinition | DeepPartial<Resource>
  ): CancelablePromise<ResourceItem | undefined> {
    if (typeof resource === 'string') {
      return this.getResourceByKeyname(resource);
    } else if (typeof resource === 'number') {
      return this.getResourceById(resource);
    } else if (isObject(resource)) {
      return this.getResourceBy(resource);
    }
    return CancelablePromise.resolve(undefined);
  }

  getResourceId(
    resource: ResourceDefinition
  ): CancelablePromise<number | undefined> {
    if (typeof resource === 'number') {
      return CancelablePromise.resolve(resource);
    } else if (typeof resource === 'string') {
      return this.getResourceByKeyname(resource).then((res) => {
        if (res) {
          return res.resource.id;
        }
      });
    }
    return CancelablePromise.resolve(undefined);
  }

  getResourcesBy(
    resource: DeepPartial<Resource>
  ): CancelablePromise<ResourceItem[]> {
    let items: ResourceItem[] = [];
    if (resource.id) {
      const existId = this._resourcesCache[resource.id];
      if (existId) {
        items.push(existId);
      }
    } else {
      items = this._resourceCacheFilter(resource);
    }
    if (!items.length) {
      const query: Record<string, unknown> = {};
      if (resource.keyname) {
        query.keyname = resource.keyname;
      } else {
        Object.assign(query, resourceToQuery(resource));
      }
      return this.get('resource.search', null, {
        serialization: 'full',
        ...query,
      }).then((resources) => {
        if (resources) {
          resources.forEach((x) => {
            this._resourcesCache[x.resource.id] = x;
          });
        }
        return resources;
      });
    }
    return CancelablePromise.resolve(items);
  }

  getResourceBy(
    resource: DeepPartial<Resource>
  ): CancelablePromise<ResourceItem | undefined> {
    return this.getResourcesBy(resource).then((resources) => {
      return resources[0];
    });
  }

  getResourceByKeyname(
    keyname: string
  ): CancelablePromise<ResourceItem | undefined> {
    return this.getResourceBy({ keyname });
  }

  getResourceById(id: number): CancelablePromise<ResourceItem | undefined> {
    const item: ResourceItem = this._resourcesCache[id];
    if (!item) {
      return this.get('resource.item', null, { id })
        .then((item) => {
          if (item) {
            this._resourcesCache[id] = item;
          }
          return item;
        })
        .catch((er) => {
          if (!(er instanceof ResourceNotFoundError)) {
            throw er;
          }
          return undefined;
        });
    }
    return CancelablePromise.resolve(item);
  }

  getResourceChildren(
    optOrResource:
      | string
      | number
      | {
          keyname?: string;
          resourceId?: number;
          resource?: string | number;
        }
  ): CancelablePromise<ResourceItem[]> {
    let opt: {
      keyname?: string;
      resourceId?: number;
      resource?: string | number;
    } = {};
    if (typeof optOrResource === 'string') {
      opt.keyname = optOrResource;
    } else if (typeof optOrResource === 'number') {
      opt.resourceId = optOrResource;
    } else {
      opt = optOrResource;
    }
    let parent = opt.resourceId;
    let keyname = opt.keyname;
    if (!opt.keyname && !opt.resourceId && !opt.resource) {
      throw new Error('No keyname or resourceId is set');
    }
    if (opt.resource) {
      if (typeof opt.resource === 'string') {
        keyname = opt.resource;
      } else if (typeof opt.resource === 'number') {
        parent = opt.resource;
      }
    }
    const collection = () =>
      this.get('resource.collection', null, {
        parent,
      });
    if (keyname) {
      return this.getResourceByKeyname(keyname).then((item) => {
        if (item) {
          parent = item.resource.id;
        }
        return collection();
      });
    }
    return collection();
  }

  deleteResource(resource: ResourceDefinition): CancelablePromise<void> {
    return this.getResourceId(resource).then((id) => {
      if (id !== undefined) {
        return this.delete('resource.item', null, { id }).then(() => {
          delete this._resourcesCache[id];
          return undefined;
        });
      }
    });
  }

  /**
   * @internal
   */
  protected _setLoadingQueue(
    name: string,
    resolve: (...args: any[]) => any,
    reject: (...args: any[]) => any
  ): void {
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

  /**
   * @internal
   */
  protected _rejectLoadingQueue(): void {
    for (const q in this._loadingQueue) {
      const queue = this._loadingQueue[q];
      queue.waiting.forEach((x) => {
        x.reject();
      });
      delete this._loadingQueue[q];
    }
  }

  /**
   * @internal
   */
  protected _executeLoadingQueue(
    name: string,
    data: unknown,
    isError?: boolean
  ): void {
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

  /**
   * @internal
   */
  protected _loadData(
    url: string,
    options: RequestOptions
  ): CancelablePromise<any> {
    options.responseType = options.responseType || 'json';
    return new CancelablePromise((resolve, reject, onCancel) => {
      if (this.user) {
        options = options || {};
        // options.withCredentials = true;
        options.headers = {
          ...this.getAuthorizationHeaders(),
          ...options.headers,
        };
      }
      loadData(url, resolve, options, reject, onCancel);
    }).catch((httpError) => {
      if (__DEV__) {
        console.error(httpError);
      }
      const er = this._handleHttpError(httpError);
      if (er) {
        throw er;
      }
    });
  }

  private _handleHttpError(er: Error) {
    if (er) {
      if (er instanceof NgwError) {
        if (er.exception === 'nextgisweb.resource.exception.ResourceNotFound') {
          throw new ResourceNotFoundError(er);
        } else if (
          er.exception === 'nextgisweb.core.exception.InsufficientPermissions'
        ) {
          throw new InsufficientPermissionsError(er);
        }
      }
    }
    return er;
  }

  private _resourceCacheFilter(
    resource: DeepPartial<Resource>
  ): ResourceItem[] {
    const items: ResourceItem[] = Object.values(this._resourcesCache).filter(
      (x) => {
        // identical by uniq props
        if (resource.keyname && x.resource.keyname) {
          return resource.keyname === x.resource.keyname;
        }
        if (defined(resource.id) && defined(x.resource.id)) {
          return resource.id === x.resource.id;
        }
        return resourceCompare(resource, x.resource);
      }
    );
    return items;
  }
}
