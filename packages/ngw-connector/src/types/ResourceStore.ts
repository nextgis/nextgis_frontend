/**
 * @module ngw-connector
 */

export interface ResourceStoreItem {
  id: string;
  label: string;
  [field: string]: string | number | boolean;
}
