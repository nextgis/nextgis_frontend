/**
 * @module utils
 */

export function deepmerge<T>(x: Partial<T>, y: Partial<T>, mergeArray: boolean): T;
export function deepmerge<T1, T2>(
         target: Partial<T1>,
         src: Partial<T2>,
         mergeArray = false
       ): T1 & T2 {
         const array = Array.isArray(src);
         let dst: any = (array && []) || {};

         if (array && Array.isArray(src)) {
           if (mergeArray) {
             target = (target || []) as Partial<T2>;
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
               if (
                 typeof target[key] === 'object' &&
                 typeof src[key] === 'object'
               ) {
                 dst[key] = deepmerge(target[key], src[key], mergeArray);
               } else {
                 dst[key] = src[key];
               }
             }
           });
         }
         return dst;
       }
