export function removeEmpty<T extends Record<any, any>>(obj: T): T {
  const newObj: Record<any, any> = {} as T;
  Object.keys(obj).forEach((key) => {
    if (!(obj[key] instanceof Array) && obj[key] === Object(obj[key])) {
      newObj[key] = removeEmpty(obj[key]);
    } else if (obj[key] !== undefined) {
      newObj[key] = obj[key];
    }
  });
  return newObj;
}
