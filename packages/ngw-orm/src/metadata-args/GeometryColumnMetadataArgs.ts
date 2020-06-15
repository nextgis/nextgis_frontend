/* eslint-disable @typescript-eslint/ban-types */
import { GeometryColumnOptions } from '../options/GeometryColumnOptions';

/**
 * Arguments for ColumnMetadata class.
 */
export interface GeometryColumnMetadataArgs {
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
  readonly options: GeometryColumnOptions;
}
