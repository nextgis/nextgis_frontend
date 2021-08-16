import { reEscape } from '@nextgis/utils';

import type { Feature } from 'geojson';
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
export type Operations =
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

type Properties = { [name: string]: any };

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
  Operations,
  any,
];

export type PropertiesFilter<T extends Properties = Properties> = (
  | 'all'
  | 'any'
  | PropertyFilter<T>
  | PropertiesFilter<T>
)[];

function like(b: string, a: string, iLike?: boolean): boolean {
  a = String(a);
  b = String(b);
  if (a === b) return true;
  if (iLike && a.toUpperCase() === b.toUpperCase()) return true;
  const re = `^${reEscape(a)}$`.replace(/%/g, '.*').replace('_', '.');
  return new RegExp(re, iLike ? 'i' : '').exec(b) !== null;
}

export const operationsAliases: {
  [key in Operations]: (a: any, b: any) => boolean;
} = {
  // greater(>)
  gt: (a: any, b: any) => a > b,
  // lower(<)
  lt: (a: any, b: any) => a < b,
  // greater or equal(>=)
  ge: (a: any, b: any) => a >= b,
  // lower or equal(<=)
  le: (a: any, b: any) => a <= b,
  // equal(=)
  eq: (a: any, b: any) => a === b,
  //  not equal(!=)
  ne: (a: any, b: any) => a !== b,

  in: (a: any, b: any[]) => b.indexOf(a) !== -1,
  notin: (a: any, b: any[]) => b.indexOf(a) === -1,
  // LIKE SQL statement(for strings compare)
  like: (a: string, b: string) => {
    return like(a, b);
  },
  // ILIKE SQL statement(for strings compare)
  ilike: (a: string, b: string) => {
    return like(a, b, true);
  },
};

export function isPropertyFilter(
  filter: PropertyFilter | PropertiesFilter | string,
): filter is PropertyFilter {
  const pf = filter as PropertyFilter;
  if (
    pf.length === 3 &&
    typeof pf[0] === 'string' &&
    typeof pf[1] === 'string'
  ) {
    return true;
  }
  return false;
}

/** @deprecated use {@link isPropertyFilter} instead */
export function checkIfPropertyFilter(
  filter: PropertyFilter | PropertiesFilter | string,
): filter is PropertyFilter {
  return isPropertyFilter(filter);
}

export function featureFilter(
  feature: Feature,
  filters: PropertiesFilter,
): boolean {
  const properties: Properties = { ...feature.properties };
  if (properties) {
    // workaround to filter by feature id
    properties.$id = feature.id;
    return propertiesFilter(properties, filters);
  }
  return false;
}

export function propertiesFilter<T extends Properties = Properties>(
  properties: T,
  filters: PropertiesFilter<T>,
): boolean {
  const logic = typeof filters[0] === 'string' ? filters[0] : 'all';
  const filterFunction = (p: PropertyFilter | PropertiesFilter) => {
    if (checkIfPropertyFilter(p)) {
      const [field, operation, value] = p;
      const operationExec = operationsAliases[operation];
      if (operationExec) {
        if (operation === 'like' || operation === 'ilike') {
          if (typeof field === 'string') {
            let prop = '';
            const value_ = field.replace(/^%?(\w+)%?$/, (match, cleanField) => {
              prop = properties[cleanField];
              return field.replace(cleanField, value);
            });
            return operationExec(prop, value_);
          }
        }
        return operationExec(properties[field], value);
      }
      return false;
    } else {
      return propertiesFilter(properties, p);
    }
  };
  const filters_ = filters.filter((x) => Array.isArray(x)) as (
    | PropertyFilter
    | PropertiesFilter
  )[];
  return logic === 'any'
    ? filters_.some(filterFunction)
    : filters_.every(filterFunction);
}
