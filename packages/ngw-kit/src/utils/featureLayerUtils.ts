import { isPropertyFilter } from '@nextgis/properties-filter';
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
import type {
  PropertiesFilter,
  PropertyFilter,
} from '@nextgis/properties-filter';
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

// NGW REST API is not able to filtering by combined queries
// therefore the filter is divided into several requests
export async function createFeatureFieldFilterQueries<
  G extends Geometry = Geometry,
  P extends { [field: string]: any } = { [field: string]: any },
>(
  opt: FetchNgwItemsOptions<P> &
    Required<Pick<FetchNgwItemsOptions, 'filters'>>,
): Promise<FeatureItem<P, G>[]> {
  const queries: Promise<FeatureItem<P, G>[]>[] = getQueries<G, P>(opt);

  const itemsParts = await Promise.all(queries);
  // this list of ids used for optimization
  const ids: number[] = [];
  const items: FeatureItem<P, G>[] = [];
  for (const part of itemsParts) {
    for (const item of part) {
      if (!ids.includes(item.id)) {
        items.push(item);
        ids.push(item.id);
      }
    }
  }
  const offset = opt.offset !== undefined ? opt.offset : 0;
  const limit = opt.limit !== undefined ? opt.limit : items.length;
  if (opt.offset || opt.limit) {
    return items.splice(offset, limit);
  }
  return items;
}

function createParam(pf: PropertyFilter): [string, any] {
  const [field, operation, value] = pf;
  const isFldStr = field !== 'id' ? 'fld_' : '';
  let vStart = '';
  let vEnd = '';
  const field_ = String(field)
    .trim()
    .replace(/^(%?)(.+?)(%?)$/, (m, a, b, c) => {
      vStart = a;
      vEnd = c;
      return b;
    });
  const v = vStart + value + vEnd;
  return [`${isFldStr}${field_}__${operation}`, v];
}

function getQueries<
  G extends Geometry = Geometry,
  P extends { [field: string]: any } = { [field: string]: any },
>(
  opt: FetchNgwItemsOptions<P> &
    Required<Pick<FetchNgwItemsOptions, 'filters'>>,
  _queries: Promise<FeatureItem<P, G>[]>[] = [],
  _parentAllParams: [string, any][] = [],
): Promise<FeatureItem<P, G>[]>[] {
  const { filters } = opt;
  const paramList = opt.paramList ?? [];

  const logic = typeof filters[0] === 'string' ? filters[0] : 'all';
  const filters_ = filters.filter((x) => Array.isArray(x)) as PropertyFilter[];

  if (logic === 'any') {
    for (const f of filters_) {
      if (isPropertyFilter(f)) {
        _queries.push(
          fetchNgwLayerItemsRequest<G, P>({
            ...opt,
            paramList: [..._parentAllParams, ...paramList, createParam(f)],
          }),
        );
      } else {
        getQueries({ ...opt, filters: f }, _queries, [..._parentAllParams]);
      }
    }
  } else if (logic === 'all') {
    const filters: [string, any][] = [];
    const propertiesFilterList: PropertiesFilter[] = [];
    for (const f of filters_) {
      if (isPropertyFilter(f)) {
        filters.push(createParam(f));
      } else {
        propertiesFilterList.push(f);
      }
    }

    if (propertiesFilterList.length) {
      for (const x of propertiesFilterList) {
        getQueries({ ...opt, filters: x }, _queries, [
          ..._parentAllParams,
          ...filters,
        ]);
      }
    } else {
      _queries.push(
        fetchNgwLayerItemsRequest<G, P>({
          ...opt,
          paramList: [..._parentAllParams, ...paramList, ...filters],
        }),
      );
    }
  }
  return _queries;
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
