/* eslint-disable @typescript-eslint/ban-types */
import { getMetadataArgsStorage } from '..';
import { ResourceMetadataArgs } from '../metadata-args/ResourceMetadataArgs';
import { NgwResourceOptions } from '../options/NgwResourceOptions';

export function NgwResource(options: NgwResourceOptions): Function {
  return function (target: Function) {
    getMetadataArgsStorage().resources.push({
      target,
      ...options,
    } as ResourceMetadataArgs);
    return target;
  };
}
