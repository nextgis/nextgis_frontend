import { createGeoJsonFeature } from './featureLayerUtils';
import { fetchNgwLayerItem } from './fetchNgwLayerItem';

import type { Feature, Geometry } from 'geojson';

import type { FetchNgwItemOptions } from '../interfaces';

export async function fetchNgwLayerFeature<
  G extends Geometry = Geometry,
  P extends Record<string, any> = Record<string, any>,
>(options: FetchNgwItemOptions<P>): Promise<Feature<G, P>> {
  const item = await fetchNgwLayerItem<G, P>(options);
  return createGeoJsonFeature<G, P>(item);
}
