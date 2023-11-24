import { defined, isObject } from '@nextgis/utils';

import type { NgwDateFormat, NgwDateTimeFormat } from '@nextgis/ngw-connector';

export function prepareNgwFieldsToPropertiesFilter(
  fields: Record<string, any>,
): Record<string, any> {
  let f: keyof typeof fields;
  for (f in fields) {
    const field = fields[f];
    if (isObject(field)) {
      const date = field as NgwDateFormat | NgwDateTimeFormat;
      if (defined(date.year) && defined(date.month) && defined(date.day)) {
        const dt: [number, number, number, number?, number?, number?] = [
          date.year,
          date.month - 1,
          date.day,
        ];
        if ('hour' in date) {
          [date.hour, date.minute, date.second].forEach((x) => {
            dt.push(x);
          });
        }
        fields[f] = new Date(...dt).toISOString();
      }
    } else if (f === 'id' && typeof field === 'string') {
      fields[f] = field.split(',').map(Number);
    }
  }
  return fields;
}
