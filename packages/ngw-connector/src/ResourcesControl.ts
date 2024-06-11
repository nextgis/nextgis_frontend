import Cache from '@nextgis/cache';
import { defined } from '@nextgis/utils';

import { ResourceNotFoundError } from './errors/ResourceNotFoundError';
import { isObject } from './utils/isObject';
import { resourceCompare } from './utils/resourceCompare';
import { resourceToQuery } from './utils/resourceToQuery';

import type { NgwConnector } from './NgwConnector';
import type {
  GetChildrenOfOptions,
  RequestOptions,
  ResourceDefinition,
} from './interfaces';
import type { Resource, ResourceItem } from './types/ResourceItem';
import type { DeepPartial } from '@nextgis/utils';

export class ResourcesControl {
  cache: Cache<
    Promise<ResourceItem | undefined>,
    { id?: number | string }
  >;
  connector: NgwConnector;

  constructor({
    connector,
    cacheId,
  }: {
    connector: NgwConnector;
    cacheId?: string;
  }) {
    this.connector = connector;
    this.cache = new Cache({ namespace: cacheId });
  }

  // -------------------------------------------------------------------------
  // Resource Methods
  // -------------------------------------------------------------------------

  /**
   * Receive resource from NGW by id, keyname or search-object parameter.
   * @param resource - Resource id, keyname or search-object
   *
   * @remarks
   * Fetching resource would be cached to speed up next call
   */
  getOne(
    resource: ResourceDefinition,
    requestOptions?: RequestOptions<'GET'>,
  ): Promise<ResourceItem | undefined> {
    const cache = this.cache;
    const forCache: { keyname?: string; display_name?: string; id?: number } =
      {};
    const opt = { ...requestOptions, cache: false };
    if (typeof resource === 'string') {
      forCache.keyname = resource;
    } else if (typeof resource === 'number') {
      forCache.id = resource;
    } else if (isObject(resource)) {
      if (resource.id !== undefined) {
        forCache.id = resource.id;
      } else {
        if (resource.keyname) {
          forCache.keyname = resource.keyname;
        }
        if (resource.display_name) {
          forCache.display_name = resource.display_name;
        }
      }
    }
    const makeRequest = () => {
      if (typeof resource === 'string') {
        return this._fetchResourceBy({ keyname: resource }, opt);
      } else if (typeof resource === 'number') {
        return this._fetchResourceById(resource, opt);
      } else if (isObject(resource)) {
        return this._fetchResourceBy(resource, opt);
      }
      return Promise.resolve(undefined);
    };
    if (requestOptions?.cache) {
      return cache.addFull('resource', makeRequest, forCache);
    }
    return makeRequest();
  }

  getOneOrFail(
    resource: ResourceDefinition,
    requestOptions?: RequestOptions<'GET'>,
  ): Promise<ResourceItem> {
    return this.getOne(resource, requestOptions).then((res) => {
      if (res) {
        return res;
      }
      throw new ResourceNotFoundError();
    });
  }

  /**
   * A fast way to retrieve resource ID for any resource definition.
   * @param resource - Any available resource definition
   *
   * @remarks
   * There are situations when exactly the resource id is needed
   * (for example, to compose the correct request to the api)
   * then this method will come in handy to facilitate the extraction of the identifier
   * if the resource is specified through a keyname or other parameters.
   */
  getId(
    resource: ResourceDefinition,
    requestOptions?: RequestOptions<'GET'>,
  ): Promise<number | undefined> {
    if (typeof resource === 'number') {
      return Promise.resolve(resource);
    } else if (typeof resource === 'string' || isObject(resource)) {
      return this.getOne(resource, requestOptions).then((res) => {
        if (res) {
          return res.resource.id;
        }
      });
    }
    return Promise.resolve(undefined);
  }

  /**
   * A fast way to retrieve resource ID for any resource definition.
   * @param resource - Any available resource definition
   *
   * @remarks
   * Similar with {@link NgwConnector.getResourceId | getResourceId} but rise error if resource is not exist.
   * To not make one more checks if the resource is definitely exists
   */
  getIdOrFail(
    resource: ResourceDefinition,
    requestOptions?: RequestOptions<'GET'>,
  ): Promise<number> {
    return this.getId(resource, requestOptions).then((resp) => {
      if (resp === undefined) {
        throw new Error();
      }
      return resp;
    });
  }

