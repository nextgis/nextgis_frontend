import { ResourceDefinition, ResourceItem } from '@nextgis/ngw-connector';
import { Type } from '@nextgis/utils';

// import { DeepPartial } from '../common/DeepPartial';

import { Connection } from '../connection/Connection';
import { ConnectionOptions } from '../connection/ConnectionOptions';
import { CannotExecuteResourceNotExistError } from '../error/CannotExecuteResourceNotExistError';
import { SyncOptions } from './SyncOptions';

// type QueryDeepPartialEntity<T> = DeepPartial<T>;
// type InsertResult = any;
// type DeleteResult = any;
// type UpdateResult = any;

// export interface BaseResourceStatic {
//   item?: ResourceItem;
//   connection?: Connection;
//   new (...args: any[]): BaseResourceInstant;

//   getMetadata(
//     resource: typeof BaseResource,
//     parent: number,
//     options: SyncOptions
//   ): Record<string, any> | undefined;

//   connect(
//     resourceOptions: ResourceDefinition,
//     connectionOrOptions: Connection | ConnectionOptions
//   ): Promise<typeof BaseResource>;

//   sync(
//     options: SyncOptions,
//     connectionOrOptions: Connection | ConnectionOptions
//   ): void;
// }

// export type BaseResourceInstant = Record<string, any>;

/**
 * Base abstract resource for all resources.
 */
export class BaseResource {
  static connection?: Connection;
  static item?: ResourceItem;

  static getNgwPayload(
    resource: Type<BaseResource>,
    parent: number,
    options: SyncOptions
  ): Record<string, any> | undefined {
    return undefined;
  }

  static async connect(
    resourceOptions: ResourceDefinition,
    connectionOrOptions: Connection | ConnectionOptions
  ): Promise<typeof BaseResource> {
    const connection = Connection.create(connectionOrOptions);
    await connection.connect();
    const item = await connection.driver.getResource(resourceOptions);
    if (item) {
      this.connection = connection;
      this.item = item;
      return this;
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
}
