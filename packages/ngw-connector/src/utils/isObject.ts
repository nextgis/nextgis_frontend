export function isObject(val: unknown): val is Record<string | number, any> {
  return Object.prototype.toString.call(val) === '[object Object]';
}
