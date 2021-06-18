import { propertiesFilter } from '@nextgis/properties-filter';
import CancelablePromise from '@nextgis/cancelable-promise';
import {
  createFeatureFieldFilterQueries,
  fetchNgwLayerItemsRequest,
} from './featureLayerUtils';

import type { Geometry } from 'geojson';
import type { FeatureItem, FeatureProperties } from '@nextgis/ngw-connector';
import type { FetchNgwItemsOptions } from '../interfaces';

export function fetchNgwLayerItems<
  G extends Geometry = Geometry,
  P extends FeatureProperties = FeatureProperties
>(options: FetchNgwItemsOptions<P>): CancelablePromise<FeatureItem<P, G>[]> {
  const filters = options.filters;
  if (filters) {
    return createFeatureFieldFilterQueries({
      ...options,
      filters,
    }) as CancelablePromise<FeatureItem<P, G>[]>;
  } else {
    return fetchNgwLayerItemsRequest<G, P>(options).then((data) => {
      if (filters) {
        // client-side filter check
        return data.filter((y) => {
          const fields = y.fields;
          if (fields) {
            propertiesFilter(fields, filters);
          }
        });
      }
      return data;
    }) as CancelablePromise<FeatureItem<P, G>[]>;
  }
}
