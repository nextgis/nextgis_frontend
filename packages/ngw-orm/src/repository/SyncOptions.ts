import { ResourceDefinition } from '@nextgis/ngw-connector';

export interface SyncOptions {
  parent: ResourceDefinition;
  keyname?: string;
  display_name?: string;
  description?: string;
}
