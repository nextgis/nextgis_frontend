import { objectRemoveEmpty } from '@nextgis/utils';

import { NgwConnector } from './NgwConnector';
import { ResourcesControl } from './ResourcesControl';
import { apiRequest } from './utils/apiRequest';

import type {
  DeleteRequestItemsResponseMap,
  GetChildrenOfOptions,
  GetRequestItemsResponseMap,
  NgwConnectorOptions,
  PatchRequestItemsResponseMap,
  PostRequestItemsResponseMap,
  PutRequestItemsResponseMap,
  RequestItemKeys,
  RequestItemsParams,
  RequestOptions,
  ResourceDefinition,
  ResourceIdKeynameDef,
} from './interfaces';
import type { RequestItemsParamsMap } from './types/RequestItemsParamsMap';
import type { Resource, ResourceItem } from './types/ResourceItem';
import type { DeepPartial } from '@nextgis/utils';

export class NgwConnectorExtended extends NgwConnector {
  resources!: ResourcesControl;

  constructor(options: NgwConnectorOptions) {
    super(options);
    this.resources = new ResourcesControl({
      connector: this,
      cacheId: options.cacheId,
    });
  }

  static create(options: NgwConnectorOptions): NgwConnectorExtended {
    return new this(options);
  }

  /**
   * Clear the cache.
   */
  clearCache(): void {
    super.clearCache();
    this.resources.cache.clean();
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
}
