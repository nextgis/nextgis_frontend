import { Geometry, GeoJsonProperties } from 'geojson';

import NgwConnector, { FeatureItem } from '@nextgis/ngw-connector';
import CancelablePromise from '@nextgis/cancelable-promise';

import { FeatureRequestParams, NgwFeatureRequestOptions } from '../interfaces';
import { FEATURE_REQUEST_PARAMS } from './featureLayerUtils';

export function fetchNgwLayerItem<
  G extends Geometry = Geometry,
  P extends GeoJsonProperties = GeoJsonProperties
>(
  options: {
    resourceId: number;
    featureId: number;
    connector: NgwConnector;
  } & NgwFeatureRequestOptions
): CancelablePromise<FeatureItem<P, G>> {
  const params: FeatureRequestParams & { [name: string]: any } = {
    ...FEATURE_REQUEST_PARAMS,
  };
  return options.connector.get('feature_layer.feature.item', null, {
    id: options.resourceId,
    fid: options.featureId,
    ...params,
  }) as CancelablePromise<FeatureItem<P, G>>;
}
