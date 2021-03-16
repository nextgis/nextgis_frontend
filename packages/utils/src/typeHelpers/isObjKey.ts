type Obj = Record<string | number, any>;

export function isObjKey<O extends Obj = Obj>(
  obj: O,
  key: unknown,
): key is keyof O {
  if (typeof key === 'string' || typeof key === 'number') {
    return key in obj;
  }
  return false;
}

/**
 *
 * @deprecated - use isObjectKey instead
 */
export function keyInObj<O extends Obj = Obj>(
  obj: O,
  key: unknown,
): key is keyof O {
  return isObjKey(obj, key);
}
