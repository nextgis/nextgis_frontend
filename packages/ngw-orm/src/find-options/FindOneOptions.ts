import { FindConditions } from './FindConditions';

/**
 * Defines a special criteria to find specific entity.
 */
export interface FindOneOptions<P = { [field: string]: any }> {
  /**
   * Specifies what columns should be retrieved.
   */
  fields?: (keyof P)[];

  /**
   * Simple condition that should be applied to match entities.
   */
  where?: FindConditions<P>;

  /**
   * Order, in which entities should be ordered.
   */
  order?: { [P in keyof P]?: 'ASC' | 'DESC' | 1 | -1 };

  /**
   * Enables or disables query result caching.
   */
  cache?: boolean | number;
}
