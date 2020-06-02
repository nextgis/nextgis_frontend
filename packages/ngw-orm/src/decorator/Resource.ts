/* eslint-disable @typescript-eslint/ban-types */
import { getMetadataArgsStorage } from '..';
import { ResourceMetadataArgs } from '../metadata-args/ResourceMetadataArgs';
import { ResourceOptions } from '../options/ResourceOptions';

export function Resource(options: ResourceOptions): Function {
  return function (target: Function) {
    getMetadataArgsStorage().resources.push({
      target: target,
      type: 'vector_layer',
      ...options,
      options,
    } as ResourceMetadataArgs);
  };
}
