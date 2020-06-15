/* eslint-disable @typescript-eslint/ban-types */
import { NgwResourceOptions } from '../options/NgwResourceOptions';
import { Connection } from '../connection/Connection';

/**
 * Arguments for TableMetadata class, helps to construct an TableMetadata object.
 */
export interface ResourceMetadataArgs extends NgwResourceOptions {
  target: Function | string;
  connection?: Connection;
}
