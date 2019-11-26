/**
 * @module utils
 */

import * as Dom from './dom';
export const dom = Dom;
export * from './clipboard';
export * from './events';
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

export function deepmerge(target: any, src: any, mergeArray = false): any {
  const array = Array.isArray(src);
  let dst: any = (array && []) || {};

  if (array) {
    if (mergeArray) {
      target = target || [];
      dst = dst.concat(target);
      src.forEach(function (e: any, i: any) {
        if (typeof dst[i] === 'undefined') {
          dst[i] = e;
        } else if (typeof e === 'object') {
          dst[i] = deepmerge(target[i], e, mergeArray);
        } else {
          if (target.indexOf(e) === -1) {
            dst.push(e);
          }
        }
      });
    } else {
      // Replace array. Do not merge by default
      dst = src;
    }
  } else {
    if (target && typeof target === 'object') {
      Object.keys(target).forEach(function (key) {
        dst[key] = target[key];
      });
    }
    Object.keys(src).forEach(function (key) {
      if (typeof src[key] !== 'object' || !src[key]) {
        dst[key] = src[key];
      } else {
        if (typeof target[key] === 'object' && typeof src[key] === 'object') {
          dst[key] = deepmerge(target[key], src[key], mergeArray);
        } else {
          dst[key] = src[key];
        }
      }
    });
  }
  return dst;
}
