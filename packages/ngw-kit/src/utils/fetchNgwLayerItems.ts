import { propertiesFilter } from '@nextgis/properties-filter';
import { isArray } from '@nextgis/utils';

import {
  createFeatureFieldFilterQueries,
  fetchNgwLayerItemsRequest,
} from './featureLayerUtils';
import { prepareNgwFieldsToPropertiesFilter } from './prepareNgwFieldsToPropertiesFilter';

import type { FeatureItem } from '@nextgis/ngw-connector';
import type { PropertiesFilter } from '@nextgis/properties-filter';
import type { FeatureProperties } from '@nextgis/utils';
import type { Geometry } from 'geojson';

import type { FetchNgwItemsOptions } from '../interfaces';

export async function fetchNgwLayerItems<
  G extends Geometry = Geometry,
  P extends FeatureProperties = FeatureProperties,
>(options: FetchNgwItemsOptions<P>): Promise<FeatureItem<P, G>[]> {
  const filters = options.filters;
  if (filters) {
    let data = await createFeatureFieldFilterQueries({
      ...options,
      filters,
    });
    const clientFilterValidate =
      options.clientFilterValidate ?? isFilterWithAnyCase(filters);
    // Additional client-side filter check
    if (clientFilterValidate) {
      data = data.filter((y) => {
        const fields = prepareNgwFieldsToPropertiesFilter({
          ...y.fields,
          id: y.id,
        });
        const result = propertiesFilter(fields, filters);
        return result;
      });
    }
    return data as FeatureItem<P, G>[];
  } else {
    return fetchNgwLayerItemsRequest<G, P>(options);
  }
}

function isFilterWithAnyCase(filters: PropertiesFilter): boolean {
  if (filters[0] === 'any') {
    return true;
  }
  for (let i = 1; i < filters.length; i++) {
    const p = filters[i];
    if (isArray(p)) {
      const deep = isFilterWithAnyCase(p);
      if (deep) {
        return true;
      }
    }
  }
  return false;
}
