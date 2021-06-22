import CancelablePromise from '@nextgis/cancelable-promise';
import { DeepPartial, fixUrlStr } from '@nextgis/utils';
import { EventEmitter } from 'events';

import { RequestItemsParamsMap } from './types/RequestItemsParamsMap';
import { ResourceItem, Resource } from './types/ResourceItem';

import { loadData } from './utils/loadData';
import { template } from './utils/template';
import { ResourceNotFoundError } from './errors/ResourceNotFoundError';
import { NgwError } from './errors/NgwError';
import { InsufficientPermissionsError } from './errors/InsufficientPermissionsError';
import {
  addConnector,
  findConnector,
  removeConnector,
} from './activeConnectors';
import { ResourcesControl } from './ResourcesControl';

import type {
  DeleteRequestItemsResponseMap,
  PatchRequestItemsResponseMap,
  PostRequestItemsResponseMap,
  GetRequestItemsResponseMap,
  PutRequestItemsResponseMap,
  ResourceIdKeynameDef,
  NgwConnectorOptions,
  ResourceDefinition,
  RequestItemsParams,
  RequestItemKeys,
  RequestHeaders,
  RequestOptions,
  PyramidRoute,
  Credentials,
  UserInfo,
  Params,
} from './interfaces';

export class NgwConnector {
  static errors = {
    NgwError,
    ResourceNotFoundError,
  };

  emitter = new EventEmitter();
  user?: UserInfo;

  resources: ResourcesControl;

  private routeStr = '/api/component/pyramid/route';
  private route?: PyramidRoute;

  constructor(public options: NgwConnectorOptions) {
    if (this.options.route) {
      this.routeStr = this.options.route;
    }
    this.resources = new ResourcesControl(this);
    addConnector(this);
  }

  static create(options: NgwConnectorOptions): NgwConnector {
    const exist = findConnector(options);
    if (exist) {
      return exist;
    } else {
      const connector = new this(options);
      return connector;
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
    addConnector(this);
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
    addConnector(this);
    return this.getUserInfo(credentials);
  }

  /**
   * Disconnecting a user. Aborting all current requests
   */
  logout(): void {
    removeConnector(this);
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
    credentials?: Credentials,
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
      // @ts-ignore
      if (__BROWSER__) {
        return window.btoa(str);
      } else {
        return Buffer.from(str).toString('base64');
      }
    }
  }

  /**
   * Send request to NGW api router.
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
    options?: RequestOptions,
  ): CancelablePromise<P[K]> {
    return new CancelablePromise((resolve, reject) => {
      this.connect()
        .then((apiItems) => {
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
                    '`' + arg + '`' + ' url api argument is not specified',
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
              resolve(this.makeQuery(url, params, options));
            } else {
              reject(new Error('request url is not set'));
            }
          } else {
            resolve(undefined);
          }
        })
        .catch((er) => {
          reject(er);
        });
    });
  }

  /**
   * Shortcut method for send POST request to NGW.
   * @param name - NGW route name from {@link https://docs.nextgis.com/docs_ngweb_dev/doc/developer/resource.html#routes | routes}
   * @param options - Request options
   * @param params - Request item params or query params
   *
   * @example
   * ```javascript
   * connector.post('resource.collection', { data: POST_PAYLOAD })
   *   .then((newResource) => console.log(newResource))
   *   .catch((error) => console.warn(error));
   * ```
   */
  post<K extends keyof RequestItemsParamsMap>(
    name: K,
    options?: RequestOptions<'POST'>,
    params?: RequestItemsParams<K>,
  ): CancelablePromise<PostRequestItemsResponseMap[K]> {
    options = options || {};
    options.method = 'POST';
    return this.apiRequest<K, PostRequestItemsResponseMap>(
      name,
      params,
      options,
    );
  }

  /**
   * Shortcut method for send GET request to NGW.
   * @param name - NGW route name from {@link https://docs.nextgis.com/docs_ngweb_dev/doc/developer/resource.html#routes | routes}
   * @param options - Request options
   * @param params - Request item params or query params
   */
  get<K extends keyof RequestItemsParamsMap>(
    name: K,
    options?: RequestOptions | undefined | null,
    params?: RequestItemsParams<K>,
  ): CancelablePromise<GetRequestItemsResponseMap[K]> {
    options = options || {};
    options.method = 'GET';
    return this.apiRequest<K, GetRequestItemsResponseMap>(
      name,
      params,
      options,
    );
  }

  /**
   * Shortcut method for send PATCH request to NGW.
   * @param name - NGW route name from {@link https://docs.nextgis.com/docs_ngweb_dev/doc/developer/resource.html#routes | routes}
   * @param options - Request options
   * @param params - Request item params or query params
   */
  patch<K extends keyof RequestItemsParamsMap>(
    name: K,
    options?: RequestOptions,
    params?: RequestItemsParams<K>,
  ): CancelablePromise<PatchRequestItemsResponseMap[K]> {
    options = options || {};
    options.method = 'PATCH';
    return this.apiRequest<K, PatchRequestItemsResponseMap>(
      name,
      params,
      options,
    );
  }

