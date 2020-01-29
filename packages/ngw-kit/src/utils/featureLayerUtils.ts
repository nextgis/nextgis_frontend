import { Geometry, Feature, FeatureCollection } from 'geojson';
import {
  PropertiesFilter,
  FilterOptions,
  PropertyFilter
} from '@nextgis/webmap';
import NgwConnector, {
  CancelablePromise,
  FeatureItem
} from '@nextgis/ngw-connector';

export interface FeatureRequestParams {
  srs?: number;
  fields?: string;
  geom_format?: string;
  limit?: number;
  intersects?: string;
}

const FEATURE_REQUEST_PARAMS: FeatureRequestParams = {
  srs: 4326,
  geom_format: 'geojson'
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
    geometry
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
    ...FEATURE_REQUEST_PARAMS
  };
  return options.connector.get('feature_layer.feature.item', null, {
    id: options.resourceId,
    fid: options.featureId,
    ...params
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
  return getNgwLayerItem(options).then(item => {
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
  const promises: Promise<FeatureItem>[] = featureIds.map(featureId => {
    return getNgwLayerItem<G, P>({
      connector: options.connector,
      resourceId: options.resourceId,
      featureId
    });
  });
  return CancelablePromise.all(promises);
}

export function getNgwLayerItems<
  G extends Geometry | null = Geometry,
  P extends Record<string, any> = Record<string, any>
>(
  options: {
    resourceId: number;
    connector: NgwConnector;
    filters?: PropertiesFilter;
  } & FilterOptions
): CancelablePromise<FeatureItem[]> {
  const params: FeatureRequestParams & { [name: string]: any } = {
    ...FEATURE_REQUEST_PARAMS
  };
  const { connector, filters, limit, fields, intersects, resourceId } = options;
  if (filters) {
    const filters_ = filters.filter(x => Array.isArray(x)) as PropertyFilter[];
    const filterById = filters_.find(x => x[0] === 'id');
    if (filterById) {
      return idFilterWorkAround({ filterById, connector, resourceId });
    }
    filters_.forEach(([field, operation, value]) => {
      params[`fld_${field}__${operation}`] = `${value}`;
    });
  }
  if (limit) {
    params.limit = limit;
  }
  if (fields) {
    params.fields = fields.join();
  }
  if (intersects) {
    params.intersects = intersects;
  }
  return connector.get('feature_layer.feature.collection', null, {
    id: resourceId,
    ...params
  });
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
    x.forEach(y => {
      features.push(createGeoJsonFeature(y));
    });

    const featureCollection: FeatureCollection<G, P> = {
      type: 'FeatureCollection',
      features
    };
    return featureCollection;
  });
}
