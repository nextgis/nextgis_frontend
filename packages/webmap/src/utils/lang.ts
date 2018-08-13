const opts = Object.prototype.toString;

export function isString(it) {
  return (typeof it === 'string' || it instanceof String); // Boolean
}

/**
 * Return true if it is a Function
 * @param it Item to test.
 */
export function isFunction(it) {
  return opts.call(it) === '[object Function]';
}

export function getProp(parts: any[], create: boolean, context: object) {
  try {
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      if (!(p in context)) {
        if (create) {
          context[p] = {};
        } else {
          return;		// return undefined
        }
      }
      context = context[p];
    }
    return context; // mixed
  } catch (e) {
    // "p in context" throws an exception when context is a number, boolean, etc. rather than an object,
    // so in that corner case just return undefined (by having no return statement)
  }
}

export function setObject(name: string, value, context: object) {
  const parts = name.split('.');
  const p = parts.pop();
  const obj = getProp(parts, true, context);
  return obj && p ? (obj[p] = value) : undefined; // Object
}

export function hitch(scope, method) {

  if (!method) {
    method = scope;
    scope = null;
  }
  if (isString(method)) {
    scope = scope;
    if (!scope[method]) {throw (['lang.hitch: scope["', method, '"] is null (scope="', scope, '")'].join('')); }
    return function() {return scope[method].apply(scope, arguments || []); }; // Function
  }
  return !scope ? method : function() {return method.apply(scope, arguments || []); }; // Function
}

export function deepmerge(target, src, mergeArray = false) {
  const array = Array.isArray(src);
  let dst: any = array && [] || {};

  if (array) {

    if (mergeArray) {
      target = target || [];
      dst = dst.concat(target);
      src.forEach(function(e, i) {
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
    } else { // Replace array. Do not merge by default
      dst = src;
    }

  } else {
    if (target && typeof target === 'object') {
      Object.keys(target).forEach(function(key) {
        dst[key] = target[key];
      });
    }
    Object.keys(src).forEach(function(key) {
      if (typeof src[key] !== 'object' || !src[key]) {
        dst[key] = src[key];
      } else {
        if (!target[key]) {
          dst[key] = src[key];
        } else {
          dst[key] = deepmerge(target[key], src[key], mergeArray);
        }
      }
    });
  }
  return dst;
}

export function fixUrlStr(url: string) {
  // remove double slash
  return url.replace(/([^:]\/)\/+/g, '$1');
}
