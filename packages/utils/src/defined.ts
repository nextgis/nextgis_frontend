/**
 * from https://github.com/CesiumGS/cesium/blob/master/Source/Core/defined.js
 *
 * @exports defined
 *
 * @param value - The object.
 * @returns Returns true if the object is defined, returns false otherwise.
 *
 * @example
 * ```javascript
 * if (defined(positions)) {
 *      doSomething();
 * } else {
 *      doSomethingElse();
 * }
 * ```
 */
export function defined(value: unknown): boolean {
  return value !== undefined && value !== null;
}
