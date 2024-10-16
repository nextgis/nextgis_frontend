import type { FuncType } from '../common/FuncType';
import type { Connection } from '../connection/Connection';
import type { NgwResourceOptions } from '../options/NgwResourceOptions';

/**
 * Arguments for TableMetadata class, helps to construct an TableMetadata object.
 */
export interface ResourceMetadataArgs extends NgwResourceOptions {
  target?: FuncType | string;
  connection?: Connection;
}
