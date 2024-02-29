/* eslint-disable @typescript-eslint/ban-types */
import { ColumnTypeUndefinedError } from '../error/ColumnTypeUndefinedError';
import { getMetadataArgsStorage } from '../index';

import type { ColumnMetadataArgs } from '../metadata-args/ColumnMetadataArgs';
import type { ColumnOptions } from '../options/ColumnOptions';
import type { ColumnType } from '../types/ColumnTypes';

/**
 * Column decorator is used to mark a specific class property as a table column. Only properties decorated with this
 * decorator will be persisted to the database when entity be saved.
 */
export function Column(): Function;
/**
 * Column decorator is used to mark a specific class property as a table column. Only properties decorated with this
 * decorator will be persisted to the database when entity be saved.
 */
export function Column(type: ColumnType): Function;

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
  typeOrOptions?: ColumnType | ColumnOptions,
  options?: ColumnOptions,
): Function {
  return function (object: Record<string, any>, propertyName: string) {
    // normalize parameters
    let type: ColumnType | undefined;
    if (typeof typeOrOptions === 'string') {
      type = typeOrOptions as ColumnType;
    } else if (typeOrOptions) {
      options = typeOrOptions as ColumnOptions;
      type = typeOrOptions.datatype;
    }
    if (!options) options = {} as ColumnOptions;

    // if type is not given explicitly then try to guess it
    const reflectMetadata =
      Reflect && (Reflect as any).getMetadata
        ? (Reflect as any).getMetadata('design:type', object, propertyName)
        : undefined;
    if (!type && reflectMetadata) {
      const reflectMetadataType = reflectMetadata.name;
      // if type is not given explicitly then try to guess it
      const alias: Record<string, ColumnType> = {
        String: 'STRING',
        Number: 'REAL',
        Ddate: 'DATE',
        Boolean: 'INTEGER',
      };
      const type = alias[reflectMetadataType];
      if (type) {
        options.datatype = type;
      }
    }

    // check if there is no type in column options then set type from first function argument, or guessed one
    if (!options.datatype && type) options.datatype = type;

    // register a regular column

    // if we still don't have a type then we need to give error to user that type is required
    if (!options.datatype)
      throw new ColumnTypeUndefinedError(object, propertyName);

    getMetadataArgsStorage().columns.push({
      target: object.constructor,
      propertyName: propertyName,
      options,
    } as ColumnMetadataArgs);
  };
}
