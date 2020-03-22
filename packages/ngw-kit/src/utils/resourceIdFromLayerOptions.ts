import NgwConnector from '@nextgis/ngw-connector';
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
  let keyname = (options as KeynamedNgwLayerOptions).keyname;
  let resourceId = (options as ResourceIdNgwLayerOptions).resourceId;
  if (resource) {
    if (typeof resource === 'string') {
      keyname = resource;
    } else if (typeof resource === 'number') {
      resourceId = resource;
    } else {
      resourceId = await resourceIdFromLayerOptions(resource, connector);
    }
  }
  if (!resourceId && keyname) {
    const resourceItem = await connector.getResourceByKeyname(keyname);
    resourceId = resourceItem.resource.id;
  }
  return resourceId;
}
