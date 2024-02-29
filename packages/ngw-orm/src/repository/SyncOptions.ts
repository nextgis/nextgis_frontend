import type { BaseResource } from './BaseResource';
import type { ResourceIdKeynameDef } from '@nextgis/ngw-connector';

export interface SyncOptions {
  parent: ResourceIdKeynameDef | typeof BaseResource;
  keyname?: string;
  display_name?: string;
  description?: string;
}
