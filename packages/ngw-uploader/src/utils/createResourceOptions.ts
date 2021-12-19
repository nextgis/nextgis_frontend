import type { ResourceCls } from '@nextgis/ngw-connector';
import type { ResourceCreateOptions } from '../interfaces';

export function createResourceOptions(
  cls: ResourceCls,
  opt: ResourceCreateOptions,
) {
  return {
    cls,
    parent: {
      id: opt.parentId !== undefined ? opt.parentId : opt.id,
    },
    display_name: opt.display_name || opt.name,
    keyname: opt.keyname || null,
    description: opt.description || null,
  };
}
