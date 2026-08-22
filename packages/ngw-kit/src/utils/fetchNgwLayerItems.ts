import { propertiesFilter } from '@nextgis/properties-filter';

import { fetchNgwLayerItemsRequest } from './featureLayerUtils';
import { prepareNgwFieldsToPropertiesFilter } from './prepareNgwFieldsToPropertiesFilter';
import { propertiesFilterToExpressionString } from './propertiesFilterToExpression';

import type { FeatureItem } from '@nextgis/ngw-connector';
import type { FeatureProperties } from '@nextgis/utils';
import type { Geometry } from 'geojson';

import type { FetchNgwItemsOptions } from '../interfaces';

export async function fetchNgwLayerItems<
  G extends Geometry = Geometry,
  P extends FeatureProperties = FeatureProperties,
>(options: FetchNgwItemsOptions<P>): Promise<FeatureItem<P, G>[]> {
  const filters = options.filters;
  if (filters) {
    let data = await fetchNgwLayerItemsRequest<G, P>({
      ...options,
      query: {
        ...options.query,
        filter: propertiesFilterToExpressionString(filters),
      },
    });
    const clientFilterValidate = options.clientFilterValidate ?? false;
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
