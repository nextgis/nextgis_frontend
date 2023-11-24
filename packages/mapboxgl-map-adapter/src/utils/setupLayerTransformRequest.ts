import type { Map } from 'maplibre-gl';

interface SetupLayerTransformRequestOptions {
  map: Map;
  url: string;
  headers: Record<string, string>;
}

export function setupLayerTransformRequest({
  map,
  url,
  headers,
}: SetupLayerTransformRequestOptions) {
  const transformRequests = map.transformRequests;
  transformRequests.push((url_: string) => {
    let staticUrl = url_;
    staticUrl = staticUrl.replace(/(z=\d+)/, 'z={z}');
    staticUrl = staticUrl.replace(/(x=\d+)/, 'x={x}');
    staticUrl = staticUrl.replace(/(y=\d+)/, 'y={y}');
    if (staticUrl === url) {
      return {
        url: url_,
        headers,
      };
    }
  });
}
