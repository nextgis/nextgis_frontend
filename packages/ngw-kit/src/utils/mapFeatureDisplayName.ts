import CancelablePromise from '@nextgis/cancelable-promise';
import type NgwConnector from '@nextgis/ngw-connector';
import type { ResourceDefinition } from '@nextgis/ngw-connector';
import { defined } from '../../../utils/src';

export interface MapFeatureDisplayNameOptions {
  connector: NgwConnector;
  resource?: ResourceDefinition;
  /**
   * @deprecated - use {@link MapFeatureDisplayNameOptions.resource} instead
   */
  resourceId?: number;
  fields: string[];
}

export function mapFeatureDisplayName({
  connector,
  resource,
  resourceId,
  fields,
}: MapFeatureDisplayNameOptions): CancelablePromise<string[]> {
  const id = resource || resourceId;
  if (!defined(id)) {
    throw new Error(
      'The `resource` or `resourceId` is required option for mapFeatureDisplayName function',
    );
  }
  return connector.getResource(id).then((res) => {
    const featureLayer = res && res.feature_layer;
    if (featureLayer) {
      return CancelablePromise.resolve(
        fields.map((x) => {
          const alias = featureLayer.fields.find((y) => y.keyname === x);
          return alias ? alias.display_name : x;
        }),
      );
    }
    return CancelablePromise.resolve(fields);
  });
}
