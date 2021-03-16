export function deepmerge<T>(
  x: Partial<T>,
  y: Partial<T>,
  mergeArray?: boolean,
): T;
export function deepmerge<T1, T2>(
  target: Partial<T1>,
  src: Partial<T2>,
  mergeArray = false,
): T1 & T2 {
  let target_ = target as any;
  const src_ = src as any;
  const array = Array.isArray(src_);
  let dst: any = (array && []) || {};

  if (array && Array.isArray(src_)) {
    if (mergeArray) {
      target_ = target_ || [];
      dst = dst.concat(target_);
      src_.forEach((e: any, i: number) => {
        if (typeof dst[i] === 'undefined') {
          dst[i] = e;
        } else if (typeof e === 'object') {
          dst[i] = deepmerge(target_[i], e, mergeArray);
        } else {
          if (target_.indexOf(e) === -1) {
            dst.push(e);
          }
        }
      });
    } else {
      // Replace array. Do not merge by default
      dst = src_;
    }
  } else {
    if (target_ && typeof target_ === 'object') {
      Object.keys(target_).forEach(function (key) {
        dst[key] = target_[key];
      });
    }
    Object.keys(src_).forEach(function (key) {
      if (typeof src_[key] !== 'object' || !src_[key]) {
        dst[key] = src_[key];
      } else {
        if (typeof target_[key] === 'object' && typeof src_[key] === 'object') {
          dst[key] = deepmerge(target_[key], src_[key], mergeArray);
        } else {
          dst[key] = src_[key];
        }
      }
    });
  }
  return dst;
}
