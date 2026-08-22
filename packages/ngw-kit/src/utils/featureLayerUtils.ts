import {
  defined,
  degrees2meters,
  getBoundsCoordinates,
  isLngLatBoundsArray,
  round,
} from '@nextgis/utils';

import type {
  FeatureItem,
  RequestItemAdditionalParams,
} from '@nextgis/ngw-connector';
import type { FeatureProperties, LngLatArray } from '@nextgis/utils';
import type { Feature, Geometry } from 'geojson';

import type {
  FeatureRequestParams,
  FetchNgwItemsOptions,
  NgwFeatureRequestOptions,
} from '../interfaces';

export const FEATURE_REQUEST_PARAMS: FeatureRequestParams = {
  srs: 4326,
  geom_format: 'geojson',
  dt_format: 'iso',
};

export function createGeoJsonFeature<
  G extends Geometry | null = Geometry,
  P extends FeatureProperties = FeatureProperties,
>(item: Pick<FeatureItem, 'id' | 'geom' | 'fields'>): Feature<G, P> {
  const geometry = item.geom as G;
  const feature: Feature<G, P> = {
    geometry,
    id: item.id,
    type: 'Feature',
    properties: item.fields as P,
  };
  return feature;
}

export function updateItemRequestParam<
  P extends FeatureProperties = FeatureProperties,
>(params: FeatureRequestParams, options: NgwFeatureRequestOptions<P>): void {
  const { extensions, geom, fields, srs, ilike, like } = options;
  // Empty extesions by default
  params.extensions = extensions ? extensions : [];

  if (fields) {
    params.fields = fields as string[];
  }
  if (geom !== undefined) {
    params.geom = geom;
    if (!geom) {
      delete params.srs;
      delete params.geom_format;
    }
  }
  if (defined(ilike)) {
    // @ts-expect-error check ngw typegen
    params.ilike = ilike;
  } else if (defined(like)) {
    // @ts-expect-error check ngw typegen
    params.like = like;
  }
  if (defined(srs)) {
    params.srs = srs;
  }
}

function paramListToQuery(paramList: [string, any][]): Record<string, any> {
  return paramList.reduce(
    (acc, [key, value]) => {
      acc[key] = value;
      return acc;
    },
    {} as Record<string, any>,
  );
}

function createWktFromCoordArray(coord: LngLatArray[]): string {
  const polygon = coord.map(([lng, lat]) => {
    const [x, y] = degrees2meters(lng, lat).map((c) => round(c));
    return x + ' ' + y;
  });
  return `POLYGON((${polygon.join(', ')}))`;
}

export function fetchNgwLayerItemsRequest<
  G extends Geometry = Geometry,
  P extends { [field: string]: any } = { [field: string]: any },
>(options: FetchNgwItemsOptions<P>): Promise<FeatureItem<P, G>[]> {
  const params: FeatureRequestParams & RequestItemAdditionalParams = {
    ...FEATURE_REQUEST_PARAMS,
  };
  const {
    limit,
    query,
    cache,
    signal,
    offset,
    orderBy,
    paramList,
    connector,
    geomFormat,
    intersects,
    resourceId,
  } = options;

  if (typeof limit === 'number' && limit !== Number.POSITIVE_INFINITY) {
    params.limit = limit;
  }

  if (offset) {
    params.offset = offset;
  }

  if (geomFormat) {
    params.geom_format = geomFormat;
  }

  updateItemRequestParam(params, options);

  if (orderBy) {
    params.order_by = orderBy.join(',');
  }

  if (Array.isArray(intersects)) {
    const coordinates = isLngLatBoundsArray(intersects)
      ? getBoundsCoordinates(intersects)
      : intersects;
    params.intersects = createWktFromCoordArray(coordinates);
  } else if (typeof intersects === 'string') {
    params.intersects = intersects;
  }

  if (paramList) {
    Object.assign(params, paramListToQuery(paramList));
  }

  return connector
    .route('feature_layer.feature.collection', { id: Number(resourceId) })
    .get({ query: { ...params, ...query }, cache, signal }) as Promise<
    FeatureItem<P, G>[]
  >;
}
