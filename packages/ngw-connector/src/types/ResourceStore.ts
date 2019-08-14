/**
 * @module ngw-connector
 */

export interface ResourceStoreItem {
  id: number;
  label: string;
  [field: string]: string | number | boolean | null | Date;
}
