import { Geometry, Feature, FeatureCollection } from 'geojson';
import NgwConnector, { CancelablePromise, FeatureItem } from '@nextgis/ngw-connector';
import { PropertiesFilter, FilterOptions } from '@nextgis/webmap';

export interface FeatureRequestParams {
  srs?: number;
  geom_format?: string;
}

const FEATURE_REQUEST_PARAMS: FeatureRequestParams = {
  srs: 4326,
  geom_format: 'geojson'
};

export function createGeoJsonFeature<G extends Geometry | null = Geometry>(
  item: FeatureItem
): Feature<G> {
  const geometry = item.geom as G;
  const feature: Feature<G> = {
    id: item.id,
    type: 'Feature',
    properties: item.fields,
    geometry
  };
  return feature;
}

export function getNgwLayerFeature<G extends Geometry | null = Geometry>(
  options: {
    resourceId: number;
    featureId: number;
    connector: NgwConnector;
  } & FilterOptions
): CancelablePromise<Feature<G>> {
  const params: FeatureRequestParams & FilterOptions & { [name: string]: any } = {
    ...FEATURE_REQUEST_PARAMS
  };

  return options.connector
    .get('feature_layer.feature.item', null, {
      id: options.resourceId,
      fid: options.featureId,
      ...params
    })
    .then(item => {
      return createGeoJsonFeature<G>(item);
    });
}

export function getNgwLayerFeatures<G extends Geometry | null = Geometry>(
  options: {
    resourceId: number;
    connector: NgwConnector;
    filters?: PropertiesFilter;
  } & FilterOptions
): CancelablePromise<FeatureCollection<G>> {
  const params: FeatureRequestParams & FilterOptions & { [name: string]: any } = {
    ...FEATURE_REQUEST_PARAMS
  };
  const { connector, filters, limit, resourceId } = options;
  if (filters) {
    const filterById = filters.find(x => x[0] === 'id');
    if (filterById) {
      if (filterById[1] === 'eq') {
        return getNgwLayerFeature<G>({
          connector,
          resourceId,
          featureId: filterById[2]
        }).then(feature => {
          const featureCollection: FeatureCollection<G> = {
            type: 'FeatureCollection',
            features: [feature]
          };
          return featureCollection;
        });
      } else {
        throw new Error('Unable to filter by object id except `eq` operator');
      }
    }
    filters.forEach(([field, operation, value]) => {
      params[`fld_${field}__${operation}`] = `${value}`;
    });
  }
  if (limit) {
    params.limit = limit;
  }
  return connector
    .get('feature_layer.feature.collection', null, {
      id: resourceId,
      ...params
    })
    .then((x: FeatureItem[]) => {
      const features: Array<Feature<G>> = [];
      x.forEach(y => {
        features.push(createGeoJsonFeature(y));
      });

      const featureCollection: FeatureCollection<G> = {
        type: 'FeatureCollection',
        features
      };
      return featureCollection;
    });
}
