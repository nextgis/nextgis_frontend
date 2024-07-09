import type { FetchNgwLayerCountOptions } from '../interfaces';

export function fetchNgwLayerCount({
  connector,
  resourceId,
  cache = true,
  signal,
}: FetchNgwLayerCountOptions): Promise<number> {
  return connector
    .get(
      'feature_layer.feature.count',
      { cache, signal },
      {
        id: resourceId,
      },
    )
    .then((resp) => {
      return resp.total_count;
    });
}
