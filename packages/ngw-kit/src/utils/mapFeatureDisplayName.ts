import { defined } from '../../../utils/src';

import type NgwConnector from '@nextgis/ngw-connector';
import type { ResourceDefinition } from '@nextgis/ngw-connector';

export interface MapFeatureDisplayNameOptions {
  connector: NgwConnector;
  resource?: ResourceDefinition;
  /**
   * @deprecated - use {@link MapFeatureDisplayNameOptions.resource} instead
   */
  resourceId?: number;
  fields: string[];
  signal?: AbortSignal;
  cache?: boolean;
}

export function mapFeatureDisplayName({
  connector,
  resource,
  resourceId,
  fields,
  signal,
  cache,
}: MapFeatureDisplayNameOptions): Promise<string[]> {
  const id = resource || resourceId;
  if (!defined(id)) {
    throw new Error(
      'The `resource` or `resourceId` is required option for mapFeatureDisplayName function',
    );
  }
  return connector.getResource(id, { signal, cache }).then((res) => {
    const featureLayer = res && res.feature_layer;
    if (featureLayer) {
      return Promise.resolve(
        fields.map((x) => {
          const alias = featureLayer.fields.find((y) => y.keyname === x);
          return alias ? alias.display_name : x;
        }),
      );
    }
    return Promise.resolve(fields);
  });
}
