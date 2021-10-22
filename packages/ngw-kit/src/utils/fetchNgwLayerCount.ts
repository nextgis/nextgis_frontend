import CancelablePromise from '@nextgis/cancelable-promise';

import type { FetchNgwLayerCountOptions } from '../interfaces';

export function fetchNgwLayerCount({
  connector,
  resourceId,
  cache,
}: FetchNgwLayerCountOptions): CancelablePromise<number> {
  return connector
    .get(
      'feature_layer.feature.count',
      { cache },
      {
        id: resourceId,
      },
    )
    .then((resp) => {
      return resp.total_count;
    });
}
