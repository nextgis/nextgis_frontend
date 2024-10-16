import type { FuncType } from '../common/FuncType';
import type { ColumnOptions } from '../options/ColumnOptions';

/**
 * Arguments for ColumnMetadata class.
 */
export interface ColumnMetadataArgs {
  /**
   * Class to which column is applied.
   */
  readonly target: FuncType | string;

  /**
   * Class's property name to which column is applied.
   */
  readonly propertyName: string;

  /**
   * Extra column options.
   */
  readonly options: ColumnOptions;
}
