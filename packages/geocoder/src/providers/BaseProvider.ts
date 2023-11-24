import { BaseGeocoder } from '../BaseGeocoder';

import type { BaseProviderOptions } from './BaseProviderOptions';

/**
 * Abstract base class representing a search provider.
 * It builds upon the BaseGeocoder functionalities with provider-specific properties.
 * @template O - Options type which extends BaseProviderOptions.
 */
export abstract class BaseProvider<
  O extends BaseProviderOptions = BaseProviderOptions,
> extends BaseGeocoder<O> {
  /**
   * URL endpoint for the search service.
   * This is where queries will be sent to obtain search results.
   */
  searchUrl?: string;

  /**
   * Label to represent the provider.
   * Useful for user interfaces to display the source of search results.
   */
  label?: string;
}
