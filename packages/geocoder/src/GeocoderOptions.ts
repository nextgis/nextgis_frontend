import { BaseProvider } from './providers/BaseProvider';

/**
 * Defines the options for creating a Geocoder instance.
 */
export interface GeocoderOptions {
  /**
   * An array of providers to be used for geocoding.
   */
  providers: BaseProvider[];
}
