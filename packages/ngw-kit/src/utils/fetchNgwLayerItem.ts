import CancelablePromise from '@nextgis/cancelable-promise';

import {
  FEATURE_REQUEST_PARAMS,
  createGeoJsonFeature,
  updateItemRequestParam,
} from './featureLayerUtils';

import type {
  FeatureRequestParams,
  FetchNgwItemOptions,
  NgwFeatureItemResponse,
} from '../interfaces';
import type { FeatureProperties } from '@nextgis/utils';
import type { Geometry } from 'geojson';

export function fetchNgwLayerItem<
  G extends Geometry = Geometry,
  P extends FeatureProperties = FeatureProperties,
>(
  options: FetchNgwItemOptions<P>,
): CancelablePromise<NgwFeatureItemResponse<P, G>> {
  const params: FeatureRequestParams & { [name: string]: any } = {
    ...FEATURE_REQUEST_PARAMS,
  };
  updateItemRequestParam(params, options);
  const queryParams = {
    id: options.resourceId,
    fid: options.featureId,
    ...params,
  };
  const cache = options.cache || true;
  return options.connector
    .get('feature_layer.feature.item', { cache }, queryParams)
    .then((resp) => {
      return {
        ...resp,
        toGeojson: () => {
          if (resp.geom) {
            return CancelablePromise.resolve(createGeoJsonFeature<G, P>(resp));
          } else {
            return fetchNgwLayerItem({
              ...options,
              geom: true,
              fields: null,
              extensions: null,
            }).then((onlyGeomItem) => {
              const geom = onlyGeomItem.geom;
              return createGeoJsonFeature<G, P>({ ...resp, geom });
            });
          }
        },
      } as NgwFeatureItemResponse<P, G>;
    });
}
