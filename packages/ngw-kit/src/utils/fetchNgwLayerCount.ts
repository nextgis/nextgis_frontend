import type { FetchNgwLayerCountOptions } from '../interfaces';

export function fetchNgwLayerCount({
  connector,
  resourceId,
  cache = true,
  signal,
}: FetchNgwLayerCountOptions): Promise<number> {
  return connector
    .route('feature_layer.feature.count', {
      id: resourceId,
    })
    .get({ cache, signal })
    .then((resp) => {
      return resp.total_count;
    });
}
