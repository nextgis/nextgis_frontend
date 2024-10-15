import {
  FEATURE_REQUEST_PARAMS,
  createGeoJsonFeature,
  updateItemRequestParam,
} from './featureLayerUtils';

import type {
  FetchNgwItemOptions,
  NgwFeatureItemResponse,
} from '../interfaces';
import type { FeatureProperties } from '@nextgis/utils';
import type Routes from '@nextgisweb/pyramid/type/route';
import type { Geometry } from 'geojson';

export async function fetchNgwLayerItem<
  G extends Geometry = Geometry,
  P extends FeatureProperties = FeatureProperties,
>(options: FetchNgwItemOptions<P>): Promise<NgwFeatureItemResponse<P, G>> {
  const params: Routes['feature_layer.feature.item']['get']['query'] = {
    ...FEATURE_REQUEST_PARAMS,
  };
  updateItemRequestParam(params, options);

  const resp = await options.connector
    .route('feature_layer.feature.item', {
      id: Number(options.resourceId),
      fid: options.featureId,
    })
    .get({ ...options, query: params });

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
