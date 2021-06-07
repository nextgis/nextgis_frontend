import { DeepPartial, defined } from '@nextgis/utils';
import { Resource } from '../types/ResourceItem';
import { isObject } from './isObject';

/**
 * ```
 * { keyname, parent: { id }} > { keyname, parent__id }
 * ```
 * @param resource - Any property from NGW resource item
 */
export function resourceToQuery(
  resource: DeepPartial<Resource>,
  prefix = '',
): Record<string, unknown> {
  prefix = prefix ? prefix + '__' : '';
  const query: Record<string, any> = {};
  Object.entries(resource).forEach(([key, value]) => {
    if (isObject(value)) {
      const children = resourceToQuery(value as DeepPartial<Resource>, key);
      Object.assign(query, children);
    } else if (defined(value)) {
      query[prefix + key] = value;
    }
  });
  return query;
}
