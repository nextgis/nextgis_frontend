import { Geometry, Feature, FeatureCollection } from 'geojson';
import NgwConnector, { CancelablePromise, FeatureItem } from '@nextgis/ngw-connector';
import { PropertiesFilter, FilterOptions } from '@nextgis/webmap';

export interface FeatureRequestParams {
  srs?: number;
  geom_format?: string;
}

const featureRequestParams: FeatureRequestParams = {
  srs: 4326,
  geom_format: 'geojson'
};

function _createGeojsonFeature<G extends Geometry | null = Geometry>(
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
    ...featureRequestParams
  };
  if (options.limit) {
    params.limit = options.limit;
  }

  return options.connector
    .get('feature_layer.feature.item', null, {
      id: options.resourceId,
      fid: options.featureId,
      ...params
    })
    .then(item => {
      return _createGeojsonFeature<G>(item);
    });
}

export function getNgwLayerFeatures<G extends Geometry | null = Geometry>(
  options: {
    resourceId: number;
    connector: NgwConnector;
    filters?: PropertiesFilter[];
  } & FilterOptions
): CancelablePromise<FeatureCollection<G>> {
  const params: FeatureRequestParams & FilterOptions & { [name: string]: any } = {
    ...featureRequestParams
  };
  if (options.filters) {
    options.filters.forEach(([field, operation, value]) => {
      params[`fld_${field}__${operation}`] = `${value}`;
    });
  }
  if (options.limit) {
    params.limit = options.limit;
  }
  return options.connector
    .get('feature_layer.feature.collection', null, {
      id: options.resourceId,
      ...params
    })
    .then((x: FeatureItem[]) => {
      const features: Array<Feature<G>> = [];
      x.forEach(y => {
        features.push(_createGeojsonFeature(y));
      });

      const featureCollection: FeatureCollection<G> = {
        type: 'FeatureCollection',
        features
      };
      return featureCollection;
    });
}
