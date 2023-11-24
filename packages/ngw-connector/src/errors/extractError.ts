import { isObject } from '@nextgis/utils';

import { NetworksResponseError } from './NetworksResponseError';

export function extractError(error: unknown) {
  if (isObject(error)) {
    if (error.name && error.message && error.title) {
      return {
        title: error.title,
        message: error.message,
        detail: error.detail || null,
        data: error.data && error.data.data ? error.data.data : null,
      };
    } else if (error.exception) {
      if (
        error.status === undefined ||
        error.status === 0 ||
        error.data === undefined
      ) {
        return new NetworksResponseError({
          title: error.title,
          status_code: error.status_code,
          exception: error.exception,
        });
      }
    }

    return {
      title: typeof error.title === 'string' ? error.title : 'Unexpected error',
      message:
        typeof error.message === 'string'
          ? error.message
          : 'Something went wrong.',
    };
  }
}
