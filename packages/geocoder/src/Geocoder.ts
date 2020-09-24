import CancelablePromise from '@nextgis/cancelable-promise';
import { BaseProvider } from './providers/BaseProvider';
import { GeocoderOptions } from './GeocoderOptions';
import { BaseGeocoder } from './BaseGeocoder';
import { SearchItem } from './types/SearchItem';

export class Geocoder extends BaseGeocoder<GeocoderOptions> {
  providers: BaseProvider[] = [];

  constructor(options: GeocoderOptions) {
    super(options);
    if (options && options.providers) {
      this.providers = options.providers;
    }
  }

  abort(): void {
    this.providers.forEach((x) => {
      if (x.abort) {
        x.abort();
      }
    });
  }

  async *search(query: string): AsyncGenerator<SearchItem, void, unknown> {
    for (const provider of this.providers) {
      try {
        const results = provider.search(query);

        for await (const r of results) {
          yield { ...r, provider };
        }
      } catch (er) {
        //
      }
    }
  }

  result(item: SearchItem): CancelablePromise<any> {
    if (item.provider) {
      return item.provider.result(item);
    }
    return CancelablePromise.resolve(undefined);
  }
}
