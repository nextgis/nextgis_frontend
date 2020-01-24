import NgwConnector from '@nextgis/ngw-connector';
import {
  NgwLayerOptions,
  KeynamedNgwLayerOptions,
  ResourceIdNgwLayerOptions
} from '../interfaces';

export async function resourceIdFromLayerOptions(
  options: NgwLayerOptions,
  connector: NgwConnector
) {
  const keyname = (options as KeynamedNgwLayerOptions).keyname;
  let resourceId = (options as ResourceIdNgwLayerOptions).resourceId;
  if (!resourceId && keyname) {
    const resourceItem = await connector.getResourceByKeyname(keyname);
    resourceId = resourceItem.resource.id;
  }
  return resourceId;
}
