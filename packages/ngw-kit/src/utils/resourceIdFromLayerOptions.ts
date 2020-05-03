import NgwConnector, { ResourceItem } from '@nextgis/ngw-connector';
import {
  NgwLayerOptions,
  KeynamedNgwLayerOptions,
  ResourceIdNgwLayerOptions,
  ResourceNgwLayerOptions,
} from '../interfaces';

export async function resourceIdFromLayerOptions(
  options: NgwLayerOptions,
  connector: NgwConnector
) {
  const resource = (options as ResourceNgwLayerOptions).resource;
  const item = resource as ResourceItem;
  let keyname = (options as KeynamedNgwLayerOptions).keyname;
  let resourceId = (options as ResourceIdNgwLayerOptions).resourceId;
  if (resource) {
    if (typeof resource === 'string') {
      keyname = resource;
    } else if (typeof resource === 'number') {
      resourceId = resource;
    } else if (item.resource && item.resource !== undefined) {
      resourceId = (resource as ResourceItem).resource.id;
    } else {
      resourceId = await resourceIdFromLayerOptions(
        resource as ResourceNgwLayerOptions,
        connector
      );
    }
  }
  if (!resourceId && keyname) {
    const resourceItem = await connector.getResourceByKeyname(keyname);
    if (resourceItem) {
      resourceId = resourceItem.resource.id;
    }
  }
  return resourceId;
}
