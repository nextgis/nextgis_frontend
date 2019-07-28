/**
 * @module ngw-uploader
 */

// from leaflet Util.js
const templateRe = /\{ *([\w_-]+) *\}/g;

export function template(str: string, data: any) {
  return str.replace(templateRe, function(s, key) {
    let value = data[key];

    if (value === undefined) {
      value = '';
    } else if (typeof value === 'function') {
      value = value(data);
    }
    return value;
  });
}
