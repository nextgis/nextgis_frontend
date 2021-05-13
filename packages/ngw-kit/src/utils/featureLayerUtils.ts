import {
  Geometry,
  Feature,
  FeatureCollection,
  GeoJsonProperties,
} from 'geojson';

import NgwConnector, {
  FeatureItem,
  RequestItemAdditionalParams,
  FeatureLayerField,
} from '@nextgis/ngw-connector';
import CancelablePromise from '@nextgis/cancelable-promise';
import {
  checkIfPropertyFilter,
  PropertyFilter,
  PropertiesFilter,
} from '@nextgis/properties-filter';
import {
  FeatureRequestParams,
  GetNgwLayerItemsOptions,
  NgwFeatureRequestOptions,
} from '../interfaces';
import { defined, JsonMap } from '@nextgis/utils';
import { fetchNgwLayerItem } from './fetchNgwLayerItem';
import { fetchNgwLayerFeature } from './fetchNgwLayerFeature';
import { fetchNgwLayerFeatureCollection } from './fetchNgwLayerFeatureCollection';
import { fetchNgwLayerItems } from './fetchNgwLayerItems';

export const FEATURE_REQUEST_PARAMS: FeatureRequestParams = {
  srs: 4326,
  geom_format: 'geojson',
};

export function createGeoJsonFeature<
  G extends Geometry | null = Geometry,
  P extends GeoJsonProperties = GeoJsonProperties
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

/**
 * @deprecated use {@link fetchNgwLayerItem} instead
 */
export function getNgwLayerItem<
  G extends Geometry = Geometry,
  P extends GeoJsonProperties = GeoJsonProperties
>(
  options: {
    resourceId: number;
    featureId: number;
    connector: NgwConnector;
  } & NgwFeatureRequestOptions,
): CancelablePromise<FeatureItem<P, G>> {
  return fetchNgwLayerItem(options);
}

/**
 * @deprecated use {@link fetchNgwLayerFeature} instead
 */
export function getNgwLayerFeature<
  G extends Geometry = Geometry,
  P extends Record<string, any> = Record<string, any>
>(
  options: {
    resourceId: number;
    featureId: number;
    connector: NgwConnector;
  } & NgwFeatureRequestOptions,
): CancelablePromise<Feature<G, P>> {
  return fetchNgwLayerFeature(options);
}

/**
 * @deprecated use {@link fetchNgwLayerFeatures} instead
 */

export function getNgwLayerFeatures<
  G extends Geometry | null = Geometry,
  P extends { [field: string]: any } = { [field: string]: any }
>(
  options: {
    resourceId: number;
    connector: NgwConnector;
    filters?: PropertiesFilter;
  } & NgwFeatureRequestOptions<P>,
): CancelablePromise<FeatureCollection<G, P>> {
  return fetchNgwLayerFeatureCollection(options);
}

/**
 * @deprecated use {@link fetchNgwLayerItems} instead
 */
export function getNgwLayerItems<
  G extends Geometry = Geometry,
  P extends JsonMap = JsonMap
>(
  options: GetNgwLayerItemsOptions & NgwFeatureRequestOptions<P>,
): CancelablePromise<FeatureItem<P, G>[]> {
  return fetchNgwLayerItems(options);
}

export function updateItemRequestParam(
  params: FeatureRequestParams,
  options: NgwFeatureRequestOptions,
): void {
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

export function idFilterWorkAround<
  G extends Geometry = Geometry,
  P extends JsonMap = JsonMap
>(options: {
  filterById: PropertyFilter;
  resourceId: number;
  connector: NgwConnector;
}): CancelablePromise<FeatureItem<P, G>[]> {
  const value = options.filterById[2];
  const featureIds: number[] =
    typeof value === 'number'
      ? [value]
      : value.split(',').map((x: string) => Number(x));
  if (options.filterById[1] !== 'eq' && options.filterById[1] !== 'in') {
    throw new Error(
      'Unable to filter by object id. Except `eq` or `in` operator',
    );
  }
  const promises: Promise<FeatureItem<P, G>>[] = featureIds.map((featureId) => {
    return fetchNgwLayerItem<G, P>({
      connector: options.connector,
      resourceId: options.resourceId,
      featureId,
    });
  });
  return CancelablePromise.all(promises);
}

// NGW REST API is not able to filtering by combined queries
// therefore the filter is divided into several requests
export function createFeatureFieldFilterQueries<
  G extends Geometry = Geometry,
  P extends { [field: string]: any } = { [field: string]: any }
>(
  opt: Required<GetNgwLayerItemsOptions> & NgwFeatureRequestOptions<P>,
  _queries: CancelablePromise<FeatureItem<P, G>[]>[] = [],
  _parentAllParams: [string, any][] = [],
): CancelablePromise<FeatureItem<P, G>[]> {
  const { filters, connector, resourceId } = opt;

  const logic = typeof filters[0] === 'string' ? filters[0] : 'all';

  const filters_ = filters.filter((x) => Array.isArray(x)) as PropertyFilter[];

  const createParam = (pf: PropertyFilter): [string, any] => {
    const [field, operation, value] = pf;
    return [`fld_${field}__${operation}`, value];
  };

  if (logic === 'any') {
    filters_.forEach((f) => {
      if (f[0] === 'id') {
        _queries.push(
          idFilterWorkAround({ filterById: f, connector, resourceId }),
        );
      }
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
    const filterById = filters_.find((x) => x[0] === 'id');
    if (filterById) {
      _queries.push(idFilterWorkAround({ filterById, connector, resourceId }));
    } else {
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
  P extends { [field: string]: any } = { [field: string]: any }
>(
  options: GetNgwLayerItemsOptions &
    NgwFeatureRequestOptions<P> & { paramList?: [string, any][] },
): CancelablePromise<FeatureItem<P, G>[]> {
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
    params.limit = limit;
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

  return connector.get('feature_layer.feature.collection', null, {
    id: resourceId,
    ...params,
  }) as CancelablePromise<FeatureItem<P, G>[]>;
}

export function prepareFieldsToNgw<T extends GeoJsonProperties>(
  item: T,
  resourceFields: Pick<FeatureLayerField, 'keyname' | 'datatype'>[],
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
