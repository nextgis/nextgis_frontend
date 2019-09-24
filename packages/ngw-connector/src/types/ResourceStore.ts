/**
 * @module ngw-connector
 */

export type ResourceStoreItem<P extends Record<string, any>> = ResourceStoreItemDefault & P;

export interface ResourceStoreItemDefault {
  id: number;
  label: string;
  [field: string]: string | number | boolean | null | Date;
}
