import { EventEmitter } from 'events';

import Cache from '@nextgis/cache';
import { objectRemoveEmpty } from '@nextgis/utils';
import { fixUrlStr } from '@nextgis/utils';

import { ResourcesControl } from './ResourcesControl';
import {
  addConnector,
  findConnector,
  removeConnector,
} from './activeConnectors';
import { AbortError } from './errors/AbortError';
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
let REQUEST_ID = 0;

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
  private routeStr = '/api/component/pyramid/route';
  private activeRequests: {
    [requestId: number]: AbortController;
  } = {};
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
  async connect(): Promise<PyramidRoute> {
    const auth = this.options.auth;

    if (auth) {
      const { login, password } = auth;
      if (login && password) {
        await this._login({ login, password });
      }
    }
    return await this.makeQuery<PyramidRoute>(
      this.routeStr,
      {},
      {
        cacheName: 'route',
        cache: true,
        cacheProps: {
          id: this.id,
          auth,
          baseUrl: this.options.baseUrl,
        },
      },
    );
  }

  /**
   * Quick way to change NextGIS Web user.
   * @param credentials - New user credentials
   */
  login(credentials: Credentials, options?: RequestOptions): Promise<UserInfo> {
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

  async getUserInfo(
    credentials?: Credentials,
    options?: RequestOptions,
  ): Promise<UserInfo> {
    if (this.user && this.user.id) {
      return this.user;
    }
    if (credentials) {
      this.options.auth = credentials;
    }
    const options_: RequestOptions = {
      headers: this.getAuthorizationHeaders(credentials),
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
        Authorization: `Basic ${client}`,
      };
    }
  }

  makeClientId(credentials?: Credentials): string | undefined {
    credentials = credentials || this.options.auth;
    if (credentials) {
      const { login, password } = credentials;
      const str = `${login}:${password}`;
      const encodedStr = encodeURIComponent(str);

      if (__BROWSER__) {
        return window.btoa(encodedStr);
      } else {
        return Buffer.from(encodedStr).toString('base64');
      }
    }
  }

  /** Stop all api requests */
  abort() {
    for (const abortController of Object.values(this.activeRequests)) {
      abortController.abort();
    }
    this.activeRequests = {};
  }

  getActiveApiRequests() {
    return { ...this.activeRequests };
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
  ): Promise<P[K]> {
    params_ = requestOptions.params ?? params_;
    const params = objectRemoveEmpty(params_);
    return apiRequest({ name, params, requestOptions, connector: this });
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
  ): Promise<PostRequestItemsResponseMap[K]> {
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
  ): Promise<GetRequestItemsResponseMap[K]> {
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
  ): Promise<PatchRequestItemsResponseMap[K]> {
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
  ): Promise<PutRequestItemsResponseMap[K]> {
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
  ): Promise<DeleteRequestItemsResponseMap[K]> {
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
  async makeQuery<R = unknown>(
    url: string,
    params?: Params | null,
    options: RequestOptions = {},
  ): Promise<R> {
    url = (this.options.baseUrl ? this.options.baseUrl : '') + url;
    if (!url) {
      throw new Error('Empty `url` not allowed');
    }

    if (params) {
      const { paramList, ...restParams } = params;
      url = template(url, restParams);
    }
    url = encodeURI(fixUrlStr(url));

    options = { withCredentials: this.withCredentials, ...options };

    const {
      cache,
      signal: externalSignal,
      method = 'GET',
      headers,
      cacheName,
      cacheProps,
      responseType,
      withCredentials,
    } = options;

    const internalAbortController = new AbortController();
    const internalSignal = internalAbortController.signal;

    // If the external signal aborts, also abort the internal signal
    if (externalSignal) {
      if (externalSignal.aborted) {
        throw new AbortError();
      }
      externalSignal.addEventListener('abort', () => {
        internalAbortController.abort();
      });
    }

    options.signal = internalSignal;

    const createPromise = async () => {
      const id = REQUEST_ID++;
      this.activeRequests[id] = internalAbortController;
      try {
        return this._loadData<R>(url, options);
      } finally {
        this._cleanActiveRequest(id);
      }
    };

    if (cache && method === 'GET') {
      const cacheOptions = cacheProps
        ? cacheProps
        : {
            ...objectRemoveEmpty({
              headers,
              withCredentials,
              responseType,
              baseUrl: this.options.baseUrl,
              userId: this.user?.id,
            }),
            params,
          };
      return this.cache.add(
        cacheName || url,
        createPromise,
        cacheOptions,
        false,
      );
    }

    return createPromise();
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
  ): Promise<ResourceItem | undefined> {
    return this.resources.getOne(resource, requestOptions);
  }

  /**
   * {@link ResourcesControl.getOneOrFail}
   */
  getResourceOrFail(
    resource: ResourceDefinition,
    requestOptions?: RequestOptions<'GET'>,
  ): Promise<ResourceItem> {
    return this.resources.getOneOrFail(resource, requestOptions);
  }

  /**
   * @deprecated - use {@link getResource}
   */
  getResourceBy(
    resource: DeepPartial<Resource>,
  ): Promise<ResourceItem | undefined> {
    return this.resources.getOne(resource);
  }

  /**
   * @deprecated - use {@link getResource}
   */
  getResourceByKeyname(keyname: string): Promise<ResourceItem | undefined> {
    return this.resources.getOne(keyname);
  }

  /**
   * @deprecated - use {@link getResource}
   */
  getResourceById(id: number): Promise<ResourceItem | undefined> {
    return this.resources.getOne(id);
  }

  /**
   * {@link ResourcesControl.getId}
   */
  getResourceId(
    resource: ResourceDefinition,
    requestOptions?: RequestOptions<'GET'>,
  ): Promise<number | undefined> {
    return this.resources.getId(resource, requestOptions);
  }

  /**
   * {@link ResourcesControl.getIdOrFail}
   */
  getResourceIdOrFail(
    resource: ResourceDefinition,
    requestOptions?: RequestOptions<'GET'>,
  ): Promise<number> {
    return this.resources.getIdOrFail(resource, requestOptions);
  }

  /**
   * {@link ResourcesControl.getMany}
   */
  getResourcesBy(
    resource: DeepPartial<Resource>,
    requestOptions?: RequestOptions<'GET'>,
  ): Promise<ResourceItem[]> {
    return this.resources.getMany(resource, requestOptions);
  }

  /**
   * {@link ResourcesControl.getParent}
   */
  getResourceParent(
    resource: ResourceDefinition,
    requestOptions?: RequestOptions<'GET'>,
  ): Promise<ResourceItem | undefined> {
    return this.resources.getParent(resource, requestOptions);
  }

  /**
   * {@link ResourcesControl.getChildrenOf}
   */
  getResourceChildren(
    resource: ResourceDefinition,
    requestOptions?: GetChildrenOfOptions,
  ): Promise<ResourceItem[]> {
    return this.resources.getChildrenOf(resource, requestOptions);
  }

  /**
   * {@link ResourcesControl.update}
   */
  updateResource(
    resource: ResourceIdKeynameDef,
    data: DeepPartial<ResourceItem>,
  ): Promise<ResourceItem | undefined> {
    return this.resources.update(resource, data);
  }

  /**
   * {@link ResourcesControl.delete}
   */
  deleteResource(resource: ResourceIdKeynameDef): Promise<void> {
    return this.resources.delete(resource);
  }

  /**
   * @internal
   */
  protected _loadData<R = unknown>(
    url: string,
    options: RequestOptions,
  ): Promise<R> {
    options.responseType = options.responseType || 'json';

    return new Promise<R>((resolve, reject) => {
      if (this.user) {
        options = options || {};
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

      let runOnAbort: (() => void) | undefined = undefined;

      loadData(url, resolve, options, reject, (handler: () => void) => {
        runOnAbort = handler;
      });

      options.signal?.addEventListener('abort', () => {
        if (runOnAbort !== undefined) {
          runOnAbort();
        }
        reject(new AbortError());
      });
    }).catch((httpError) => {
      if (httpError.name !== 'AbortError') {
        if (__DEV__) {
          console.warn('DEV WARN', httpError);
        }
        const er = this._handleHttpError(httpError);
        if (er) {
          throw er;
        }
      }
      throw httpError;
    });
  }

  private async _login(
    credentials: Credentials,
    options?: RequestOptions,
  ): Promise<UserInfo> {
    try {
      const data = await this.getUserInfo(credentials, options);
      this.user = data;
      this.emitter.emit('login', data);
      return data;
    } catch (er) {
      this.emitter.emit('login:error', er);
      throw er;
    }
  }

  private _cleanActiveRequest(requestId: number) {
    delete this.activeRequests[requestId];
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
