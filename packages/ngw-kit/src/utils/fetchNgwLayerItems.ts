import { propertiesFilter } from '@nextgis/properties-filter';
import CancelablePromise from '@nextgis/cancelable-promise';
import {
  createFeatureFieldFilterQueries,
  fetchNgwLayerItemsRequest,
} from './featureLayerUtils';
import { prepareNgwFieldsToPropertiesFilter } from './prepareNgwFieldsToPropertiesFilter';

import type { Geometry } from 'geojson';
import type { FeatureItem } from '@nextgis/ngw-connector';
import type { FeatureProperties } from '@nextgis/utils';
import type { FetchNgwItemsOptions } from '../interfaces';

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
      const clientFilterValidate = options.clientFilterValidate ?? true;
      // Additional client-side filter check
      if (clientFilterValidate) {
        data = data.filter((y) => {
          const fields = prepareNgwFieldsToPropertiesFilter({ ...y.fields, id: y.id });
          const result = propertiesFilter(fields, filters);
          return result;
        });
      }
      return data;
    }) as CancelablePromise<FeatureItem<P, G>[]>;
  } else {
    return fetchNgwLayerItemsRequest<G, P>(options);
  }
}
