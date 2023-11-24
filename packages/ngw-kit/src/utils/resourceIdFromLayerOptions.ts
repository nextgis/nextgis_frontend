import type { NgwLayerOptions } from '../interfaces';
import type { ResourceItem } from '@nextgis/ngw-connector';
import type NgwConnector from '@nextgis/ngw-connector';

export async function resourceIdFromLayerOptions(
  options: NgwLayerOptions,
  connector: NgwConnector,
): Promise<number> {
  const resource = options.resource;
  const item = resource as ResourceItem;

  // @ts-ignore @deprecated
  let { keyname, resourceId } = options;

  if (resource) {
    if (typeof resource === 'string') {
      keyname = resource;
    } else if (typeof resource === 'number') {
      resourceId = resource;
    } else if (
      item.resource &&
      item.resource !== undefined &&
      'resource' in item
    ) {
      resourceId = (resource as ResourceItem).resource.id;
    } else {
      // TODO: safe remove this case
      resourceId = await resourceIdFromLayerOptions(resource as any, connector);
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
