import { propertiesFilterToExpressionString } from './propertiesFilterToExpression';

import type { Properties, PropertiesFilter } from '@nextgis/properties-filter';

export function createLayerFilterParam<T extends Properties = Properties>(
  resourceId: number,
  filter?: PropertiesFilter<T>,
): Record<string, string> {
  const value = propertiesFilterToExpressionString(filter);
  if (value === undefined) {
    return {};
  }
  return {
    [`filter[${resourceId}]`]: value,
  };
}
