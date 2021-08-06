import { fetchNgwLayerFeatures } from './fetchNgwLayerFeatures';

import type { Geometry, FeatureCollection } from 'geojson';
import { FeatureProperties } from '@nextgis/ngw-connector';
import type CancelablePromise from '@nextgis/cancelable-promise';
import type { FetchNgwItemsOptions } from '../interfaces';

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
