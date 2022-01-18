import { propertiesFilter } from '@nextgis/properties-filter';
import CancelablePromise from '@nextgis/cancelable-promise';
import {
  createFeatureFieldFilterQueries,
  fetchNgwLayerItemsRequest,
} from './featureLayerUtils';
import { prepareNgwFieldsToPropertiesFilter } from './prepareNgwFieldsToPropertiesFilter';

import type { Geometry } from 'geojson';
import type { FeatureItem } from '@nextgis/ngw-connector';
import type { FetchNgwItemsOptions } from '../interfaces';
import type { FeatureProperties } from '@nextgis/utils';

export function fetchNgwLayerItems<
  G extends Geometry = Geometry,
  P extends FeatureProperties = FeatureProperties,
>(options: FetchNgwItemsOptions<P>): CancelablePromise<FeatureItem<P, G>[]> {
  const filters = options.filters;
  if (filters) {
    return createFeatureFieldFilterQueries({
      ...options,
      filters,
    }).then((data) => {
      // Additional client-side filter check
      data = data.filter((y) => {
        const fields = prepareNgwFieldsToPropertiesFilter({ ...y.fields });
        const result = propertiesFilter(fields, filters);
        return result;
      });
      return data;
    }) as CancelablePromise<FeatureItem<P, G>[]>;
  } else {
    return fetchNgwLayerItemsRequest<G, P>(options);
  }
}
