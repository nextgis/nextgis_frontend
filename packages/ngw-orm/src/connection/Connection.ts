import NgwConnector, {
  ResourceItem,
  Resource,
  ResourceDefinition,
} from '@nextgis/ngw-connector';
import { objectAssign, defined } from '@nextgis/utils';
import { ConnectionOptions } from './ConnectionOptions';
import { SyncOptions } from '../repository/SyncOptions';
import { BaseResource } from '../repository/BaseResource';
import { getMetadataArgsStorage } from '..';
import { ResourceMetadataArgs } from '../metadata-args/ResourceMetadataArgs';
import { DeepPartial } from '../common/DeepPartial';
import { ResourceSyncItem } from '../sync-items/ResourceSyncItem';
import { NgwResources } from '../ngw/NgwResources';

/**
 * Connection is a single NGW connection.
 * You can have multiple connections to multiple NGW in your application.
 */
export class Connection {
  static connections: Connection[] = [];

  /**
   * Connection url.
   */
  readonly baseUrl: string;

  /**
   * Connection options.
   */
  readonly options: ConnectionOptions;

  /**
   * Indicates if connection is initialized or not.
   */
  readonly isConnected: boolean;

  /**
   * NGW driver used by this connection.
   */
  readonly driver: NgwConnector;

  constructor(options: ConnectionOptions) {
    this.baseUrl = options.baseUrl || '';
    this.options = options;
    this.driver = new NgwConnector(this.options);
    this.isConnected = false;
    Connection.connections.push(this);
  }

  static create(options: Connection | ConnectionOptions): Connection {
    if (options instanceof Connection) {
      return options;
    }
    const exist = Connection.connections.find((connection) => {
      const eqUrl = connection.baseUrl === options.baseUrl;
      if (eqUrl) {
        if (options.auth && options.auth.login && connection.options.auth) {
          return connection.options.auth.login === options.auth.login;
        }
        return true;
      }
      return false;
    });
    if (exist) {
      return exist;
    }
    return new Connection(options);
  }

  static connect(options: Connection | ConnectionOptions): Promise<Connection> {
    const connection = Connection.create(options);
    return connection.connect();
  }

  async receiveResource<P extends Record<string, any> = any>(
    resource: ResourceDefinition,
  ): Promise<typeof BaseResource & P> {
    const res = await this.getResourceItem(resource);
    if (res) {
      const ResourceClass = NgwResources.getResource(res);
      const ReceivedResource = ResourceClass.receive(res);
      ReceivedResource.connection = this;
      return ReceivedResource as typeof BaseResource & P;
    }
    throw Error(`Can't receive resource from NGW`);
  }

  async connect(): Promise<this> {
    // connect to the database via its driver
    await this.driver.connect();
    // set connected status for the current connection
    objectAssign(this, { isConnected: true });
    return this;
  }

  async getOrCreateResource<P extends typeof BaseResource>(
    Resource: P,
    options: SyncOptions,
  ): Promise<[P, boolean]> {
    const [resource, isCreated] = await this._getOrCreateResource(
      Resource,
      options,
      true,
    );
    return [resource as P, isCreated];
  }

  async createResource(
    Resource: typeof BaseResource,
    options: SyncOptions,
  ): Promise<typeof BaseResource> {
    const [resource] = await this._getOrCreateResource(Resource, options);
    return resource;
  }

  async updateResource(Resource: typeof BaseResource): Promise<void> {
    const item = Resource.item;
    if (item && item.resource) {
      const payload = this.getResourceNgwPayload(
        Resource,
        item.resource.parent.id,
      );
      delete payload?.resource?.cls;

      // console.log(JSON.stringify(payload, null, ' '));
      await this.driver.put(
        'resource.item',
        {
          data: payload,
        },
        { id: item.resource.id },
      );
    }
  }

  async getResourceItem(
    resource: ResourceDefinition | DeepPartial<Resource>,
  ): Promise<ResourceItem | undefined> {
    return this.driver.getResource(resource);
  }

  /**
   * @deprecated use getResourceItem instead
   */
  async getResource(
    resource: ResourceDefinition | DeepPartial<Resource>,
  ): Promise<ResourceItem | undefined> {
    try {
      return this.getResourceItem(resource);
    } catch {
      return undefined;
    }
  }

  async deleteResource(resource: typeof BaseResource): Promise<void> {
    let id: number | undefined;
    if (resource.item) {
      id = resource.item.resource.id;
    }
    if (id) {
      await this.driver.deleteResource(id);
      resource.item = undefined;
    }
  }

  getResourceNgwPayload(
    resource: typeof BaseResource,
    parent: number,
    opt: Partial<SyncOptions> = {},
  ): DeepPartial<ResourceSyncItem> | undefined {
    const table = getMetadataArgsStorage().filterTables(
      resource,
    )[0] as ResourceMetadataArgs;
    if (table) {
      const options = { ...table, ...opt } as SyncOptions;
      const resourceItem: DeepPartial<ResourceSyncItem> = {
        resource: {
          cls: table.type,
          parent: {
            id: parent,
          },
          display_name: options.display_name,
        },
        resmeta: {
          items: {},
        },
      };
      if (resourceItem.resource) {
        const keyname = options.keyname;
        const description = options.description;
        if (keyname) {
          resourceItem.resource.keyname = keyname;
        }
        if (description) {
          resourceItem.resource.description = description;
        }
      }
      const item = resource.getNgwPayload(resource, parent, options);
      if (item) {
        Object.assign(resourceItem, item);
      }
      return resourceItem;
    }
  }

  private async _getOrCreateResource(
    resource: typeof BaseResource,
    options: SyncOptions,
    getExisted = false,
  ): Promise<[typeof BaseResource, boolean]> {
    let isCreated = false;
    if (resource.item && resource.connection) {
      return [resource, isCreated];
    }
    let parent: ResourceDefinition | undefined;
    if (typeof options.parent === 'function') {
      parent = options.parent.item?.resource.id;
    } else {
      parent = options.parent;
    }
    if (!defined(parent)) {
      throw Error('parent resource is not defined');
    }
    const parentResource = await this.driver.getResource(parent);
    if (!parentResource) {
      throw Error('parent resource is not exist');
    }
    const payload = this.getResourceNgwPayload(
      resource,
      parentResource.resource.id,
      options,
    );
    if (!payload) {
      throw Error('resource is not serializable');
    }
    let res;
    if (getExisted && payload.resource) {
      try {
        const exist = await this.getResourceItem(payload.resource);
        if (exist) {
          res = await resource.connect(exist.resource.id, this);
        }
      } catch (er) {
        console.log(er);
      }
    }
    if (!res) {
      const item = await this.driver.post('resource.collection', {
        data: payload,
      });
      res = await resource.connect(item.id, this);
      isCreated = true;
    }
    return [res, isCreated];
  }
}
