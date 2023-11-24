/* eslint-disable @typescript-eslint/ban-types */
import type { ResourceMetadataArgs } from './ResourceMetadataArgs';
import type { ColumnMetadataArgs } from './ColumnMetadataArgs';

/**
 * Storage all metadatas args of all available types: tables, columns etc.
 * Each metadata args represents some specifications of what it represents.
 * MetadataArgs used to create a real Metadata objects.
 */
export class MetadataArgsStorage {
  readonly resources: ResourceMetadataArgs[] = [];
  readonly columns: ColumnMetadataArgs[] = [];

  filterTables(
    target: (Function | string) | (Function | string)[],
  ): ResourceMetadataArgs[] {
    // @ts-ignore TODO: fix types
    return this.filterByTarget(this.resources, target);
  }

  filterColumns(
    target: (Function | string) | (Function | string)[],
  ): ColumnMetadataArgs[] {
    return this.filterByTargetAndWithoutDuplicateProperties(
      this.columns,
      target,
    );
  }

  /**
   * Filters given array by a given target or targets.
   */
  protected filterByTarget<T extends { target: Function | string }>(
    array: T[],
    target: (Function | string) | (Function | string)[],
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
    T extends { target: Function | string; propertyName: string },
  >(array: T[], target: (Function | string) | (Function | string)[]): T[] {
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
