import type { ResourceIdKeynameDef } from '@nextgis/ngw-connector';
import type { BaseResource } from './BaseResource';

export interface SyncOptions {
  parent: ResourceIdKeynameDef | typeof BaseResource;
  keyname?: string;
  display_name?: string;
  description?: string;
}
