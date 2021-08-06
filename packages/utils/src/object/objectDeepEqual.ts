function isEqual(a: unknown, b: unknown, o: unknown, p: unknown): boolean {
  if (a instanceof Array) {
    if (!(b instanceof Array)) return false;
    //if (compareObjects(oVal, pVal === false) return false
    //would work, too, and perhaps is a better fit, still, this is easy, too
    return b.sort().join('') === a.sort().join('');
  } else if (a instanceof Date) {
    if (!(b instanceof Date)) return false;
    return '' + a === '' + b;
  } else if (a instanceof Function) {
    if (!(b instanceof Function)) return false;
    //ignore functions, or check them regardless?
  } else if (a instanceof Object) {
    if (!(b instanceof Object)) return false;
    if (a === o) {
      return b === p;
    } else {
      return objectDeepEqual(a, b);
    }
  }
  return a === b;
}

// based on https://stackoverflow.com/a/13143059
export function objectDeepEqual<
  T extends Record<string, any> = Record<string, any>,
>(o: T, p: T): boolean {
  const keysO = Object.keys(o).sort();
  const keysP = Object.keys(p).sort();
  if (keysO.length !== keysP.length) return false;
  if (keysO.join('') !== keysP.join('')) return false;
  for (let i = 0; i < keysO.length; i++) {
    const oVal = o[keysO[i]];
    const pVal = p[keysP[i]];
    if (!isEqual(oVal, pVal, o, p)) {
      return false;
    }
  }
  return true;
}
