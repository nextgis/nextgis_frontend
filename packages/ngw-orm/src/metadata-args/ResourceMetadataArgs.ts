import { Connection } from '../connection/Connection';
import { ResourceCls, GeometryType } from 'packages/ngw-connector/src';

/**
 * Arguments for TableMetadata class, helps to construct an TableMetadata object.
 */
export interface ResourceMetadataArgs {
  /**
   * Class to which table is applied.
   * Function target is a table defined in the class.
   * String target is a table defined in a json schema.
   */
  target: Function | string;
  type: ResourceCls;
  connection?: Connection;
  keyname?: string;
  display_name?: string;
  geometry_type?: GeometryType;
}
