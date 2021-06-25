// based on https://stackoverflow.com/a/13143059
export function objectDeepEqual<
  T extends Record<string, any> = Record<string, any>,
>(o: T, p: T): boolean {
  let i;
  const keysO = Object.keys(o).sort();
  const keysP = Object.keys(p).sort();
  if (keysO.length !== keysP.length) return false;
  if (keysO.join('') !== keysP.join('')) return false;
  for (i = 0; i < keysO.length; ++i) {
    const oVal = o[keysO[i]];
    const pVal = p[keysO[i]];
    if (oVal instanceof Array) {
      if (!(pVal instanceof Array)) return false;
      //if (compareObjects(oVal, pVal === false) return false
      //would work, too, and perhaps is a better fit, still, this is easy, too
      return pVal.sort().join('') === oVal.sort().join('');
    } else if (oVal instanceof Date) {
      if (!(pVal instanceof Date)) return false;
      return '' + oVal === '' + pVal;
    } else if (oVal instanceof Function) {
      if (!(pVal instanceof Function)) return false;
      //ignore functions, or check them regardless?
    } else if (oVal instanceof Object) {
      if (!(pVal instanceof Object)) return false;
      if (oVal === o) {
        return pVal === p;
      } else {
        return objectDeepEqual(oVal, pVal);
      }
    }
    if (oVal !== pVal) return false; //not the same value
  }
  return true;
}
