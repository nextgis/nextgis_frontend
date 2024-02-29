// import { DeepPartial } from '../common/DeepPartial';

import { getMetadataArgsStorage } from '..';
import { Connection } from '../connection/Connection';
import { NgwResource } from '../decorator/NgwResource';
import { CannotExecuteResourceNotExistError } from '../error/CannotExecuteResourceNotExistError';

import type { SyncOptions } from './SyncOptions';
import type { ConnectionOptions } from '../connection/ConnectionOptions';
import type { ResourceMetadataArgs } from '../metadata-args/ResourceMetadataArgs';
import type { NgwResourceOptions } from '../options/NgwResourceOptions';
import type {
  ToTypescript,
  ToTypescriptOptions,
} from '../options/ToTypescriptOptions';
import type { ValidateErrorType } from '../types/ValidateErrorType';
import type {
  ResourceIdKeynameDef,
  ResourceItem,
} from '@nextgis/ngw-connector';
import type { Type } from '@nextgis/utils';

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

  static receive(
    item: ResourceItem,
    ResCls?: typeof BaseResource,
  ): typeof BaseResource {
    ResCls = ResCls ?? this;
    const options: NgwResourceOptions = {
      display_name: item.resource.display_name,
      type: item.resource.cls,
    };
    const decorator = NgwResource({ ...options });
    const ReceivedResource = decorator(class extends ResCls {});
    ReceivedResource.item = item;
    return ReceivedResource;
  }

  static validate(): ValidateErrorType[] {
    return [];
  }

  static clone<T extends typeof BaseResource = typeof BaseResource>(
    options: Partial<NgwResourceOptions> = {},
  ): T {
    const metadataArgsStorage = getMetadataArgsStorage();
    const table = metadataArgsStorage.filterTables(
      this,
    )[0] as ResourceMetadataArgs;
    const tableOptions = { ...table };
    // keyname is unique resource property
    delete tableOptions.keyname;
    delete tableOptions.target;

    const decorator = NgwResource({ ...tableOptions, ...options });
    const ResourceClone = decorator(class extends this {});
    ResourceClone.connection = undefined;
    ResourceClone.item = undefined;

    metadataArgsStorage.filterColumns(this).forEach((x) => {
      metadataArgsStorage.columns.push({ ...x, target: ResourceClone });
    });

    return ResourceClone;
  }

  static getNgwPayload(
    resource: Type<BaseResource>,
    parent: number,
    options: SyncOptions,
  ): Record<string, any> | undefined {
    return undefined;
  }

  static async connect<T extends typeof BaseResource = typeof BaseResource>(
    resourceOptions: ResourceIdKeynameDef,
    connectionOrOptions: Connection | ConnectionOptions,
  ): Promise<T> {
    const connection = Connection.create(connectionOrOptions);
    await connection.connect();
    const item = await connection.driver.getResource(resourceOptions);
    if (item) {
      this.connection = connection;
      this.item = item;
      return this as T;
    } else {
      throw new CannotExecuteResourceNotExistError(resourceOptions, connection);
    }
  }

  static sync(
    options: SyncOptions,
    connectionOrOptions: Connection | ConnectionOptions,
  ): void {
    console.log('upload');
  }

  static toTypescript(opt?: ToTypescriptOptions): ToTypescript {
    throw Error(
      'TypeScript code generation is not implement for this resource',
    );
  }
}
