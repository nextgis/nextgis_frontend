import { objectAssign } from '@nextgis/utils';

import type { SearchItem } from './types/SearchItem';
import type { LngLatArray } from '@nextgis/utils';

/**
 * Represents the base class for a geocoder.
 * This abstract class provides the basic methods that every geocoder should implement.
 *
 * @template O - The type of options that can be passed to the geocoder.
 */
export abstract class BaseGeocoder<
  O extends Record<string, any> = Record<string, any>,
> {
  constructor(options?: O) {
    if (options) {
      objectAssign(this, options);
    }
  }

  /**
   * Search method to retrieve geocoding results.
   *
   * @abstract
   * @param query - The search string to geocode.
   * @yields An async generator that yields search results.
   */
  abstract search(query: string): AsyncGenerator<SearchItem>;

  /**
   * Method to retrieve detailed result for a specific search item.
   *
   * @abstract
   * @param item - The search item to get detailed result for.
   * @returns A promise that resolves to the detailed result.
   */
  abstract result(item: SearchItem): Promise<any>;

  /**
   * Method for reverse geocoding.
   * Takes coordinates and returns the corresponding address or location information.
   *
   * @abstract
   * @param  coordinates - The longitude and latitude values.
   * @returns An async generator that yields reverse geocoding results.
   */
  abstract reverse(coordinates: LngLatArray): AsyncGenerator<SearchItem>;

  /**
   * Optional method to abort any ongoing geocoding requests.
   *
   * @abstract
   */
  abstract abort?(): void;
}
