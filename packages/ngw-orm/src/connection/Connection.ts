import NgwConnector, { ResourceItem } from '@nextgis/ngw-connector';
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

  async getOrCreateResource(
    resource: typeof BaseResource,
    options: SyncOptions
  ): Promise<typeof BaseResource | undefined> {
    return this.createResource(resource, options, true);
  }

  async createResource(
    resource: typeof BaseResource,
    options: SyncOptions,
    getExisted = false
  ): Promise<typeof BaseResource | undefined> {
    if (resource.item) {
      return resource;
    }
    const parent = await this.driver.getResource(options.parent);
    if (parent) {
      const payload = this.getResourceNgwPayload(
        resource,
        parent.resource.id,
        options
      );
      if (payload) {
        try {
          const item = await this.driver.post('resource.collection', {
            data: payload,
          });
          return resource.connect(item.id, this);
        } catch (er) {
          if (getExisted) {
            const exist = await this.getResource(options, payload);
            if (exist) {
              return resource.connect(exist.resource.id, this);
            }
          } else {
            throw er;
          }
        }
      }
    }
  }

  async getResource(
    options: SyncOptions,
    payload: DeepPartial<ResourceSyncItem>
  ): Promise<ResourceItem | undefined> {
    const resource = payload.resource;
    if (resource) {
      if (resource.keyname) {
        return this.driver.getResourceByKeyname(resource.keyname);
      } else if (options.parent && payload.resource?.display_name) {
        const children = await this.driver.getResourceChildren(options.parent);
        return children.find((x) => {
          return x.resource.display_name === resource.display_name;
        });
      }
    }
  }

  async deleteResource(resource: typeof BaseResource): Promise<void> {
    let id: number | undefined;
    if (resource.item) {
      id = resource.item.resource.id;
    }
    if (id) {
      await this.driver.deleteResource(id);
      delete resource.item;
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
          keyname: options.keyname || table.keyname || '',
          description: options.description || table.description || '',
        },
        resmeta: {
          items: {},
        },
      };
      const item = resource.getNgwPayload(resource, parent, options);
      if (item) {
        resourceItem[table.type] = item;
      }
      return resourceItem;
    }
  }
}
