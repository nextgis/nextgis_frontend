import NgwConnector, { CreatedResource } from '@nextgis/ngw-connector';
import { objectAssign, Type } from '@nextgis/utils';
import { ConnectionOptions } from './ConnectionOptions';
import { SyncOptions } from '../repository/SyncOptions';
import { BaseResource } from '../repository/BaseResource';
import { getMetadataArgsStorage } from '..';
import { VectorLayerMetadataArgs } from '../metadata-args/VectorLayerMetadataArgs';
import { DeepPartial } from '../common/DeepPartial';
import { VectorResourceSyncItem } from './VectorResourceSyncItem';

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
  ): DeepPartial<VectorResourceSyncItem> | undefined {
    const table = getMetadataArgsStorage().filterTables(
      resource
    )[0] as VectorLayerMetadataArgs;
    const fields = getMetadataArgsStorage().filterColumns(resource);
    if (table) {
      return {
        resource: {
          cls: 'vector_layer',
          parent: {
            id: parent,
          },
          display_name: options.display_name || table.display_name,
          keyname: options.keyname || table.keyname,
          description: options.description || table.description || null,
        },
        resmeta: {
          items: {},
        },
        vector_layer: {
          srs: { id: 3857 },
          geometry_type: table.geometry_type,
          fields: fields.map((x) => ({
            keyname: x.propertyName,
            datatype: x.options.datatype,
            grid_visibility: x.options.grid_visibility,
            label_field: x.options.label_field,
            display_name: x.options.display_name,
          })),
        },
      };
    }
    return;
  }
}
