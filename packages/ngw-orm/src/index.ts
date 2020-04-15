/**
 * @module ngw-orm
 */
import 'reflect-metadata';

import { getGlobalVariable } from '@nextgis/utils';
import { MetadataArgsStorage } from './metadata-args/MetadataArgsStorage';

export { Connection } from './connection/Connection';
export { BaseResource } from './repository/BaseResource';
export { VectorLayer } from './repository/VectorLayer';
export { Resource as FeatureLayer } from './decorator/Resource';
export { Column } from './decorator/Column';

/**
 * Gets metadata args storage.
 */
export function getMetadataArgsStorage(): MetadataArgsStorage {
  const globalScope = getGlobalVariable();
  if (!globalScope.ngwOrmMetadataArgsStorage)
    globalScope.ngwOrmMetadataArgsStorage = new MetadataArgsStorage();

  return globalScope.ngwOrmMetadataArgsStorage;
}
