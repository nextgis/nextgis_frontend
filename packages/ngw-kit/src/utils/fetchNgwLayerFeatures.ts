import { createGeoJsonFeature } from './featureLayerUtils';
import { fetchNgwLayerItems } from './fetchNgwLayerItems';

import type { FetchNgwItemsOptions } from '../interfaces';
import type { FeatureItem } from '@nextgis/ngw-connector';
import type { FeatureProperties } from '@nextgis/utils';
import type { Feature, Geometry } from 'geojson';

export function fetchNgwLayerFeatures<
  G extends Geometry | null = Geometry,
  P extends FeatureProperties = FeatureProperties,
>(options: FetchNgwItemsOptions<P>): Promise<Feature<G, P>[]> {
  return fetchNgwLayerItems(options).then((x: FeatureItem[]) => {
    const features: Array<Feature<G, P>> = [];
    x.forEach((y) => {
      features.push(createGeoJsonFeature(y));
    });

    return features;
  });
}