  getMany(
    resource: DeepPartial<Resource>,
    requestOptions?: RequestOptions<'GET'>,
  ): Promise<ResourceItem[]> {
    return this._resourceCacheFilter(resource).then((items) => {
      if (!items.length) {
        const query: Record<string, unknown> = {};
        if (resource.keyname) {
          query.keyname = resource.keyname;
        } else {
          Object.assign(query, resourceToQuery(resource));
        }
        return this.connector
          .get('resource.search', requestOptions, {
            serialization: 'full',
            ...query,
          })
          .then((resources) => {
            if (resources) {
              for (const x of resources) {
                this.cache.add('resource.item', Promise.resolve(x), {
                  id: x.resource.id,
                });
              }
            }
            return resources;
          });
      }
      return items;
    });
  }

  getParent(
    resource: ResourceDefinition,
    requestOptions?: RequestOptions<'GET'>,
  ): Promise<ResourceItem | undefined> {
    return this.getOne(resource, requestOptions).then((child) => {
      if (child) {
        return this.getOne(child.resource.parent.id, requestOptions);
      }
      return Promise.resolve(undefined);
    });
  }

  getChildrenOf(
    resource: ResourceDefinition,
    requestOptions?: GetChildrenOfOptions,
  ): Promise<ResourceItem[]> {
    return this.getIdOrFail(resource).then((parent) =>
      this._getChildrenOf(parent, requestOptions),
    );
  }

  update(
    resource: ResourceDefinition,
    data: DeepPartial<ResourceItem>,
  ): Promise<ResourceItem | undefined> {
    return this.getId(resource).then((id) => {
      if (id !== undefined) {
        return this.connector.put('resource.item', { data }, { id });
      }
    });
  }

  /**
   * Fast way to delete resource from NGW and clean cache.
   * @param resource - Resource definition
   */
  delete(resource: ResourceDefinition): Promise<void> {
    return this.getId(resource).then((id) => {
      if (id !== undefined) {
        return this.connector.delete('resource.item', null, { id }).then(() => {
          this._cleanResourceItemCache(id);
          return undefined;
        });
      }
    });
  }

  private _getChildrenOf(
    parent: ResourceDefinition,
    requestOptions?: GetChildrenOfOptions,
    _items: ResourceItem[] = [],
  ): Promise<ResourceItem[]> {
    return this.connector
      .get(
        'resource.collection',
        { cache: true, ...requestOptions },
        {
          parent,
        },
      )
      .then((items) => {
        const recursivePromises = [];
        for (const item of items) {
          this.cache.add('resource.item', Promise.resolve(item), {
            id: item.resource.id,
          });
          _items.push(item);
          if (requestOptions?.recursive && item.resource.children) {
            recursivePromises.push(
              this._getChildrenOf(item.resource.id, requestOptions, _items),
            );
          }
        }
        if (recursivePromises.length) {
          return Promise.all(recursivePromises).then(() => {
            return _items;
          });
        }
        return _items;
      });
  }

  private async _cleanResourceItemCache(id: number) {
    const all = this.cache.all();
    const toDelete: typeof all = [];
    for (const c of all) {
      const cid = c.options && c.options.id;
      if (['resource.item', 'resource'].includes(c.key) && cid !== undefined) {
        if (typeof cid === 'number') {
          if (cid === id) {
            toDelete.push(c);
          }
        } else {
          const rid = await this.getId(cid);
          if (rid === id) {
            toDelete.push(c);
          }
        }
      }
    }
    for (const d of toDelete) {
      this.cache.delete(d);
    }
  }

  private _fetchResourceById(
    id: number,
    requestOptions?: RequestOptions<'GET'>,
  ): Promise<ResourceItem | undefined> {
    const promise = () =>
      this.connector.get('resource.item', requestOptions, { id });
    if (requestOptions?.cache) {
      return this.cache
        .add('resource.item', promise, {
          id,
        })
        .catch((er) => {
          if (!(er instanceof ResourceNotFoundError)) {
            throw er;
          }
          return undefined;
        });
    }
    return promise();
  }

  private _fetchResourceBy(
    resource: DeepPartial<Resource>,
    requestOptions?: RequestOptions<'GET'>,
  ): Promise<ResourceItem | undefined> {
    return this.getMany(resource, requestOptions).then((resources) => {
      return resources[0];
    });
  }

  private _resourceCacheFilter(
    resource: DeepPartial<Resource>,
  ): Promise<ResourceItem[]> {
    return Promise.all(this.cache.matchAll('resource.item')).then(
      (resources) => {
        const items: ResourceItem[] = [];
        resources.filter((x) => {
          if (x) {
            // identical by uniq props
            if (resource.keyname && x.resource.keyname) {
              return resource.keyname === x.resource.keyname;
            }
            if (defined(resource.id) && defined(x.resource.id)) {
              return resource.id === x.resource.id;
            }
            return resourceCompare(resource, x.resource);
          }
        });
        return items;
      },
    );
  }
}
