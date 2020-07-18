import { Geometry, Feature, FeatureCollection } from 'geojson';
import {
  PropertiesFilter,
  FilterOptions,
  PropertyFilter,
} from '@nextgis/webmap';
import NgwConnector, {
  FeatureItem,
  RequestItemAdditionalParams,
  FeatureLayerField,
} from '@nextgis/ngw-connector';
import CancelablePromise from '@nextgis/cancelable-promise';
import {
  propertiesFilter,
  checkIfPropertyFilter,
} from '@nextgis/properties-filter';
import { FeatureRequestParams, GetNgwLayerItemsOptions } from '../interfaces';

export const FEATURE_REQUEST_PARAMS: FeatureRequestParams = {
  srs: 4326,
  geom_format: 'geojson',
};

export function createGeoJsonFeature<
  G extends Geometry | null = Geometry,
  P extends Record<string, any> = Record<string, any>
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

export function getNgwLayerItem<
  G extends Geometry | null = Geometry,
  P extends Record<string, any> = Record<string, any>
>(
  options: {
    resourceId: number;
    featureId: number;
    connector: NgwConnector;
  } & FilterOptions
): CancelablePromise<FeatureItem> {
  const params: FeatureRequestParams & { [name: string]: any } = {
    ...FEATURE_REQUEST_PARAMS,
  };
  return options.connector.get('feature_layer.feature.item', null, {
    id: options.resourceId,
    fid: options.featureId,
    ...params,
  });
}

export function getNgwLayerFeature<
  G extends Geometry | null = Geometry,
  P extends Record<string, any> = Record<string, any>
>(
  options: {
    resourceId: number;
    featureId: number;
    connector: NgwConnector;
  } & FilterOptions
): CancelablePromise<Feature<G, P>> {
  return getNgwLayerItem(options).then((item) => {
    return createGeoJsonFeature<G, P>(item);
  });
}

function idFilterWorkAround<
  G extends Geometry | null = Geometry,
  P extends Record<string, any> = Record<string, any>
>(options: { filterById: any; resourceId: number; connector: NgwConnector }) {
  const value = options.filterById[2];
  const featureIds: number[] =
    typeof value === 'number'
      ? [value]
      : value.split(',').map((x: string) => Number(x));
  if (options.filterById[1] !== 'eq' && options.filterById[1] !== 'in') {
    throw new Error(
      'Unable to filter by object id. Except `eq` or `in` operator'
    );
  }
  const promises: Promise<FeatureItem>[] = featureIds.map((featureId) => {
    return getNgwLayerItem<G, P>({
      connector: options.connector,
      resourceId: options.resourceId,
      featureId,
    });
  });
  return CancelablePromise.all(promises);
}

// NGW REST API is not able to filtering by combined queries
// therefore the filter is divided into several requests
function createFeatureFieldFilterQueries(
  opt: Required<GetNgwLayerItemsOptions> & FilterOptions,
  _queries: CancelablePromise<FeatureItem[]>[] = [],
  _parentAllParams: [string, any][] = []
): CancelablePromise<FeatureItem[]> {
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
          idFilterWorkAround({ filterById: f, connector, resourceId })
        );
      }
      if (checkIfPropertyFilter(f)) {
        _queries.push(
          getNgwLayerItemsRequest({
            ...opt,
            paramList: [..._parentAllParams, createParam(f)],
          })
        );
      } else {
        createFeatureFieldFilterQueries(
          {
            ...opt,
            filters: f,
          },
          _queries,
          [..._parentAllParams]
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
            [..._parentAllParams, ...filters]
          );
        });
      } else {
        _queries.push(
          getNgwLayerItemsRequest({
            ...opt,
            paramList: [..._parentAllParams, ...filters],
          })
        );
      }
    }
  }

  return CancelablePromise.all(_queries).then((itemsParts: FeatureItem[][]) => {
    const items = itemsParts.reduce((a, b) => a.concat(b), []);
    const offset = opt.offset !== undefined ? opt.offset : 0;
    const limit = opt.limit !== undefined ? opt.limit : items.length;
    if (opt.offset || opt.limit) {
      return items.splice(offset, limit);
    }
    return items;
  });
}

function getNgwLayerItemsRequest<
  G extends Geometry | null = Geometry,
  P extends Record<string, any> = Record<string, any>
>(
  options: GetNgwLayerItemsOptions &
    FilterOptions & { paramList?: [string, any][] }
): CancelablePromise<FeatureItem[]> {
  const params: FeatureRequestParams & RequestItemAdditionalParams = {
    ...FEATURE_REQUEST_PARAMS,
  };
  const {
    connector,
    limit,
    offset,
    fields,
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
  if (fields) {
    params.fields = fields.join();
  }
  if (intersects) {
    params.intersects = intersects;
  }
  if (paramList) {
    params.paramList = paramList;
  }
  if (orderBy) {
    params.order_by = orderBy.join(',');
  }
  return connector.get('feature_layer.feature.collection', null, {
    id: resourceId,
    ...params,
  });
}

export function getNgwLayerItems<
  G extends Geometry | null = Geometry,
  P extends Record<string, any> = Record<string, any>
>(
  options: GetNgwLayerItemsOptions & FilterOptions
): CancelablePromise<FeatureItem[]> {
  const filters = options.filters;
  if (filters) {
    return createFeatureFieldFilterQueries({ ...options, filters });
  } else {
    return getNgwLayerItemsRequest(options).then((data) => {
      if (filters) {
        // control
        return data.filter((y) => {
          const fields = y.fields;
          if (fields) {
            propertiesFilter(fields, filters);
          }
        });
      }
      return data;
    });
  }
}

export function getNgwLayerFeatures<
  G extends Geometry | null = Geometry,
  P extends Record<string, any> = Record<string, any>
>(
  options: {
    resourceId: number;
    connector: NgwConnector;
    filters?: PropertiesFilter;
  } & FilterOptions
): CancelablePromise<FeatureCollection<G, P>> {
  return getNgwLayerItems(options).then((x: FeatureItem[]) => {
    const features: Array<Feature<G, P>> = [];
    x.forEach((y) => {
      features.push(createGeoJsonFeature(y));
    });

    const featureCollection: FeatureCollection<G, P> = {
      type: 'FeatureCollection',
      features,
    };
    return featureCollection;
  });
}

export function prepareFieldsToNgw<T extends any>(
  item: T,
  resourceFields: Pick<FeatureLayerField, 'keyname' | 'datatype'>[]
): Record<keyof T, any> {
  const fields = {} as Record<keyof T, any>;
  resourceFields.forEach((x) => {
    if (x.keyname in item) {
      const keyname = x.keyname as keyof T;
      const property = item[keyname];
      let value: any;
      if (property !== undefined) {
        if (x.datatype === 'STRING') {
          value = String(property);
        } else if (x.datatype === 'BIGINT' || x.datatype === 'INTEGER') {
          value =
            typeof property === 'string' ? parseInt(property, 10) : property;
        } else if (x.datatype === 'REAL') {
          value =
            typeof property === 'string' ? parseFloat(property) : property;
        } else if (x.datatype === 'DATE') {
          let dt: Date | undefined;
          if (typeof property === 'object') {
            value = property;
          } else {
            if (property instanceof Date) {
              dt = property;
            } else {
              const parse = Date.parse(String(property));
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
            }
          }
        }
      }
      fields[keyname] = value ?? null;
    }
  });
  return fields;
}
