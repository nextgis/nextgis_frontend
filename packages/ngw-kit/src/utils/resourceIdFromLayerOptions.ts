import NgwConnector, { ResourceItem } from '@nextgis/ngw-connector';
import {
  NgwLayerOptions,
  KeynamedNgwLayerOptions,
  ResourceIdNgwLayerOptions,
  ResourceNgwLayerOptions,
} from '../interfaces';

export async function resourceIdFromLayerOptions(
  options: NgwLayerOptions,
  connector: NgwConnector,
): Promise<number> {
  const resource = (options as ResourceNgwLayerOptions).resource;
  const item = resource as ResourceItem;

  // @ts-ignore @deprecated
  let keyname = (options as KeynamedNgwLayerOptions).keyname;
  // @ts-ignore @deprecated
  let resourceId = (options as ResourceIdNgwLayerOptions).resourceId;

  if (resource) {
    if (typeof resource === 'string') {
      keyname = resource;
    } else if (typeof resource === 'number') {
      resourceId = resource;
    } else if (
      item.resource &&
      item.resource !== undefined &&
      'resmeta' in item
    ) {
      resourceId = (resource as ResourceItem).resource.id;
    } else {
      // TODO: safe remove this case
      resourceId = await resourceIdFromLayerOptions(
        resource as ResourceNgwLayerOptions,
        connector,
      );
    }
  }
  if (!resourceId && keyname) {
    const resourceItem = await connector.getResource(keyname);
    if (resourceItem) {
      resourceId = resourceItem.resource.id;
    }
  }
  return resourceId;
}
