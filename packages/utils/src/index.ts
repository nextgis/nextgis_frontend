/**
 * @module utils
 */

import * as Dom from './dom';
export const dom = Dom;
export * from './clipboard';
export * from './events';
export * from './array';
export * from './propertiesFilter';
export * from './sleep';
export { deepmerge } from './deepmerge';
export { debounce } from './debounce';
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
  context: { [method: string]: (...args: any[]) => any }
): void {
  fns.forEach(fn => {
    if (!context[fn]) {
      return;
    }
    context[fn] = context[fn].bind(context);
  });
}

export function fixUrlStr(url: string): string {
  // remove double slash
  return url.replace(/([^:]\/)\/+/g, '$1');
}
