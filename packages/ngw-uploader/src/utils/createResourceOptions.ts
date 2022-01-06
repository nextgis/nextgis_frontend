import { createResourceName } from './createName';

import type { ResourceCls } from '@nextgis/ngw-connector';
import type { ResourceCreateOptions } from '../interfaces';

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
