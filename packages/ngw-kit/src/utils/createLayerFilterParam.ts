import { propertiesFilterToExpressionString } from './propertiesFilterToExpression';

import type { Properties, PropertiesFilter } from '@nextgis/properties-filter';

export function createLayerFilterParam<T extends Properties = Properties>(
  resourceId: number,
  filter?: PropertiesFilter<T>,
): Record<string, string | undefined> {
  return {
    [`filter[${resourceId}]`]: propertiesFilterToExpressionString(filter),
  };
}
