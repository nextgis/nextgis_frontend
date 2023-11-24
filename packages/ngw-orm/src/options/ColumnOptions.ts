import type { ColumnType } from '../types/ColumnTypes';

/**
 * Describes all column's options.
 */
export interface ColumnOptions {
  /**
   * Column type. Must be one of the value from the ColumnTypes class.
   */
  datatype?: ColumnType;

  /**
   * Column name in the database.
   */
  keyname?: string;

  /**
   * Column name in the webmap.
   */
  display_name?: string;

  /**
   * Can this field be shown in the attribute table.
   */
  grid_visibility?: boolean;

  /**
   * Is this field used to display the name of an object
   */
  label_field?: boolean;

  /**
   * Custom fields properties
   */
  meta?: Record<string, unknown>;
}
