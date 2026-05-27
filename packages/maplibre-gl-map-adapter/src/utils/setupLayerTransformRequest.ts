import { getLayerRequestOptions } from '@nextgis/webmap';

import type { LayerRequestOptions } from '@nextgis/webmap';
import type { Map } from 'maplibre-gl';

interface SetupLayerTransformRequestOptions {
  map: Map;
  url: string;
  /** @deprecated use request.headers instead */
  headers?: Record<string, string>;
  request?: LayerRequestOptions;
  /** @deprecated use request.credentials instead */
  withCredentials?: boolean;
}

export function setupLayerTransformRequest({
  map,
  url,
  headers,
  request,
  withCredentials,
}: SetupLayerTransformRequestOptions) {
  const layerRequest = getLayerRequestOptions({
    headers,
    request,
    withCredentials,
  });
  const transformRequests = map.transformRequests;
  transformRequests.push((url_: string) => {
    const credentials =
      layerRequest?.credentials !== 'omit'
        ? layerRequest?.credentials
        : undefined;
    let staticUrl = url_;
    staticUrl = staticUrl.replace(/(z=\d+)/, 'z={z}');
    staticUrl = staticUrl.replace(/(x=\d+)/, 'x={x}');
    staticUrl = staticUrl.replace(/(y=\d+)/, 'y={y}');
    if (staticUrl.startsWith(url)) {
      return {
        url: url_,
        cache: layerRequest?.cache,
        headers: layerRequest?.headers,
        credentials,
      };
    }
  });
}
