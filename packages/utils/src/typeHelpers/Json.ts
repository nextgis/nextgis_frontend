import { isArray, isObject } from '../index';

export type AnyJson = boolean | number | string | null | JsonArray | JsonMap;
export interface JsonMap {
  [key: string]: AnyJson;
}
export type JsonArray = Array<AnyJson>;

export function isAnyJson(val: unknown): val is AnyJson {
  if (
    typeof val === 'boolean' ||
    typeof val === 'number' ||
    typeof val === 'string' ||
    val === null
  ) {
    return true;
  } else if (isObject(val)) {
    return isJsonMap(val);
  } else if (isArray(val)) {
    return isJsonArray(val);
  }
  return false;
}

export function isJsonArray(val: unknown): val is JsonArray {
  if (isArray(val)) {
    return val.every(isAnyJson);
  }
  return false;
}

export function isJsonMap(val: unknown): val is JsonMap {
  if (isObject(val)) {
    for (const i in val) {
      if (!isAnyJson(i)) {
        return false;
      }
    }
  }
  return false;
}
