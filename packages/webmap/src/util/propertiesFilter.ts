import {
  PropertiesFilter,
  Operations,
  PropertyFilter
} from '../interfaces/LayerAdapter';

function like(a: string, b: string, iLike?: boolean) {
  const re = `^${a}$`.replace(/%/g, '.*').replace('_', '.');
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
  }
};

export function propertiesFilter(
  properties: { [field: string]: any },
  filters: PropertiesFilter
): boolean {
  const logic = typeof filters[0] === 'string' ? filters[0] : 'all';
  const filters_ = filters.filter(x => Array.isArray(x)) as PropertyFilter[];
  const filterFunction = ([field, operation, value]: PropertyFilter) => {
    const operationExec = operationsAliases[operation];
    const property = properties[field];
    if (operationExec && property) {
      return operationExec(property, value);
    }
    return true;
  };
  return logic === 'any'
    ? filters_.some(filterFunction)
    : filters_.every(filterFunction);
}
