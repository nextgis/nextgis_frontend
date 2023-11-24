import type { FetchNgwLayerCountOptions } from '../interfaces';
import type CancelablePromise from '@nextgis/cancelable-promise';

export function fetchNgwLayerCount({
  connector,
  resourceId,
  cache = true,
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
