import { Geocoder } from './Geocoder';

import type { GeocoderOptions } from './GeocoderOptions';

export { Geocoder, GeocoderOptions };
export { BaseProvider } from './providers/BaseProvider';
export { NgwProvider } from './providers/NgwProvider';
export { NominatimProvider } from './providers/NominatimProvider';

export * from './providers/BaseProviderOptions';
export * from './types/ResultItem';
export * from './types/SearchItem';

export function create(options: GeocoderOptions): Geocoder {
  return new Geocoder(options);
}
