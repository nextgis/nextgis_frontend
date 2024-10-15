import type { ResourceCls } from '@nextgisweb/resource/type/api';

/**
 * Describes all resource's options.
 */
export interface NgwResourceOptions {
  type: ResourceCls;
  /**
   * Human readable name
   */
  display_name: string;
  /**
   * Unique resource name.
   */
  keyname?: string;
  description?: string;
}
