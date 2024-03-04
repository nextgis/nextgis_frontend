import 'reflect-metadata';

import { getGlobalVariable } from '@nextgis/utils';

import { MetadataArgsStorage } from './metadata-args/MetadataArgsStorage';

export { Connection } from './connection/Connection';
export { BaseResource } from './repository/BaseResource';
export { VectorLayer } from './repository/VectorLayer';
export { PointLayer } from './repository/PointLayer';
export { PolygonLayer } from './repository/PolygonLayer';
export { LineLayer } from './repository/LineLayer';
export { ResourceGroup } from './repository/ResourceGroup';
export { NgwResource } from './decorator/NgwResource';
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
