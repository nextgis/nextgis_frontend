/**
 * from https://github.com/CesiumGS/cesium/blob/master/Source/Core/defined.js
 *
 * @exports defined
 *
 * @param {*} value The object.
 * @returns {Boolean} Returns true if the object is defined, returns false otherwise.
 *
 * @example
 * if (defined(positions)) {
 *      doSomething();
 * } else {
 *      doSomethingElse();
 * }
 */
export function defined(value: any) {
  return value !== undefined && value !== null;
}
