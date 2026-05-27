import { getLayerRequestOptions } from '@nextgis/webmap';

import type { LayerRequestOptions } from '@nextgis/webmap';
import type ImageWrapper from 'ol/Image';
import type Tile from 'ol/Tile';

export function setTileLoadFunction({
  tile,
  src,
  headers,
  withCredentials,
  request,
}: {
  tile: Tile | ImageWrapper;
  src: string;
  /** @deprecated use request.headers instead. */
  headers?: Record<string, any>;
  /** @deprecated use request.credentials instead. */
  withCredentials?: boolean;
  request?: LayerRequestOptions;
}): [Promise<void>, () => void] {
  const layerRequest = getLayerRequestOptions({
    headers,
    request,
    withCredentials,
  });
  const requestHeaders = layerRequest?.headers || {};
  // @ts-expect-error Property 'getImage' does not exist on type 'Tile | ImageWrapper'.
  const img = tile.getImage() as HTMLImageElement;
  const controller = new AbortController();
  const promise = fetch(src, {
    cache: layerRequest?.cache,
    credentials: layerRequest?.credentials,
    headers: requestHeaders,
    signal: controller.signal,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.blob();
    })
    .then((blob) => {
      const urlCreator = window.URL || window.webkitURL;
      const imageUrl = urlCreator.createObjectURL(blob);
      img.src = imageUrl;
    })
    .catch((er: Error) => {
      if (er.name !== 'AbortError') {
        throw er;
      }
    });
  const abort = () => {
    controller.abort();
  };

  return [promise, abort];
}
