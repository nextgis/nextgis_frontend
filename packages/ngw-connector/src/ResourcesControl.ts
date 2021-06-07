import CancelablePromise from '@nextgis/cancelable-promise';
import { defined } from '@nextgis/utils';

import { resourceToQuery } from './utils/resourceToQuery';
import { resourceCompare } from './utils/resourceCompare';
import { ResourceNotFoundError } from './errors/ResourceNotFoundError';

import { isObject } from './utils/isObject';

import type { DeepPartial } from '@nextgis/utils';
import type { NgwConnector } from './NgwConnector';
import type { ResourceItem, Resource } from './types/ResourceItem';
import type { RequestOptions, ResourceIdKeynameDef } from './interfaces';

const promiseControl = new CancelablePromise.PromiseControl();

export class ResourcesControl {
  private _resourcesCache: Record<number, ResourceItem> = {};

  constructor(private connector: NgwConnector) {}

  // -------------------------------------------------------------------------
  // Resource Methods
  // -------------------------------------------------------------------------

  /**
   * Receive resource from NGW by id, keyname or serch-object parameter.
   * @param resource - Resource id, keyname or search-object
   *
   * @remarks
   * Fetching resource would be cached to speed up next call
   */
  getOne(
    resource: ResourceIdKeynameDef | DeepPartial<Resource>,
    requestOptions?: RequestOptions,
  ): CancelablePromise<ResourceItem | undefined> {
    return promiseControl.waitFunc(() => {
      if (typeof resource === 'string') {
        return this._fetchResourceBy({ keyname: resource }, requestOptions);
      } else if (typeof resource === 'number') {
        return this._fetchResourceById(resource, requestOptions);
      } else if (isObject(resource)) {
        return this._fetchResourceBy(resource, requestOptions);
      }
      return CancelablePromise.resolve(undefined);
    }, String(resource));
  }

  getOneOrFail(
    resource: ResourceIdKeynameDef | DeepPartial<Resource>,
  ): CancelablePromise<ResourceItem> {
    return this.getOne(resource).then((res) => {
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
    resource: ResourceIdKeynameDef | DeepPartial<Resource>,
  ): CancelablePromise<number | undefined> {
    if (typeof resource === 'number') {
      return CancelablePromise.resolve(resource);
    } else if (typeof resource === 'string' || isObject(resource)) {
      return this.getOne(resource).then((res) => {
        if (res) {
          return res.resource.id;
        }
      });
    }
    return CancelablePromise.resolve(undefined);
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
    resource: ResourceIdKeynameDef | DeepPartial<Resource>,
  ): CancelablePromise<number> {
    return this.getId(resource).then((resp) => {
      if (resp === undefined) {
        throw new Error();
      }
      return resp;
    });
  }

  getMany(
    resource: DeepPartial<Resource>,
    requestOptions?: RequestOptions,
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
      return this.connector
        .get('resource.search', requestOptions, {
          serialization: 'full',
          ...query,
        })
        .then((resources) => {
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

  getChildrenOf(
    optOrResource:
      | string
      | number
      | {
          keyname?: string;
          resourceId?: number;
          resource?: string | number;
        },
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
    if (!opt.keyname && !defined(opt.resourceId) && !opt.resource) {
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
      this.connector.get('resource.collection', null, {
        parent,
      });
    if (keyname) {
      return this._fetchResourceBy({ keyname }).then((item) => {
        if (item) {
          parent = item.resource.id;
        }
        return collection();
      });
    }
    return collection();
  }

  update(
    resource: ResourceIdKeynameDef,
    data: DeepPartial<ResourceItem>,
  ): CancelablePromise<ResourceItem | undefined> {
    return this.getId(resource).then((id) => {
      if (id !== undefined) {
        return this.connector
          .put('resource.item', { data }, { id })
          .then((res) => {
            this._resourcesCache[id] = res;
            return res as ResourceItem;
          });
      }
    });
  }

  /**
   * Fast way to delete resource from NGW and clean cache.
   * @param resource - Resource definition
   */
  delete(resource: ResourceIdKeynameDef): CancelablePromise<void> {
    return this.getId(resource).then((id) => {
      if (id !== undefined) {
        return this.connector.delete('resource.item', null, { id }).then(() => {
          delete this._resourcesCache[id];
          return undefined;
        });
      }
    });
  }

  private _fetchResourceById(
    id: number,
    requestOptions?: RequestOptions,
  ): CancelablePromise<ResourceItem | undefined> {
    const item: ResourceItem = this._resourcesCache[id];
    if (!item) {
      return this.connector
        .get('resource.item', requestOptions, { id })
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

  private _fetchResourceBy(
    resource: DeepPartial<Resource>,
    requestOptions?: RequestOptions,
  ): CancelablePromise<ResourceItem | undefined> {
    return this.getMany(resource, requestOptions).then((resources) => {
      return resources[0];
    });
  }

  private _resourceCacheFilter(
    resource: DeepPartial<Resource>,
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
      },
    );
    return items;
  }
}
