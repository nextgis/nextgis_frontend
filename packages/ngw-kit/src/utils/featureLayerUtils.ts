import CancelablePromise from '@nextgis/cancelable-promise';
import {
  isPropertyFilter,
  PropertiesFilter,
  PropertyFilter,
} from '@nextgis/properties-filter';
import {
  round,
  defined,
  degrees2meters,
  isLngLatBoundsArray,
  getBoundsCoordinates,
} from '@nextgis/utils';

import type { Geometry, Feature } from 'geojson';
import type {
  RequestItemAdditionalParams,
  FeatureItem,
} from '@nextgis/ngw-connector';
import type { LngLatArray, FeatureProperties } from '@nextgis/utils';
import type {
  NgwFeatureRequestOptions,
  FeatureRequestParams,
  FetchNgwItemsOptions,
} from '../interfaces';

export const FEATURE_REQUEST_PARAMS: FeatureRequestParams = {
  srs: 4326,
  geom_format: 'geojson',
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
  const { extensions, geom, fields, srs } = options;
  params.extensions = extensions ? extensions.join(',') : '';
  if (fields !== undefined) {
    params.fields = Array.isArray(fields) ? fields.join(',') : '';
  }
  if (geom !== undefined) {
    params.geom = geom ? 'yes' : 'no';
    if (!geom) {
      delete params.srs;
      delete params.geom_format;
    }
  }
  if (defined(srs)) {
    params.srs = srs;
  }
}

// NGW REST API is not able to filtering by combined queries
// therefore the filter is divided into several requests
export function createFeatureFieldFilterQueries<
  G extends Geometry = Geometry,
  P extends { [field: string]: any } = { [field: string]: any },
>(
  opt: FetchNgwItemsOptions<P> &
    Required<Pick<FetchNgwItemsOptions, 'filters'>>,
): CancelablePromise<FeatureItem<P, G>[]> {
  const queries: CancelablePromise<FeatureItem<P, G>[]>[] = getQueries<G, P>(
    opt,
  );

  return CancelablePromise.all(queries).then((itemsParts) => {
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
  });
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
  _queries: CancelablePromise<FeatureItem<P, G>[]>[] = [],
  _parentAllParams: [string, any][] = [],
): CancelablePromise<FeatureItem<P, G>[]>[] {
  const { filters } = opt;

  const logic = typeof filters[0] === 'string' ? filters[0] : 'all';

  const filters_ = filters.filter((x) => Array.isArray(x)) as PropertyFilter[];

  if (logic === 'any') {
    for (const f of filters_) {
      if (isPropertyFilter(f)) {
        _queries.push(
          fetchNgwLayerItemsRequest<G, P>({
            ...opt,
            paramList: [..._parentAllParams, createParam(f)],
          }),
        );
      } else {
        getQueries(
          {
            ...opt,
            filters: f,
          },
          _queries,
          [..._parentAllParams],
        );
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
        getQueries(
          {
            ...opt,
            filters: x,
          },
          _queries,
          [..._parentAllParams, ...filters],
        );
      }
    } else {
      _queries.push(
        fetchNgwLayerItemsRequest<G, P>({
          ...opt,
          paramList: [..._parentAllParams, ...filters],
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
>(options: FetchNgwItemsOptions<P>): CancelablePromise<FeatureItem<P, G>[]> {
  const params: FeatureRequestParams & RequestItemAdditionalParams = {
    ...FEATURE_REQUEST_PARAMS,
  };
  const {
    limit,
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
  if (limit) {
    if (limit !== Number.POSITIVE_INFINITY) {
      params.limit = limit;
    }
  } else {
    // Strict restriction on loading data from large layers
    params.limit = 7000;
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
    params.paramList = paramList;
  }
  const reqParams = {
    id: resourceId,
    ...params,
  };

  return connector.get(
    'feature_layer.feature.collection',
    { cache, signal },
    reqParams,
  ) as CancelablePromise<FeatureItem<P, G>[]>;
}
