import { fetchNgwLayerFeatures } from './fetchNgwLayerFeatures';

import type { FetchNgwItemsOptions } from '../interfaces';
import type CancelablePromise from '@nextgis/cancelable-promise';
import type { FeatureProperties } from '@nextgis/utils';
import type { FeatureCollection, Geometry } from 'geojson';

export function fetchNgwLayerFeatureCollection<
  G extends Geometry | null = Geometry,
  P extends FeatureProperties = FeatureProperties,
>(
  options: FetchNgwItemsOptions<P>,
): CancelablePromise<FeatureCollection<G, P>> {
  return fetchNgwLayerFeatures<G, P>(options).then((features) => {
    const featureCollection: FeatureCollection<G, P> = {
      type: 'FeatureCollection',
      features,
    };
    return featureCollection;
  });
}
