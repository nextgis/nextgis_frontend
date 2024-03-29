/* eslint-disable @typescript-eslint/ban-types */
import type { Connection } from '../connection/Connection';
import type { NgwResourceOptions } from '../options/NgwResourceOptions';

/**
 * Arguments for TableMetadata class, helps to construct an TableMetadata object.
 */
export interface ResourceMetadataArgs extends NgwResourceOptions {
  target?: Function | string;
  connection?: Connection;
}
