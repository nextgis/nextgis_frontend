export type ResourceStoreItemProperties = { [name: string]: any } | null;

export type ResourceStoreItem<
  P extends ResourceStoreItemProperties = ResourceStoreItemProperties,
> = ResourceStoreItemDefault & { data?: string } & P;

export interface ResourceStoreItemDefault {
  [field: string]: string | number | boolean | null | Date;
  id: number;
  label: string;
}
