import type { ResourceCls, ResourceRead } from '@nextgisweb/resource/type/api';

export type ResourceSyncItem<
  C extends Record<string, any> = Record<string, any>,
> = BaseResourceSyncItem & { [key in ResourceCls]: C };

export interface BaseResourceSyncItem {
  resource: ResourceRead;
  resmeta: {
    items: Record<string, unknown>;
  };
}
