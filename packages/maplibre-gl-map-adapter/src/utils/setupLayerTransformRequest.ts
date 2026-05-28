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

function tileUrlTemplateToRegex(template: string): RegExp {
  const escaped = template.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const pattern = escaped
    .replace('\\{z\\}', '\\d+')
    .replace('\\{x\\}', '\\d+')
    .replace('\\{y\\}', '\\d+');

  return new RegExp(`^${pattern}$`);
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
  const urlRegex = tileUrlTemplateToRegex(url);

  transformRequests.push((url_: string) => {
    const credentials =
      layerRequest?.credentials !== 'omit'
        ? layerRequest?.credentials
        : undefined;
    if (urlRegex.test(url_)) {
      return {
        url: url_,
        cache: layerRequest?.cache,
        headers: layerRequest?.headers,
        credentials,
      };
    }
  });
}
