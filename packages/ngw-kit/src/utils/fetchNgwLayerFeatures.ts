import { createGeoJsonFeature } from './featureLayerUtils';
import { fetchNgwLayerItems } from './fetchNgwLayerItems';

import type { FetchNgwItemsOptions } from '../interfaces';

import type { FeatureProperties } from '@nextgis/utils';
import type { Feature, Geometry } from 'geojson';

export async function fetchNgwLayerFeatures<
  G extends Geometry | null = Geometry,
  P extends FeatureProperties = FeatureProperties,
>(options: FetchNgwItemsOptions<P>): Promise<Feature<G, P>[]> {
  const x = await fetchNgwLayerItems(options);
  const features: Array<Feature<G, P>> = [];
  x.forEach((y) => {
    features.push(createGeoJsonFeature(y));
  });
  return features;
}
