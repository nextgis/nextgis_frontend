import { fetchNgwLayerItem } from './fetchNgwLayerItem';
import { createGeoJsonFeature } from './featureLayerUtils';

import type { Geometry, Feature } from 'geojson';
import type CancelablePromise from '@nextgis/cancelable-promise';
import type { FetchNgwItemOptions } from '../interfaces';

export function fetchNgwLayerFeature<
  G extends Geometry = Geometry,
  P extends Record<string, any> = Record<string, any>,
>(options: FetchNgwItemOptions<P>): CancelablePromise<Feature<G, P>> {
  return fetchNgwLayerItem<G, P>(options).then((item) => {
    return createGeoJsonFeature<G, P>(item);
  });
}
