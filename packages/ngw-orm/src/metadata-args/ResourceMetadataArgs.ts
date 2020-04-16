import { BaseResourceOptions } from '../options/BaseResourceOptions';
import { Connection } from '../connection/Connection';

/**
 * Arguments for TableMetadata class, helps to construct an TableMetadata object.
 */
export interface ResourceMetadataArgs extends BaseResourceOptions {
  target: Function | string;
  connection?: Connection;
}
