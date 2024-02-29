/* eslint-disable @typescript-eslint/ban-types */
import { getMetadataArgsStorage } from '..';

import type { ResourceMetadataArgs } from '../metadata-args/ResourceMetadataArgs';
import type { NgwResourceOptions } from '../options/NgwResourceOptions';

export function NgwResource(options: NgwResourceOptions): Function {
  return function (target: Function) {
    getMetadataArgsStorage().resources.push({
      target,
      ...options,
    } as ResourceMetadataArgs);
    return target;
  };
}
