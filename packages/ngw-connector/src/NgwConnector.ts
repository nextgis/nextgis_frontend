import { EventEmitter } from 'events';

import Cache from '@nextgis/cache';
import { objectRemoveEmpty } from '@nextgis/utils';
import { fixUrlStr } from '@nextgis/utils';

import pkg from '../package.json';

import {
  addConnector,
  findConnector,
  removeConnector,
} from './activeConnectors';
import * as errors from './errors';
import { AbortError } from './errors/AbortError';
import { InsufficientPermissionsError } from './errors/InsufficientPermissionsError';
import { route } from './route/route';
import { loadData } from './utils/loadData';
import { template } from './utils/template';

import type {
  Credentials,
  NgwConnectorOptions,
  Params,
  PyramidRoute,
  RequestHeaders,
  RequestOptions,
  RequestTransformFunction,
  UserInfo,
} from './interfaces';
import type { RouteName, RouteParameters } from './route/type';

let ID = 0;
let REQUEST_ID = 0;

export class NgwConnector {
  static errors = errors;
  id = ID++;
  emitter = new EventEmitter();
  user?: UserInfo;

  cache: Cache;
  withCredentials?: boolean = undefined;

  private client = `NextGIS-NGW-Connector/${pkg.version}`;
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
      addConnector(this);
    }
  }

  /**
   * Clear the cache.
   */
  clearCache(): void {
    this.cache.clean();
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
   * const connector = new NgwConnector({ baseUrl: 'https://demo.nextgis.com' });
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
    const routeUrl = `${this.routeStr}?client=${this.client}`;
    return await this.makeQuery<PyramidRoute>(
      routeUrl,
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
      cache: true,
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
  getAuthorizationHeaders(credentials?: Credentials): RequestHeaders {
    const client = this.makeClientId(credentials);
    if (client) {
      return {
        Authorization: `Basic ${client}`,
      };
    }
    return {};
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
    for (const abortController of Object.values(this.activeRequests)) {
      abortController.abort();
    }
    this.activeRequests = {};
  }

  getActiveApiRequests() {
    return { ...this.activeRequests };
  }

  route<N extends RouteName>(name: N, ...rest: RouteParameters[N]) {
    return route(name, this, ...rest);
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

    if (method === 'GET') {
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
      return this.cache.add(cacheName || url, createPromise, {
        props: cacheOptions,
        expirationTime: cache ? undefined : 500,
      });
    }

    return createPromise();
  }

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
      if (er instanceof errors.NgwError) {
        if (er.exception === 'nextgisweb.resource.exception.ResourceNotFound') {
          throw new errors.ResourceNotFoundError(er);
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
