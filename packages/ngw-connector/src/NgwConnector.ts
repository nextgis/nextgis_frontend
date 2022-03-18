import { EventEmitter } from 'events';
import CancelablePromise from '@nextgis/cancelable-promise';
import { objectRemoveEmpty } from '@nextgis/utils';
import { fixUrlStr } from '@nextgis/utils';
import Cache from '@nextgis/cache';

import { loadData } from './utils/loadData';
import { template } from './utils/template';
import { NgwError } from './errors/NgwError';
import { ResourceNotFoundError } from './errors/ResourceNotFoundError';
import { InsufficientPermissionsError } from './errors/InsufficientPermissionsError';
import {
  addConnector,
  findConnector,
  removeConnector,
} from './activeConnectors';
import { ResourcesControl } from './ResourcesControl';

import type { DeepPartial } from '@nextgis/utils';
import type {
  DeleteRequestItemsResponseMap,
  PatchRequestItemsResponseMap,
  PostRequestItemsResponseMap,
  GetRequestItemsResponseMap,
  PutRequestItemsResponseMap,
  GetChildrenOfOptions,
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
import type { RequestItemsParamsMap } from './types/RequestItemsParamsMap';
import type { ResourceItem, Resource } from './types/ResourceItem';
import { apiRequest } from './utils/apiRequest';

let ID = 0;

export class NgwConnector {
  static errors = {
    NgwError,
    ResourceNotFoundError,
  };
  id = ID++;

  emitter = new EventEmitter();
  user?: UserInfo;

  resources!: ResourcesControl;

  private routeStr = '/api/component/pyramid/route';

  constructor(public options: NgwConnectorOptions) {
    const exist = findConnector(options);
    if (exist) {
      return exist;
    } else {
      if (this.options.route) {
        this.routeStr = this.options.route;
      }
      this.resources = new ResourcesControl(this);
      addConnector(this);
    }
  }

  static create(options: NgwConnectorOptions): NgwConnector {
    return new this(options);
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
    const cache = new Cache();
    const auth = this.options.auth;
    const makeConnect = () =>
      new CancelablePromise((resolve, reject) => {
        const makeQuery = () => {
          return this.makeQuery<PyramidRoute>(this.routeStr, {}, {})
            .then((route) => {
              resolve(route);
            })
            .catch((er) => {
              reject(er);
            });
        };
        if (auth) {
          const { login, password } = auth;
          if (login && password) {
            return this.getUserInfo({ login, password })
              .then(() => {
                makeQuery();
              })
              .catch((er) => reject(er));
          }
        }
        return makeQuery();
      });
    return cache.add('route', makeConnect, {
      id: this.id,
      auth,
      baseUrl: this.options.baseUrl,
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
    this.user = undefined;
    this.emitter.emit('logout');
    this.resources.cache.clean();
  }

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

    // Do not use apiRequest('auth.current_user') to avoid circular-references
    return this.makeQuery<UserInfo>(
      '/api/component/auth/current_user',
      {},
      options,
    )
      .then((data) => {
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
   * @param requestOptions - Request options
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
    P extends RequestItemKeys = RequestItemKeys,
  >(
    name: K,
    params_: RequestItemsParams<K> = {},
    requestOptions: RequestOptions = {},
  ): CancelablePromise<P[K]> {
    const { method, headers, withCredentials, responseType } = requestOptions;
    const params = objectRemoveEmpty(params_);
    const makeApiRequest = () =>
      apiRequest({ name, params, requestOptions, connector: this });
    if (requestOptions.cache && method === 'GET') {
      const cache = new Cache<CancelablePromise<P[K]>>();
      return cache.add(name, makeApiRequest, {
        params,
        ...objectRemoveEmpty({
          headers,
          withCredentials,
          responseType,
          baseUrl: this.options.baseUrl,
          auth: this.options.auth,
        }),
      });
    }
    return makeApiRequest();
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
  makeQuery<R = unknown>(
    url: string,
    params?: Params | null,
    options: RequestOptions = {},
  ): CancelablePromise<R> {
    url = (this.options.baseUrl ? this.options.baseUrl : '') + url;
    if (url) {
      if (params) {
        url = template(url, params);
      }
      // remove double slash
      url = fixUrlStr(url);
      return this._loadData(encodeURI(url), options);
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
    requestOptions?: Pick<RequestOptions, 'cache'>,
  ): CancelablePromise<ResourceItem | undefined> {
    return this.resources.getOne(resource, requestOptions);
  }

  /**
   * {@inheritDoc ResourcesControl.getOneOrFail}
   */
  getResourceOrFail(
    resource: ResourceDefinition,
    requestOptions?: Pick<RequestOptions, 'cache'>,
  ): CancelablePromise<ResourceItem> {
    return this.resources.getOneOrFail(resource, requestOptions);
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
    requestOptions?: Pick<RequestOptions, 'cache'>,
  ): CancelablePromise<number | undefined> {
    return this.resources.getId(resource, requestOptions);
  }

  /**
   * {@inheritDoc ResourcesControl.getIdOrFail}
   */
  getResourceIdOrFail(
    resource: ResourceDefinition,
    requestOptions?: Pick<RequestOptions, 'cache'>,
  ): CancelablePromise<number> {
    return this.resources.getIdOrFail(resource, requestOptions);
  }

  /**
   * {@inheritDoc ResourcesControl.getMany}
   */
  getResourcesBy(
    resource: DeepPartial<Resource>,
    requestOptions?: Pick<RequestOptions, 'cache'>,
  ): CancelablePromise<ResourceItem[]> {
    return this.resources.getMany(resource, requestOptions);
  }

  /**
   * {@inheritDoc ResourcesControl.getParent}
   */
  getResourceParent(
    resource: ResourceDefinition,
    requestOptions?: Pick<RequestOptions, 'cache'>,
  ): CancelablePromise<ResourceItem | undefined> {
    return this.resources.getParent(resource, requestOptions);
  }

  /**
   * {@inheritDoc ResourcesControl.getChildrenOf}
   */
  getResourceChildren(
    resource: ResourceDefinition,
    requestOptions?: GetChildrenOfOptions,
  ): CancelablePromise<ResourceItem[]> {
    return this.resources.getChildrenOf(resource, requestOptions);
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
          console.warn('DEV WARN', httpError);
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
