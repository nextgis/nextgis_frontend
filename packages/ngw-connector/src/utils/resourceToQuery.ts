import { DeepPartial, isObject, defined } from '@nextgis/utils';
import { Resource } from '../types/ResourceItem';

/**
 * { keyname, parent: { id }} > { keyname, parent__id }
 * @param resource any property from NGW resource item
 */
export function resourceToQuery(
  resource: DeepPartial<Resource>,
  prefix = ''
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
