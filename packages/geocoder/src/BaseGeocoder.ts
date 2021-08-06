import { objectAssign } from '@nextgis/utils';
import CancelablePromise from '@nextgis/cancelable-promise';
import { SearchItem } from './types/SearchItem';

export abstract class BaseGeocoder<
  O extends Record<string, any> = Record<string, any>,
> {
  constructor(options?: O) {
    if (options) {
      objectAssign(this, options);
    }
  }

  abstract search(query: string): AsyncGenerator<SearchItem>;

  abstract result(item: SearchItem): CancelablePromise<any>;

  abstract abort?(): void;
}
