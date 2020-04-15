import { ColumnType } from '../types/ColumnTypes';
import { ColumnOptions } from '../options/ColumnOptions';
import { ColumnTypeUndefinedError } from '../error/ColumnTypeUndefinedError';
import { getMetadataArgsStorage } from '../index';
import { ColumnMetadataArgs } from '../metadata-args/ColumnMetadataArgs';

/**
 * Column decorator is used to mark a specific class property as a table column. Only properties decorated with this
 * decorator will be persisted to the database when entity be saved.
 */
export function Column(): Function;

/**
 * Column decorator is used to mark a specific class property as a table column.
 * Only properties decorated with this decorator will be persisted to the database when entity be saved.
 */
export function Column(options: ColumnOptions): Function;

/**
 * Column decorator is used to mark a specific class property as a table column.
 * Only properties decorated with this decorator will be persisted to the database when entity be saved.
 */
export function Column(
  typeOrOptions?: ((type?: any) => Function) | ColumnType | ColumnOptions,
  options?: ColumnOptions
): Function {
  return function (object: Record<string, any>, propertyName: string) {
    // normalize parameters
    let type: ColumnType | undefined;
    if (
      typeof typeOrOptions === 'string' ||
      typeOrOptions instanceof Function
    ) {
      type = typeOrOptions as ColumnType;
    } else if (typeOrOptions) {
      options = typeOrOptions as ColumnOptions;
      type = typeOrOptions.datatype;
    }
    if (!options) options = {} as ColumnOptions;

    // if type is not given explicitly then try to guess it
    const reflectMetadataType =
      Reflect && (Reflect as any).getMetadata
        ? (Reflect as any).getMetadata('design:type', object, propertyName)
        : undefined;
    if (!type && reflectMetadataType)
      // if type is not given explicitly then try to guess it
      type = reflectMetadataType;

    // check if there is no type in column options then set type from first function argument, or guessed one
    if (!options.datatype && type) options.datatype = type;

    // register a regular column

    // if we still don't have a type then we need to give error to user that type is required
    if (!options.datatype)
      throw new ColumnTypeUndefinedError(object, propertyName);

    getMetadataArgsStorage().columns.push({
      target: object.constructor,
      propertyName: propertyName,
      options: options,
    } as ColumnMetadataArgs);
  };
}
