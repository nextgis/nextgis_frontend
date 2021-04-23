import { Geometry, Feature } from 'geojson';

import NgwConnector from '@nextgis/ngw-connector';
import CancelablePromise from '@nextgis/cancelable-promise';

import { NgwFeatureRequestOptions } from '../interfaces';
import { fetchNgwLayerItem } from './fetchNgwLayerItem';
import { createGeoJsonFeature } from './featureLayerUtils';

export function fetchNgwLayerFeature<
  G extends Geometry = Geometry,
  P extends Record<string, any> = Record<string, any>
>(
  options: {
    resourceId: number;
    featureId: number;
    connector: NgwConnector;
  } & NgwFeatureRequestOptions,
): CancelablePromise<Feature<G, P>> {
  return fetchNgwLayerItem<G, P>(options).then((item) => {
    return createGeoJsonFeature<G, P>(item);
  });
}
