export interface FlattenOptions {
  flatArray?: boolean;
}

export function flatten(
  data: Record<string, any>,
  opt: FlattenOptions = {},
): Record<string, any> {
  const flatArray = opt.flatArray ?? true;
  const result: Record<string, any> = {};
  function recurse(cur: Record<string, any>, prop: any) {
    if (Object(cur) !== cur) {
      result[prop] = cur;
    } else if (Array.isArray(cur) && flatArray) {
      const l = cur.length;
      for (let i = 0; i < l; i++) {
        recurse(cur[i], prop + '[' + i + ']');
      }
      if (l === 0) result[prop] = [];
    } else {
      let isEmpty = true;
      for (const p in cur) {
        isEmpty = false;
        recurse(cur[p], prop ? prop + '.' + p : p);
      }
      if (isEmpty && prop) result[prop] = {};
    }
  }
  recurse(data, '');
  return result;
}
