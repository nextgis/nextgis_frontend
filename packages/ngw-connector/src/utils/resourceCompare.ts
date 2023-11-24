import { objectDeepEqual } from '@nextgis/utils';

import type { Resource } from '../types/ResourceItem';
import type { DeepPartial } from '@nextgis/utils';

export function resourceCompare(
  res1: DeepPartial<Resource>,
  res2: DeepPartial<Resource>,
): boolean {
  return objectDeepEqual(res1, res2);
}
