export * from './DeepPartial';
export * from './isObjKey';
export * from './Json';
export * from './Type';

export function isObject(val: unknown): val is Record<string | number, any> {
  return Object.prototype.toString.call(val) === '[object Object]';
}

export function isArray(val: unknown): val is [] {
  return Object.prototype.toString.call(val) === '[object Array]';
}
