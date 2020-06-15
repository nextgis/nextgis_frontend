/* eslint-disable @typescript-eslint/ban-types */
import { GeometryType } from '@nextgis/ngw-connector';
import { getMetadataArgsStorage } from '../index';
import { GeometryColumnMetadataArgs } from '../metadata-args/GeometryColumnMetadataArgs';

export function GeometryColumn(type: GeometryType): Function {
  return function (object: Record<string, any>, propertyName: string) {
    getMetadataArgsStorage().geometryColumns.push({
      target: object.constructor,
      propertyName: propertyName,
      options: { type },
    } as GeometryColumnMetadataArgs);
  };
}
