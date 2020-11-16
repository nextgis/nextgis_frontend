import { NgwDateFormat } from '@nextgis/ngw-connector';
import { isObject, defined } from '@nextgis/utils';

export function parseDate(date: string | NgwDateFormat): string | undefined {
  if (
    isObject(date) &&
    defined(date.year) &&
    defined(date.month) &&
    defined(date.month)
  ) {
    return parseDateFromNgw(date);
  } else if (typeof date === 'string') {
    return date;
  }
}

export function parseDateFromNgw(date: NgwDateFormat): string {
  return [date.year, date.month, date.day].join('-');
}
