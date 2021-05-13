import { isObject, defined } from '@nextgis/utils';

import type { NgwDateFormat, NgwDateTimeFormat } from '@nextgis/ngw-connector';

export function parseDate(
  date: string | NgwDateFormat | NgwDateTimeFormat,
): string | undefined {
  if (
    isObject(date) &&
    defined(date.year) &&
    defined(date.month) &&
    defined(date.month)
  ) {
    return parseDateFromNgw(date as NgwDateTimeFormat);
  } else if (typeof date === 'string') {
    return date;
  }
}

export function parseDateFromNgw(date: NgwDateTimeFormat): string {
  let dateStr = [date.year, date.month, date.day].join('-');
  if (defined(date.hour)) {
    dateStr += ' ' + [date.hour, date.minute, date.second].join(':');
  }
  return dateStr;
}
