import { Geometry } from 'geojson';

import CancelablePromise from '@nextgis/cancelable-promise';

import type { FeatureProperties } from '@nextgis/ngw-connector';
import {
  FeatureRequestParams,
  GetNgwItemOptions,
  NgwFeatureItemResponse,
  NgwFeatureRequestOptions,
} from '../interfaces';
import {
  createGeoJsonFeature,
  FEATURE_REQUEST_PARAMS,
  updateItemRequestParam,
} from './featureLayerUtils';

export function fetchNgwLayerItem<
  G extends Geometry = Geometry,
  P extends FeatureProperties = FeatureProperties
>(
  options: GetNgwItemOptions & NgwFeatureRequestOptions,
): CancelablePromise<NgwFeatureItemResponse<P, G>> {
  const params: FeatureRequestParams & { [name: string]: any } = {
    ...FEATURE_REQUEST_PARAMS,
  };
  updateItemRequestParam(params, options);
  return options.connector
    .get('feature_layer.feature.item', null, {
      id: options.resourceId,
      fid: options.featureId,
      ...params,
    })
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
