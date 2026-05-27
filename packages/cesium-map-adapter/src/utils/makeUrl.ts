import { getLayerRequestOptions } from '@nextgis/webmap';
import { Resource } from 'cesium';

import type { LayerRequestOptions } from '@nextgis/webmap';

export function makeUrl(
  url: string,
  request?: LayerRequestOptions,
): string | Resource {
  const layerRequest = getLayerRequestOptions({ request });
  if (layerRequest?.headers) {
    return new Resource({ url, headers: layerRequest.headers });
  }
  return url;
}
