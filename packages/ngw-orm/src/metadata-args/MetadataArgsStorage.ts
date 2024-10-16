import type { FuncType } from '../common/FuncType';

import type { ColumnMetadataArgs } from './ColumnMetadataArgs';
import type { ResourceMetadataArgs } from './ResourceMetadataArgs';

/**
 * Storage all metadatas args of all available types: tables, columns etc.
 * Each metadata args represents some specifications of what it represents.
 * MetadataArgs used to create a real Metadata objects.
 */
export class MetadataArgsStorage {
  readonly resources: ResourceMetadataArgs[] = [];
  readonly columns: ColumnMetadataArgs[] = [];

  filterTables(
    target: (FuncType | string) | (FuncType | string)[],
  ): ResourceMetadataArgs[] {
    // @ts-expect-error TODO: fix types
    return this.filterByTarget(this.resources, target);
  }

  filterColumns(
    target: (FuncType | string) | (FuncType | string)[],
  ): ColumnMetadataArgs[] {
    return this.filterByTargetAndWithoutDuplicateProperties(
      this.columns,
      target,
    );
  }

  /**
   * Filters given array by a given target or targets.
   */
  protected filterByTarget<T extends { target: FuncType | string }>(
    array: T[],
    target: (FuncType | string) | (FuncType | string)[],
  ): T[] {
    return array.filter((table) => {
      return Array.isArray(target)
        ? target.indexOf(table.target) !== -1
        : table.target === target;
    });
  }

  /**
   * Filters given array by a given target or targets and prevents duplicate property names.
   */
  protected filterByTargetAndWithoutDuplicateProperties<
    T extends { target: FuncType | string; propertyName: string },
  >(array: T[], target: (FuncType | string) | (FuncType | string)[]): T[] {
    const newArray: T[] = [];
    array.forEach((item) => {
      const sameTarget = Array.isArray(target)
        ? target.indexOf(item.target) !== -1
        : item.target === target;
      if (sameTarget) {
        if (
          !newArray.find(
            (newItem) => newItem.propertyName === item.propertyName,
          )
        )
          newArray.push(item);
      }
    });
    return newArray;
  }
}
