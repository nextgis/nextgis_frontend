import { createGeoJsonFeature } from './featureLayerUtils';
import { fetchNgwLayerItem } from './fetchNgwLayerItem';

import type { FetchNgwItemOptions } from '../interfaces';
import type { Feature, Geometry } from 'geojson';

export function fetchNgwLayerFeature<
  G extends Geometry = Geometry,
  P extends Record<string, any> = Record<string, any>,
>(options: FetchNgwItemOptions<P>): Promise<Feature<G, P>> {
  return fetchNgwLayerItem<G, P>(options).then((item) => {
    return createGeoJsonFeature<G, P>(item);
  });
}
