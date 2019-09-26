/**
 * @module ngw-connector
 */

export type ResourceStoreItemProperties = { [name: string]: any } | null;

export type ResourceStoreItem<
  P extends ResourceStoreItemProperties = ResourceStoreItemProperties
> = ResourceStoreItemDefault & P;

export interface ResourceStoreItemDefault {
  id: number;
  label: string;
  [field: string]: string | number | boolean | null | Date;
}
