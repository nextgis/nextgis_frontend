/**
 * @module utils
 */

export * from './platform';

export * from './applyMixins';
export * from './array';
export * from './defined';
export * from './deepmerge';
export * from './deprecated';
export * from './debounce';
export * from './debug';
export * from './events';
export * from './geom';
export * from './object';
export * from './flatten';
export * from './unflatten';
export * from './re';
export * from './sleep';
export * from './string';
export * from './number';
export * from './typeHelpers';
export * from './url';
export * from './Clipboard';
export * from './tileJson';
export * from './interfaces';
/**
 * Given an array of member function names as strings, replace all of them
 * with bound versions that will always refer to `context` as `this`. This
 * is useful for classes where otherwise event bindings would reassign
 * `this` to the evented object or some other value: this lets you ensure
 * the `this` value always.
 * Taken from: https://github.com/mapbox/mapbox-gl-js/blob/v1.0.0/src/util/util.js#L243
 */
export function bindAll(
  fns: string[],
  context: { [method: string]: (...args: any[]) => any },
): void {
  fns.forEach((fn) => {
    if (!context[fn]) {
      return;
    }
    context[fn] = context[fn].bind(context);
  });
}

export function isObject(val: unknown): val is Record<string | number, any> {
  return Object.prototype.toString.call(val) === '[object Object]';
}

export function isArray(val: unknown): val is [] {
  return Object.prototype.toString.call(val) === '[object Array]';
}