  /**
   * Shortcut method for send PUT request to NGW.
   * @param name - NGW route name from {@link https://docs.nextgis.com/docs_ngweb_dev/doc/developer/resource.html#routes | routes}
   * @param options - Request options
   * @param params - Request item params or query params
   */
  put<K extends keyof RequestItemsParamsMap>(
    name: K,
    options?: RequestOptions,
    params?: RequestItemsParams<K>,
  ): CancelablePromise<PutRequestItemsResponseMap[K]> {
    options = options || {};
    options.method = 'PUT';
    return this.apiRequest<K, PutRequestItemsResponseMap>(
      name,
      params,
      options,
    );
  }

  /**
   * Shortcut method for send DELETE request to NGW.
   * @param name - NGW route name from {@link https://docs.nextgis.com/docs_ngweb_dev/doc/developer/resource.html#routes | routes}
   * @param options - Request options
   * @param params - Request item params or query params
   */
  delete<K extends keyof RequestItemsParamsMap>(
    name: K,
    options?: RequestOptions | undefined | null,
    params?: RequestItemsParams<K>,
  ): CancelablePromise<DeleteRequestItemsResponseMap[K]> {
    options = options || {};
    options.method = 'DELETE';
    return this.apiRequest<K, DeleteRequestItemsResponseMap>(
      name,
      params,
      options,
    );
  }

  /**
   * Send request to NGW.
   * @param url - URL address to NGW
   * @param params - Query params
   * @param options - Request options
   */
  makeQuery(
    url: string,
    params?: Params,
    options: RequestOptions = {},
  ): CancelablePromise<any> {
    url = (this.options.baseUrl ? this.options.baseUrl : '') + url;
    if (url) {
      if (params) {
        url = template(url, params);
      }
      // remove double slash
      url = fixUrlStr(url);
      return this._loadData(url, options);
    } else {
      throw new Error('Empty `url` not allowed');
    }
  }

  // -------------------------------------------------------------------------
  // Resource Methods
  // -------------------------------------------------------------------------

  /**
   * {@inheritDoc ResourcesControl.getOne}
   */
  getResource(
    resource: ResourceDefinition,
  ): CancelablePromise<ResourceItem | undefined> {
    return this.resources.getOne(resource);
  }

  /**
   * {@inheritDoc ResourcesControl.getOneOrFail}
   */
  getResourceOrFail(
    resource: ResourceDefinition,
  ): CancelablePromise<ResourceItem> {
    return this.resources.getOneOrFail(resource);
  }

  /**
   * @deprecated - use {@link NgwConnector.getResource}
   */
  getResourceBy(
    resource: DeepPartial<Resource>,
  ): CancelablePromise<ResourceItem | undefined> {
    return this.resources.getOne(resource);
  }

  /**
   * @deprecated - use {@link NgwConnector.getResource}
   */
  getResourceByKeyname(
    keyname: string,
  ): CancelablePromise<ResourceItem | undefined> {
    return this.resources.getOne(keyname);
  }

  /**
   * @deprecated - use {@link NgwConnector.getResource}
   */
  getResourceById(id: number): CancelablePromise<ResourceItem | undefined> {
    return this.resources.getOne(id);
  }

  /**
   * {@inheritDoc ResourcesControl.getId}
   */
  getResourceId(
    resource: ResourceDefinition,
  ): CancelablePromise<number | undefined> {
    return this.resources.getId(resource);
  }

  /**
   * {@inheritDoc ResourcesControl.getIdOrFail}
   */
  getResourceIdOrFail(resource: ResourceDefinition): CancelablePromise<number> {
    return this.resources.getIdOrFail(resource);
  }

  /**
   * {@inheritDoc ResourcesControl.getMany}
   */
  getResourcesBy(
    resource: DeepPartial<Resource>,
  ): Promise<ResourceItem[]> {
    return this.resources.getMany(resource);
  }

  /**
   * {@inheritDoc ResourcesControl.getChildrenOf}
   */
  getResourceChildren(
    optOrResource:
      | string
      | number
      | {
          keyname?: string;
          resourceId?: number;
          resource?: string | number;
        },
  ): Promise<ResourceItem[]> {
    return this.resources.getChildrenOf(optOrResource);
  }

  /**
   * {@inheritDoc ResourcesControl.update}
   */
  updateResource(
    resource: ResourceIdKeynameDef,
    data: DeepPartial<ResourceItem>,
  ): CancelablePromise<ResourceItem | undefined> {
    return this.resources.update(resource, data);
  }

  /**
   * {@inheritDoc ResourcesControl.delete}
   */
  deleteResource(resource: ResourceIdKeynameDef): CancelablePromise<void> {
    return this.resources.delete(resource);
  }

  /**
   * @internal
   */
  protected _loadData(
    url: string,
    options: RequestOptions,
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
      if (httpError instanceof CancelablePromise.CancelError) {
        // not need to handle cancel error because onCancel method is used
      } else {
        // @ts-ignore
        if (__DEV__) {
          console.warn(httpError);
        }
        const er = this._handleHttpError(httpError);
        if (er) {
          throw er;
        }
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
}
