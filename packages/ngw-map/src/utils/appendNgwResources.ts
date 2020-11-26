import { NgwResourceDefinition, NgwLayerOptions } from '../interfaces';
import { NgwLayerOptionsAdditional } from '@nextgis/ngw-kit';

export function appendNgwResources(
  options: NgwLayerOptions[],
  resource?: NgwResourceDefinition,
  defOptions?: NgwLayerOptionsAdditional,
  overwriteOptions?: NgwLayerOptionsAdditional
): void {
  if (typeof resource === 'number' || typeof resource === 'string') {
    resource = Number(resource);
    options.push({
      ...defOptions,
      resource,
    });
  } else if (Array.isArray(resource)) {
    const [resourceId, id] = resource;
    options.push({
      ...defOptions,
      resource: resourceId,
      id,
      ...overwriteOptions,
    });
  } else if (typeof resource === 'object') {
    options.push({ ...defOptions, ...resource, ...overwriteOptions });
  }
}
