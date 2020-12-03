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
export function defined<T>(val: T): val is Exclude<T, null | undefined> {
  return val !== undefined && val !== null;
}

/**
 * from https://github.com/CesiumGS/cesium/blob/master/Source/Core/defined.js
 *
 * @param val - The object.
 * @returns Returns true if the object is defined and not empty string, returns false otherwise.
 *
 * @example
 * ```javascript
 * full('foo') // true
 * full('') // false
 * full(undefined) // false
 * full(0) // true
 * ```
 */
export function full<T>(val: T): val is Exclude<T, null | undefined> {
  return typeof val === 'string' ? !!val : defined(val);
}
