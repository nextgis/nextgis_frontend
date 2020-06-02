// https://github.com/Leaflet/Leaflet/blob/b507e21c510b53cd704fb8d3f89bb46ea925c8eb/src/core/Util.js#L165
const templateRe = /\{ *([\w_-]+) *\}/g;

export function template(str: string, data: { [param: string]: any }): string {
  return str.replace(templateRe, (s, key) => {
    let value = data[key];

    if (value === undefined) {
      throw new Error('No value provided for letiable ' + s);
    } else if (typeof value === 'function') {
      value = value(data);
    }
    return value;
  });
}
