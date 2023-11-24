import type { Credentials } from '@nextgis/ngw-connector';

/**
 * ConnectionOptions is an interface with settings and options for connection to NGW.
 */
export interface ConnectionOptions {
  baseUrl?: string;
  auth?: Credentials;
  cache?: boolean;
}
