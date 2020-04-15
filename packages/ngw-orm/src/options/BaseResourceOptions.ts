import { ResourceCls } from 'packages/ngw-connector/src';

/**
 * Describes all resource's options.
 */
export interface BaseResourceOptions {
  type?: ResourceCls;
  /**
   * Unique resource name.
   */
  keyname?: string;

  /**
   * Human readable name
   */
  display_name?: string;
  description?: string;
}
