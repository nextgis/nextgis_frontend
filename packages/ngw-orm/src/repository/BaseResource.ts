import { ResourceDefinition, ResourceItem } from '@nextgis/ngw-connector';
import { Type } from '@nextgis/utils';

import { DeepPartial } from '../common/DeepPartial';

import { Connection } from '../connection/Connection';
import { ConnectionOptions } from '../connection/ConnectionOptions';
import { CannotExecuteResourceNotExistError } from '../error/CannotExecuteResourceNotExistError';
import { SyncOptions } from './SyncOptions';
import { BaseResourceSyncItem } from '../sync-items/BaseResourceSyncItem';

type QueryDeepPartialEntity<T> = DeepPartial<T>;
type InsertResult = any;
type DeleteResult = any;
type UpdateResult = any;

/**
 * Base abstract resource for all resources.
 */
export class BaseResource {
  private connection?: Connection;
  private resourceItem?: ResourceItem;

  static getMetadata(
    resource: Type<BaseResource>,
    parent: number,
    options: SyncOptions
  ): DeepPartial<BaseResourceSyncItem> | undefined {
    return {};
  }

  static async connect(
    resourceOptions: ResourceDefinition,
    connectionOrOptions: Connection | ConnectionOptions
  ): Promise<BaseResource> {
    const connection = Connection.create(connectionOrOptions);
    await connection.connect();
    const item = await connection.driver.getResource(resourceOptions);
    if (item) {
      const resource = new this();
      resource.useConnection(connection);
      resource.setResourceItem(item);
      return resource;
    } else {
      throw new CannotExecuteResourceNotExistError(resourceOptions, connection);
    }
  }

  static sync(
    options: SyncOptions,
    connectionOrOptions: Connection | ConnectionOptions
  ): void {
    console.log('upload');
  }

  useConnection(connection: Connection): void {
    this.connection = connection;
  }

  setResourceItem(item: ResourceItem): void {
    this.resourceItem = item;
  }
}
