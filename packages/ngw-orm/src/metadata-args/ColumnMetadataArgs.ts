import { ColumnOptions } from '../options/ColumnOptions';

/**
 * Arguments for ColumnMetadata class.
 */
export interface ColumnMetadataArgs {
  /**
   * Class to which column is applied.
   */
  readonly target: Function | string;

  /**
   * Class's property name to which column is applied.
   */
  readonly propertyName: string;

  /**
   * Extra column options.
   */
  readonly options: ColumnOptions;
}
