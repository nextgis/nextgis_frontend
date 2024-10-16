import type { Properties } from '@nextgis/properties-filter';

import type { FindOneOptions } from './FindOneOptions';

/**
 * Defines a special criteria to find specific entities.
 */
export interface FindManyOptions<P extends Properties = Properties>
  extends FindOneOptions<P> {
  /**
   * Offset (paginated) where from entities should be taken.
   */
  offset?: number;

  /**
   * Limit (paginated) - max number of entities should be taken.
   */
  limit?: number;
}
