import { EventEmitter } from 'events';

import Cache from '@nextgis/cache';
import CancelablePromise from '@nextgis/cancelable-promise';
import { objectRemoveEmpty } from '@nextgis/utils';
import { fixUrlStr } from '@nextgis/utils';

import pkg from '../package.json';

import { ResourcesControl } from './ResourcesControl';
import {
  addConnector,
  findConnector,
  removeConnector,
} from './activeConnectors';
import { InsufficientPermissionsError } from './errors/InsufficientPermissionsError';
import { NgwError } from './errors/NgwError';
import { ResourceNotFoundError } from './errors/ResourceNotFoundError';
import { apiRequest } from './utils/apiRequest';
import { loadData } from './utils/loadData';
import { template } from './utils/template';

import type {
  Credentials,
  DeleteRequestItemsResponseMap,
  GetChildrenOfOptions,
  GetRequestItemsResponseMap,
  NgwConnectorOptions,
  Params,
  PatchRequestItemsResponseMap,
  PostRequestItemsResponseMap,
  PutRequestItemsResponseMap,
  PyramidRoute,
  RequestHeaders,
  RequestItemKeys,
  RequestItemsParams,
  RequestOptions,
  RequestTransformFunction,
  ResourceDefinition,
  ResourceIdKeynameDef,
  UserInfo,
} from './interfaces';
import type { RequestItemsParamsMap } from './types/RequestItemsParamsMap';
import type { Resource, ResourceItem } from './types/ResourceItem';
import type { DeepPartial } from '@nextgis/utils';

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
  cache: Cache;
  withCredentials?: boolean = undefined;

  private client = `NextGIS-NGW-Connector/${pkg.version}`;
  private routeStr = '/api/component/pyramid/route';
  private activeRequests: CancelablePromise[] = [];
  private requestTransform?: RequestTransformFunction | null;

  constructor(public options: NgwConnectorOptions) {
    const exist = findConnector(options);
    this.cache = new Cache({ namespace: options.cacheId });
    if (exist) {
      return exist;
    } else {
      const { route, requestTransform, withCredentials } = this.options;
      if (route) {
        this.routeStr = route;
      }
      if (requestTransform) {
        this.requestTransform = requestTransform;
      }
      if (withCredentials !== undefined) {
        this.withCredentials = withCredentials;
      }
      this.resources = new ResourcesControl({
        connector: this,
        cacheId: options.cacheId,
      });
      addConnector(this);
    }
  }

  static create(options: NgwConnectorOptions): NgwConnector {
    return new this(options);
  }

  /**
   * Clear the cache.
   */
  clearCache(): void {
    this.cache.clean();
    this.resources.cache.clean();
  }

  setRequestTransform(
    requestTransform: RequestTransformFunction | undefined | null,
  ) {
    this.requestTransform = requestTransform;
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
   * This method need not be called manually as it is used when forming a request in {@link apiRequest | apiRequest}.
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
    const auth = this.options.auth;
    const makeConnect = () =>
      new CancelablePromise((resolve, reject) => {
        const makeQuery = () => {
          const routeUrl = `${this.routeStr}?client=${this.client}`;
          return this.makeQuery<PyramidRoute>(routeUrl.toString(), {}, {})
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
            return this._login({ login, password })
              .then(() => {
                return makeQuery();
              })
              .catch((er) => reject(er));
          }
        }
        return makeQuery();
      });
    return this.cache.add('route', makeConnect, {
      id: this.id,
      auth,
      baseUrl: this.options.baseUrl,
    });
  }

  /**
   * Quick way to change NextGIS Web user.
   * @param credentials - New user credentials
   */
  login(
    credentials: Credentials,
    options?: RequestOptions,
  ): CancelablePromise<UserInfo> {
    this.logout();
    addConnector(this);
    return this._login(credentials, options);
  }

  /**
   * Disconnecting a user. Aborting all current requests
   */
  logout(): void {
    this.abort();
    removeConnector(this);
    this.options.auth = undefined;
    this.user = undefined;
    this.clearCache();
    this.emitter.emit('logout');
  }

  getUserInfo(
    credentials?: Credentials,
    options?: RequestOptions,
  ): CancelablePromise<UserInfo> {
    if (this.user && this.user.id) {
      return CancelablePromise.resolve(this.user);
    }
    if (credentials) {
      this.options.auth = credentials;
    }
    const options_: RequestOptions = {
      headers: this.getAuthorizationHeaders(credentials),
      // withCredentials: true
      ...options,
    };

    // Do not use apiRequest('auth.current_user') to avoid circular-references
    return this.makeQuery<UserInfo>(
      '/api/component/auth/current_user',
      {},
      options_,
    );
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
      const encodedStr = [login, password].map(encodeURIComponent).join(':');

      if (__BROWSER__) {
        return window.btoa(encodedStr);
      } else {
        return Buffer.from(encodedStr).toString('base64');
      }
    }
  }

  /** Stop all api requests */
  abort() {
    for (const req of this.activeRequests) {
      req.cancel();
    }
    this.activeRequests = [];
  }

  getActiveApiRequests() {
    return [...this.activeRequests];
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
    requestOptions = {
      withCredentials: this.withCredentials,
      ...requestOptions,
    };
    const { method, headers, withCredentials, responseType } = requestOptions;

    params_ = requestOptions.params ?? params_;
    const params = objectRemoveEmpty(params_);
    const makeApiRequest = () =>
      apiRequest({ name, params, requestOptions, connector: this });
    if (requestOptions.cache && method === 'GET') {
      return this.cache.add(name, makeApiRequest, {
        params,
        ...objectRemoveEmpty({
          headers,
          withCredentials,
          responseType,
          baseUrl: this.options.baseUrl,
          userId: this.user?.id,
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
    options?: RequestOptions<'POST', K>,
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
    options?: RequestOptions<'GET', K> | undefined | null,
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
    options?: RequestOptions<'PATCH', K>,
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
    options?: RequestOptions<'PUT', K>,
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
    options?: RequestOptions<'DELETE', K> | undefined | null,
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
      url = encodeURI(fixUrlStr(url));
      return this._loadData(url, options);
    } else {
      throw new Error('Empty `url` not allowed');
    }
  }

  // -------------------------------------------------------------------------
  // Resource Methods
  // -------------------------------------------------------------------------

  /**
   * {@link ResourcesControl.getOne}
   */
  getResource(
    resource: ResourceDefinition,
    requestOptions?: RequestOptions<'GET'>,
  ): CancelablePromise<ResourceItem | undefined> {
    return this.resources.getOne(resource, requestOptions);
  }

  /**
   * {@link ResourcesControl.getOneOrFail}
   */
  getResourceOrFail(
    resource: ResourceDefinition,
    requestOptions?: RequestOptions<'GET'>,
  ): CancelablePromise<ResourceItem> {
    return this.resources.getOneOrFail(resource, requestOptions);
  }

  /**
   * @deprecated - use {@link getResource}
   */
  getResourceBy(
    resource: DeepPartial<Resource>,
  ): CancelablePromise<ResourceItem | undefined> {
    return this.resources.getOne(resource);
  }

  /**
   * @deprecated - use {@link getResource}
   */
  getResourceByKeyname(
    keyname: string,
  ): CancelablePromise<ResourceItem | undefined> {
    return this.resources.getOne(keyname);
  }

  /**
   * @deprecated - use {@link getResource}
   */
  getResourceById(id: number): CancelablePromise<ResourceItem | undefined> {
    return this.resources.getOne(id);
  }

  /**
   * {@link ResourcesControl.getId}
   */
  getResourceId(
    resource: ResourceDefinition,
    requestOptions?: RequestOptions<'GET'>,
  ): CancelablePromise<number | undefined> {
    return this.resources.getId(resource, requestOptions);
  }

  /**
   * {@link ResourcesControl.getIdOrFail}
   */
  getResourceIdOrFail(
    resource: ResourceDefinition,
    requestOptions?: RequestOptions<'GET'>,
  ): CancelablePromise<number> {
    return this.resources.getIdOrFail(resource, requestOptions);
  }

  /**
   * {@link ResourcesControl.getMany}
   */
  getResourcesBy(
    resource: DeepPartial<Resource>,
    requestOptions?: RequestOptions<'GET'>,
  ): CancelablePromise<ResourceItem[]> {
    return this.resources.getMany(resource, requestOptions);
  }

  /**
   * {@link ResourcesControl.getParent}
   */
  getResourceParent(
    resource: ResourceDefinition,
    requestOptions?: RequestOptions<'GET'>,
  ): CancelablePromise<ResourceItem | undefined> {
    return this.resources.getParent(resource, requestOptions);
  }

  /**
   * {@link ResourcesControl.getChildrenOf}
   */
  getResourceChildren(
    resource: ResourceDefinition,
    requestOptions?: GetChildrenOfOptions,
  ): CancelablePromise<ResourceItem[]> {
    return this.resources.getChildrenOf(resource, requestOptions);
  }

  /**
   * {@link ResourcesControl.update}
   */
  updateResource(
    resource: ResourceIdKeynameDef,
    data: DeepPartial<ResourceItem>,
  ): CancelablePromise<ResourceItem | undefined> {
    return this.resources.update(resource, data);
  }

  /**
   * {@link ResourcesControl.delete}
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
    if (options.signal && options.signal.aborted) {
      return CancelablePromise.reject(new CancelablePromise.CancelError());
    }

    const request = new CancelablePromise((resolve, reject, onCancel) => {
      if (this.user) {
        options = options || {};
        // options.withCredentials = true;
        options.headers = {
          ...this.getAuthorizationHeaders(),
          ...options.headers,
        };
      }

      if (this.requestTransform) {
        const [transUrl, transOptions] = this.requestTransform(url, options);
        url = transUrl;
        options = transOptions;
      }
      loadData(url, resolve, options, reject, onCancel);
    })
      .then((resp) => {
        this._cleanActiveRequests(request);
        return resp;
      })
      .catch((httpError) => {
        this._cleanActiveRequests(request);
        if (httpError instanceof CancelablePromise.CancelError) {
          // not need to handle cancel error because onCancel method is used
        } else {
          if (__DEV__) {
            console.warn('DEV WARN', httpError);
          }
          const er = this._handleHttpError(httpError);
          if (er) {
            throw er;
          }
        }
      });
    if (
      options.signal &&
      typeof options.signal.addEventListener === 'function'
    ) {
      options.signal.addEventListener('abort', () => {
        request.cancel();
        this._cleanActiveRequests(request);
      });
    }
    this.activeRequests.push(request);
    return request;
  }

  private _login(
    credentials: Credentials,
    options?: RequestOptions,
  ): CancelablePromise<UserInfo> {
    return this.getUserInfo(credentials, options)
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

  private _cleanActiveRequests(request: CancelablePromise) {
    const activeRequestIndex = this.activeRequests.indexOf(request);
    if (activeRequestIndex !== -1) {
      this.activeRequests.splice(activeRequestIndex, 1);
    }
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
