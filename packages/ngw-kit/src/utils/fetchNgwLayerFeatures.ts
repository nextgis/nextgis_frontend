import { fetchNgwLayerItems } from './fetchNgwLayerItems';
import { createGeoJsonFeature } from './featureLayerUtils';

import type { Geometry, Feature } from 'geojson';
import type CancelablePromise from '@nextgis/cancelable-promise';
import type { FeatureItem, FeatureProperties } from '@nextgis/ngw-connector';
import type { FetchNgwItemsOptions } from '../interfaces';

export function fetchNgwLayerFeatures<
  G extends Geometry | null = Geometry,
  P extends FeatureProperties = FeatureProperties,
>(options: FetchNgwItemsOptions<P>): CancelablePromise<Feature<G, P>[]> {
  return fetchNgwLayerItems(options).then((x: FeatureItem[]) => {
    const features: Array<Feature<G, P>> = [];
    x.forEach((y) => {
      features.push(createGeoJsonFeature(y));
    });

    return features;
  });
}
