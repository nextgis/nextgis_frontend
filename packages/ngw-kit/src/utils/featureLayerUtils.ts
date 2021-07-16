import CancelablePromise from '@nextgis/cancelable-promise';
import {
  checkIfPropertyFilter,
  PropertyFilter,
  PropertiesFilter,
} from '@nextgis/properties-filter';
import { defined } from '@nextgis/utils';

import type { Geometry, Feature } from 'geojson';
import type {
  FeatureItem,
  RequestItemAdditionalParams,
  FeatureProperties,
} from '@nextgis/ngw-connector';
import type {
  FeatureRequestParams,
  FetchNgwItemsOptions,
  NgwFeatureRequestOptions,
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
    id: item.id,
    type: 'Feature',
    properties: item.fields as P,
    geometry,
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
  _queries: CancelablePromise<FeatureItem<P, G>[]>[] = [],
  _parentAllParams: [string, any][] = [],
): CancelablePromise<FeatureItem<P, G>[]> {
  const { filters } = opt;

  const logic = typeof filters[0] === 'string' ? filters[0] : 'all';

  const filters_ = filters.filter((x) => Array.isArray(x)) as PropertyFilter[];

  const createParam = (pf: PropertyFilter): [string, any] => {
    const [field, operation, value] = pf;
    const isFldStr = field !== 'id' ? 'fld_' : '';
    return [`${isFldStr}${field}__${operation}`, value];
  };

  if (logic === 'any') {
    filters_.forEach((f) => {
      if (checkIfPropertyFilter(f)) {
        _queries.push(
          fetchNgwLayerItemsRequest<G, P>({
            ...opt,
            paramList: [..._parentAllParams, createParam(f)],
          }),
        );
      } else {
        createFeatureFieldFilterQueries(
          {
            ...opt,
            filters: f,
          },
          _queries,
          [..._parentAllParams],
        );
      }
    });
  } else if (logic === 'all') {
    const filters: [string, any][] = [];
    const propertiesFilterList: PropertiesFilter[] = [];
    filters_.forEach((f) => {
      if (checkIfPropertyFilter(f)) {
        filters.push(createParam(f));
      } else {
        propertiesFilterList.push(f);
      }
    });

    if (propertiesFilterList.length) {
      propertiesFilterList.forEach((x) => {
        createFeatureFieldFilterQueries(
          {
            ...opt,
            filters: x,
          },
          _queries,
          [..._parentAllParams, ...filters],
        );
      });
    } else {
      _queries.push(
        fetchNgwLayerItemsRequest<G, P>({
          ...opt,
          paramList: [..._parentAllParams, ...filters],
        }),
      );
    }
  }

  return CancelablePromise.all(_queries).then((itemsParts) => {
    const items = itemsParts.reduce((a, b) => a.concat(b), []);
    const offset = opt.offset !== undefined ? opt.offset : 0;
    const limit = opt.limit !== undefined ? opt.limit : items.length;
    if (opt.offset || opt.limit) {
      return items.splice(offset, limit);
    }
    return items;
  });
}

export function fetchNgwLayerItemsRequest<
  G extends Geometry = Geometry,
  P extends { [field: string]: any } = { [field: string]: any },
>(options: FetchNgwItemsOptions<P>): CancelablePromise<FeatureItem<P, G>[]> {
  const params: FeatureRequestParams & RequestItemAdditionalParams = {
    ...FEATURE_REQUEST_PARAMS,
  };
  const {
    connector,
    limit,
    offset,
    intersects,
    orderBy,
    resourceId,
    paramList,
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
  // TODO: fix type for options
  updateItemRequestParam(params, options as { [field: string]: any });

  if (orderBy) {
    params.order_by = orderBy.join(',');
  }
  if (intersects) {
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
    { cache: options.cache },
    reqParams,
  ) as CancelablePromise<FeatureItem<P, G>[]>;
}

export function prepareFieldsToNgw<
  T extends FeatureProperties = FeatureProperties,
>(
  item: T,
  resourceFields: Pick<FeatureProperties, 'keyname' | 'datatype'>[],
): Record<keyof T, any> {
  const fields = {} as Record<keyof T, any>;
  if (item) {
    resourceFields.forEach((x) => {
      if (x.keyname in item) {
        const keyname = x.keyname;
        const prop = item[keyname];
        let value: any;
        if (prop !== undefined) {
          if (x.datatype === 'STRING') {
            value = prop ? String(prop) : null;
            // TODO: remove after v 3.0.0. For backward compatibility
            if (value === 'null') {
              value = null;
            }
          } else if (x.datatype === 'BIGINT' || x.datatype === 'INTEGER') {
            value = typeof prop === 'string' ? parseInt(prop, 10) : prop;
          } else if (x.datatype === 'REAL') {
            value = typeof prop === 'string' ? parseFloat(prop) : prop;
          } else if (x.datatype === 'BOOLEAN') {
            value =
              typeof prop === 'boolean' || typeof prop === 'number'
                ? Number(!!prop)
                : null;
          } else if (x.datatype === 'DATE' || x.datatype === 'DATETIME') {
            let dt: Date | undefined;
            if (typeof prop === 'object' && !((prop as any) instanceof Date)) {
              value = prop;
            } else {
              if ((prop as any) instanceof Date) {
                dt = prop as any;
              } else {
                const parse = Date.parse(String(prop));
                if (parse) {
                  dt = new Date(parse);
                }
              }
              if (dt) {
                value = {
                  year: dt.getFullYear(),
                  month: dt.getMonth(),
                  day: dt.getDay(),
                };
                if (x.datatype === 'DATETIME') {
                  value.hour = dt.getHours();
                  value.minute = dt.getMinutes();
                  value.second = dt.getSeconds();
                }
              }
            }
          }
        }
        fields[keyname as keyof T] = value ?? null;
      }
    });
  }
  return fields;
}
