import { getMetadataArgsStorage } from '..';

import type { FuncType } from '../common/FuncType';
import type { ResourceMetadataArgs } from '../metadata-args/ResourceMetadataArgs';
import type { NgwResourceOptions } from '../options/NgwResourceOptions';

export function NgwResource(options: NgwResourceOptions): FuncType {
  return function (target: FuncType) {
    getMetadataArgsStorage().resources.push({
      target,
      ...options,
    } as ResourceMetadataArgs);
    return target;
  };
}
