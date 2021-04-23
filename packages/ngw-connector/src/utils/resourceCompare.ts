import { DeepPartial } from '@nextgis/utils';
import { Resource } from '../types/ResourceItem';

export function resourceCompare(
  res1: DeepPartial<Resource>,
  res2: DeepPartial<Resource>,
): boolean {
  return objectCompare(res1, res2);
}

function isObject(val: unknown): val is Record<string | number, any> {
  return Object.prototype.toString.call(val) === '[object Object]';
}
function objectCompare<T = Record<string | number, any>>(
  obj1: T,
  obj2: T,
): boolean {
  return Object.entries(obj1).every(([key, value]) => {
    const value2 = obj2[key as keyof T];
    if (isObject(value)) {
      if (isObject(value2)) {
        return objectCompare(value, value2);
      }
      return false;
    } else if (value2 !== undefined) {
      return value === value2;
    }
    return true;
  });
}
