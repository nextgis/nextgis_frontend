import type { Resource, ResourceCls } from '@nextgis/ngw-connector';

export type ResourceSyncItem<
  C extends Record<string, any> = Record<string, any>,
> = BaseResourceSyncItem & { [key in ResourceCls]: C };

export interface BaseResourceSyncItem {
  resource: Resource;
  resmeta: {
    items: Record<string, unknown>;
  };
}
