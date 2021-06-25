import { Geometry, Feature } from 'geojson';

import { FeatureItem } from '@nextgis/ngw-connector';
import CancelablePromise from '@nextgis/cancelable-promise';
import { FetchNgwItemsOptions } from '../interfaces';
import { fetchNgwLayerItems } from './fetchNgwLayerItems';
import { createGeoJsonFeature } from './featureLayerUtils';

export function fetchNgwLayerFeatures<
  G extends Geometry | null = Geometry,
  P extends { [field: string]: any } = { [field: string]: any },
>(options: FetchNgwItemsOptions<P>): CancelablePromise<Feature<G, P>[]> {
  return fetchNgwLayerItems(options).then((x: FeatureItem[]) => {
    const features: Array<Feature<G, P>> = [];
    x.forEach((y) => {
      features.push(createGeoJsonFeature(y));
    });

    return features;
  });
}
