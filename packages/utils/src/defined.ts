/**
 * from https://github.com/CesiumGS/cesium/blob/master/Source/Core/defined.js
 *
 * @param val - The object.
 * @returns Returns true if the object is defined, returns false otherwise.
 *
 * @example
 * ```javascript
 * if (defined(positions)) {
 *   doSomething();
 * } else {
 *   doSomethingElse();
 * }
 * ```
 */
export function defined(val: unknown): val is boolean {
  return val !== undefined && val !== null;
}

export function full(val: unknown): val is boolean {
  if (typeof val === 'string') {
    return !!val;
  }
  return defined(val);
}
