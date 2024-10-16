import { getGlobalVariable } from '@nextgis/utils';

import { MetadataArgsStorage } from './metadata-args/MetadataArgsStorage';

import 'reflect-metadata';

export { Connection } from './connection/Connection';
export { Column } from './decorator/Column';
export { NgwResource } from './decorator/NgwResource';
export { BaseResource } from './repository/BaseResource';
export { LineLayer } from './repository/LineLayer';
export { PointLayer } from './repository/PointLayer';
export { PolygonLayer } from './repository/PolygonLayer';
export { ResourceGroup } from './repository/ResourceGroup';
export { VectorLayer } from './repository/VectorLayer';

/**
 * Gets metadata args storage.
 */
export function getMetadataArgsStorage(): MetadataArgsStorage {
  const globalScope = getGlobalVariable();
  if (!globalScope.ngwOrmMetadataArgsStorage)
    globalScope.ngwOrmMetadataArgsStorage = new MetadataArgsStorage();

  return globalScope.ngwOrmMetadataArgsStorage;
}
