/**
 * gt - greater (\>)
 * lt - lower (\<)
 * ge - greater or equal (\>=)
 * le - lower or equal (\<=)
 * eq - equal (=)
 * ne - not equal (!=)
 * like - LIKE SQL statement (for strings compare)
 * ilike - ILIKE SQL statement (for strings compare)
 */
export type Operation =
  | 'gt'
  | 'lt'
  | 'ge'
  | 'le'
  | 'eq'
  | 'ne'
  | 'in'
  | 'notin'
  | 'like'
  | 'ilike';

/** @deprecated use {@link Operation} instead */
export type Operations = Operation;

export type Properties = { [name: string]: any };

/**
 * field, operation, value
 * ['foo', 'eq', 'bar']
 * ['count', 'ge', 20]
 */
export type PropertyFilter<T extends Properties = Properties> = [
  T extends null
    ? string
    :
        | keyof T
        | `%${string & keyof T}`
        | `%${string & keyof T}%`
        | `${string & keyof T}%`,
  Operation,
  any,
];

export type PropertiesFilter<T extends Properties = Properties> = (
  | 'all'
  | 'any'
  | PropertyFilter<T>
  | PropertiesFilter<T>
)[];
