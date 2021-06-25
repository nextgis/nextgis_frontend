import { Geometry, FeatureCollection } from 'geojson';

import NgwConnector from '@nextgis/ngw-connector';
import CancelablePromise from '@nextgis/cancelable-promise';
import { PropertiesFilter } from '@nextgis/properties-filter';
import { NgwFeatureRequestOptions } from '../interfaces';

import { fetchNgwLayerFeatures } from './fetchNgwLayerFeatures';

export function fetchNgwLayerFeatureCollection<
  G extends Geometry | null = Geometry,
  P extends { [field: string]: any } = { [field: string]: any },
>(
  options: {
    resourceId: number;
    connector: NgwConnector;
    filters?: PropertiesFilter;
  } & NgwFeatureRequestOptions<P>,
): CancelablePromise<FeatureCollection<G, P>> {
  return fetchNgwLayerFeatures<G, P>(options).then((features) => {
    const featureCollection: FeatureCollection<G, P> = {
      type: 'FeatureCollection',
      features,
    };
    return featureCollection;
  });
}
