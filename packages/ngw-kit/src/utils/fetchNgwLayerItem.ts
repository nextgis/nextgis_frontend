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

export async function fetchNgwLayerItem<
  G extends Geometry = Geometry,
  P extends FeatureProperties = FeatureProperties,
>(options: FetchNgwItemOptions<P>): Promise<NgwFeatureItemResponse<P, G>> {
  const params: FeatureRequestParams & { [name: string]: any } = {
    ...FEATURE_REQUEST_PARAMS,
  };
  updateItemRequestParam(params, options);
  const queryParams = {
    id: options.resourceId,
    fid: options.featureId,
    ...params,
  };

  const resp = await options.connector.get(
    'feature_layer.feature.item',
    options,
    queryParams,
  );

  const toGeojson = async () => {
    if (resp.geom) {
      return createGeoJsonFeature<G, P>(resp);
    } else {
      const onlyGeomItem = await fetchNgwLayerItem({
        ...options,
        geom: true,
        fields: null,
        extensions: null,
      });
      const geom = onlyGeomItem.geom;
      return createGeoJsonFeature<G, P>({ ...resp, geom });
    }
  };

  return {
    ...resp,
    toGeojson,
  } as NgwFeatureItemResponse<P, G>;
}
