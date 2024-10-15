import { createResourceName } from './createName';

import type { ResourceCreateOptions } from '../interfaces';
import type { ResourceCls } from '@nextgisweb/resource/type/api';

export function createResourceOptions(
  cls: ResourceCls,
  opt: ResourceCreateOptions,
) {
  const name = createResourceName(opt);
  return {
    cls,
    parent: {
      id: opt.parentId !== undefined ? opt.parentId : opt.id,
    },
    display_name: name,
    keyname: opt.keyname || null,
    description: opt.description || null,
  };
}
