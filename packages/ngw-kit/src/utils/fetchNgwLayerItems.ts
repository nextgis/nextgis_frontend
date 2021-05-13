import { Geometry } from 'geojson';
import { FeatureItem } from '@nextgis/ngw-connector';
import { propertiesFilter } from '@nextgis/properties-filter';
import CancelablePromise from '@nextgis/cancelable-promise';
import {
  GetNgwLayerItemsOptions,
  NgwFeatureRequestOptions,
} from '../interfaces';
import {
  createFeatureFieldFilterQueries,
  fetchNgwLayerItemsRequest,
} from './featureLayerUtils';

export function fetchNgwLayerItems<
  G extends Geometry = Geometry,
  P extends { [field: string]: any } = { [field: string]: any }
>(
  options: GetNgwLayerItemsOptions & NgwFeatureRequestOptions<P>,
): CancelablePromise<FeatureItem<P, G>[]> {
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
