import { defined } from '@nextgis/utils';

import { fetchNgwLayerItems } from './fetchNgwLayerItems';

import type { FeatureProperties } from '@nextgis/utils';

import type { FetchNgwItemsOptions } from '../interfaces';

export interface MapSelectNgwLayerDistinctOptions<
  P extends FeatureProperties = FeatureProperties,
> extends FetchNgwItemsOptions<P> {
  fields: (keyof P)[];
}

export function selectNgwLayerDistinct<
  P extends FeatureProperties = FeatureProperties,
>(
  options: MapSelectNgwLayerDistinctOptions<P>,
): Promise<Record<keyof P, unknown[]>> {
  const fields = options.fields;
  if (!fields) {
    throw new Error(
      'The `fields` is required property for selectNgwLayerDistinct function',
    );
  }
  const select = {} as Record<keyof P, unknown[]>;
  for (const f of fields) {
    select[f] = [];
  }
  const queryOpts: FetchNgwItemsOptions<P> = {
    // the limit can be redefined, but initially it applies to all the data in the table.
    // there are no restrictions as when loading vector data `geom: true`
    limit: Infinity,
    ...options,
    geom: false,
    extensions: false,
  };

  return fetchNgwLayerItems(queryOpts).then((items) => {
    for (const i of items) {
      for (const f of fields) {
        const s = select[f];
        const itemProp = i.fields[f];
        if (defined(itemProp) && !s.includes(itemProp)) {
          s.push(itemProp);
        }
      }
    }
    return select;
  });
}
