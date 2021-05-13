export function unflatten(
  data: Record<string, any> | any[],
): Record<string, any> {
  if (Object(data) !== data || Array.isArray(data)) return data;
  const regex = /\.?([^.[\]]+)|\[(\d+)\]/g;
  const flat: Record<string, any> = {};
  for (const p in data) {
    let cur = flat;
    let prop = '';
    let m;
    while ((m = regex.exec(p))) {
      cur = cur[prop] || (cur[prop] = m[2] ? [] : {});
      prop = m[2] || m[1];
    }
    cur[prop] = data[p];
  }
  return flat[''] || flat;
}
