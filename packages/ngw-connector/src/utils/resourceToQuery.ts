import { defined } from '@nextgis/utils';

import { isObject } from './isObject';

import type { Resource } from '../types/ResourceItem';
import type { DeepPartial } from '@nextgis/utils';

const exclude = ['description'];

/**
 * @remarks
 * https://docs.nextgis.com/docs_ngweb_dev/doc/developer/resource.html#search-resources
 *
 * ```
 * { keyname, owner_user: { id }} > { keyname, owner_user__id }
 * ```
 *
 * @param resource - Any property from NGW resource item
 */
export function resourceToQuery(
  resource: DeepPartial<Resource>,
  prefix = '',
): Record<string, unknown> {
  prefix = prefix ? prefix + '__' : '';
  const query: Record<string, any> = {};
  for (const [key, value] of Object.entries(resource)) {
    if (exclude.indexOf(key) === -1) {
      if (isObject(value)) {
        if (key === 'owner_user') {
          const children = resourceToQuery(value as DeepPartial<Resource>, key);
          Object.assign(query, children);
        } else if (key === 'parent' && 'id' in value) {
          query.parent_id = value.id;
        }
      } else if (defined(value)) {
        query[prefix + key] = value;
      }
    }
  }
  return query;
}
