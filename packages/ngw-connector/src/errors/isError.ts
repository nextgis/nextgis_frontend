import { isObject } from '@nextgis/utils';

export function isError(error: unknown): error is Error {
  if (isObject(error)) {
    return Boolean(error.status_code && error.exception && error.title);
  }
  return false;
}
