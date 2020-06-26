import NgwConnector, {
  ResourceItem,
  Resource,
  ResourceDefinition,
} from '@nextgis/ngw-connector';
import { objectAssign } from '@nextgis/utils';
import { ConnectionOptions } from './ConnectionOptions';
import { SyncOptions } from '../repository/SyncOptions';
import { BaseResource } from '../repository/BaseResource';
import { getMetadataArgsStorage } from '..';
import { ResourceMetadataArgs } from '../metadata-args/ResourceMetadataArgs';
import { DeepPartial } from '../common/DeepPartial';
import { ResourceSyncItem } from '../sync-items/ResourceSyncItem';

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
        if (options.auth?.login) {
          return connection.options.auth?.login === options.auth.login;
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

  async connect(): Promise<this> {
    // connect to the database via its driver
    await this.driver.connect();
    // set connected status for the current connection
    objectAssign(this, { isConnected: true });
    return this;
  }

  async getOrCreateResource<
    T extends typeof BaseResource = typeof BaseResource
  >(Resource: T, options: SyncOptions): Promise<T | undefined> {
    return this.createResource(Resource, options, true);
  }

  async createResource<T extends typeof BaseResource = typeof BaseResource>(
    Resource: T,
    options: SyncOptions,
    getExisted = false
  ): Promise<T | undefined> {
    if (Resource.item && Resource.connection) {
      return Resource;
    }
    let parent: ResourceDefinition | undefined;
    if (typeof options.parent === 'function') {
      parent = options.parent.item?.resource.id;
    } else {
      parent = options.parent;
    }
    if (!parent) {
      throw Error('parent resource is not defined');
    }
    const parentResource = await this.driver.getResource(parent);
    if (parentResource) {
      const payload = this.getResourceNgwPayload(
        Resource,
        parentResource.resource.id,
        options
      );
      if (payload) {
        if (getExisted && payload.resource) {
          try {
            const exist = await this.getResource(payload.resource);
            if (exist) {
              return Resource.connect<T>(exist.resource.id, this);
            }
          } catch {
            //
          }
        }
        try {
          const item = await this.driver.post('resource.collection', {
            data: payload,
          });
          return Resource.connect<T>(item.id, this);
        } catch (er) {
          throw er;
        }
      }
    }
  }

  async getResource(
    resource: ResourceDefinition | DeepPartial<Resource>
  ): Promise<ResourceItem | undefined> {
    return this.driver.getResource(resource);
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
    options: SyncOptions
  ): DeepPartial<ResourceSyncItem> | undefined {
    const table = getMetadataArgsStorage().filterTables(
      resource
    )[0] as ResourceMetadataArgs;
    if (table) {
      const resourceItem: DeepPartial<ResourceSyncItem> = {
        resource: {
          cls: table.type,
          parent: {
            id: parent,
          },
          display_name: options.display_name || table.display_name,
        },
        resmeta: {
          items: {},
        },
      };
      if (resourceItem.resource) {
        const keyname = options.keyname || table.keyname;
        const description = options.description || table.description;
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
}
