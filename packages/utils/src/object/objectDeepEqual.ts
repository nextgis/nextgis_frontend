// based on https://stackoverflow.com/a/13143059
export function objectDeepEqual<T extends Record<string, any> = Record<string, any>>(
  o: T,
  p: T,
): boolean {
  let i;
  const keysO = Object.keys(o).sort();
  const keysP = Object.keys(p).sort();
  if (keysO.length !== keysP.length) return false;
  if (keysO.join('') !== keysP.join('')) return false;
  for (i = 0; i < keysO.length; ++i) {
    if (o[keysO[i]] instanceof Array) {
      if (!(p[keysO[i]] instanceof Array)) return false;
      //if (compareObjects(o[keysO[i]], p[keysO[i]] === false) return false
      //would work, too, and perhaps is a better fit, still, this is easy, too
      return p[keysO[i]].sort().join('') === o[keysO[i]].sort().join('');
    } else if (o[keysO[i]] instanceof Date) {
      if (!(p[keysO[i]] instanceof Date)) return false;
      return '' + o[keysO[i]] === '' + p[keysO[i]];
    } else if (o[keysO[i]] instanceof Function) {
      if (!(p[keysO[i]] instanceof Function)) return false;
      //ignore functions, or check them regardless?
    } else if (o[keysO[i]] instanceof Object) {
      if (!(p[keysO[i]] instanceof Object)) return false;
      if (o[keysO[i]] === o) {
        //self reference?
        if (p[keysO[i]] !== p) return false;
      } else if (objectDeepEqual(o[keysO[i]], p[keysO[i]]) === false)
        return false; //WARNING: does not deal with circular refs other than ^^
    }
    if (o[keysO[i]] !== p[keysO[i]])
      return false; //not the same value
  }
  return true;
}
