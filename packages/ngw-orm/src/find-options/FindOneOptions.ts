import { FindConditions } from './FindConditions';

/**
 * Defines a special criteria to find specific entity.
 */
export interface FindOneOptions<Entity = any> {
  /**
   * Specifies what columns should be retrieved.
   */
  fields?: (keyof Entity)[];

  /**
   * Simple condition that should be applied to match entities.
   */
  where?: FindConditions<Entity>;

  /**
   * Order, in which entities should be ordered.
   */
  order?: { [P in keyof Entity]?: 'ASC' | 'DESC' | 1 | -1 };

  /**
   * Enables or disables query result caching.
   */
  cache?: boolean | number;
}
