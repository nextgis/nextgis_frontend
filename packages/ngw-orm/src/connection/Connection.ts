import NgwConnector, { CreatedResource } from '@nextgis/ngw-connector';
import { objectAssign, Type } from '@nextgis/utils';
import { ConnectionOptions } from './ConnectionOptions';
import { SyncOptions } from '../repository/SyncOptions';
import { BaseResource } from '../repository/BaseResource';
import { getMetadataArgsStorage } from '..';
import { ResourceMetadataArgs } from '../metadata-args/ResourceMetadataArgs';
import { DeepPartial } from '../common/DeepPartial';
import { VectorLayer } from '../repository/VectorLayer';
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

  async syncResource(
    resource: Type<BaseResource>,
    options: SyncOptions
  ): Promise<CreatedResource | undefined> {
    const parent = await this.driver.getResource(options.parent);
    if (parent) {
      const metadata = this.getResourceMetadata(
        resource,
        parent.resource.id,
        options
      );
      if (metadata) {
        return await this.driver.post('resource.collection', {
          data: metadata,
        });
      }
    }
  }

  getResourceMetadata(
    resource: Type<BaseResource>,
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
      let item: Record<string, any> | undefined;
      if (resource instanceof VectorLayer) {
        item = VectorLayer.getMetadata(resource, parent, options);
      }
      if (item) {
        resourceItem[table.type] = item;
      }
      return resourceItem;
    }
  }
}
