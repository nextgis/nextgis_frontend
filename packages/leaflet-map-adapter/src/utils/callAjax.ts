import { getLayerRequestOptions } from '@nextgis/webmap';

import type { LayerRequestOptions } from '@nextgis/webmap';

export function callAjax({
  src,
  headers,
  withCredentials,
  request,
}: {
  src: string;
  /** @deprecated use request.headers instead. */
  headers?: Record<string, any>;
  /** @deprecated use request.credentials instead. */
  withCredentials?: boolean;
  request?: LayerRequestOptions;
}): [Promise<string>, () => void] {
  const layerRequest = getLayerRequestOptions({
    headers,
    request,
    withCredentials,
  });
  const requestHeaders = layerRequest?.headers || {};
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
      return urlCreator.createObjectURL(blob);
    })
    .catch((er: Error) => {
      if (er.name === 'AbortError') {
        return '';
      }
      throw er;
    });
  const abortFunc = () => {
    controller.abort();
  };
  return [promise, abortFunc];
}
