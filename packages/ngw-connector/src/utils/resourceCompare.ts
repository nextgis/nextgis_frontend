import { objectDeepEqual } from '@nextgis/utils';

import type { DeepPartial } from '@nextgis/utils';
import type { ResourceRead } from '@nextgisweb/resource/type/api';

export function resourceCompare(
  res1: DeepPartial<ResourceRead>,
  res2: DeepPartial<ResourceRead>,
): boolean {
  return objectDeepEqual(res1, res2);
}
