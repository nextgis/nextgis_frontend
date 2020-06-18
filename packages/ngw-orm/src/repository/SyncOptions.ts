import { ResourceDefinition } from '@nextgis/ngw-connector';
import { BaseResource } from './BaseResource';

export interface SyncOptions {
  parent: ResourceDefinition | typeof BaseResource;
  keyname?: string;
  display_name?: string;
  description?: string;
}
