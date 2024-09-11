type NoUndefinedField<T> = {
  [P in keyof T]: Exclude<T[P], undefined>;
};

export function objectRemoveEmpty<T extends Record<any, any>>(
  obj: T,
): NoUndefinedField<T> {
  const newObj: Record<any, any> = {};
  Object.keys(obj).forEach((key) => {
    if (!(obj[key] instanceof Array) && obj[key] === Object(obj[key])) {
      newObj[key] = objectRemoveEmpty(obj[key]);
    } else if (obj[key] !== undefined) {
      newObj[key] = obj[key];
    }
  });
  return newObj as NoUndefinedField<T>;
}
