import type {
  AdapterOptions,
  LayerRequestOptions,
} from '../interfaces/LayerAdapter';

type RequestOptionsInput = Pick<
  AdapterOptions,
  'headers' | 'request' | 'withCredentials'
>;

function hasHeaders(headers?: Record<string, any>): boolean {
  return !!headers && Object.keys(headers).length > 0;
}

export function normalizeLayerRequestOptions(
  request?: LayerRequestOptions,
): LayerRequestOptions | undefined {
  if (!request) {
    return undefined;
  }
  const normalized: LayerRequestOptions = {
    ...request,
  };
  return hasLayerRequestOptions(normalized) ? normalized : undefined;
}

export function getLayerRequestOptions(
  options?: Partial<RequestOptionsInput>,
): LayerRequestOptions | undefined {
  const request = options?.request;
  const headers = {
    ...(options?.headers || {}),
    ...(request?.headers || {}),
  };
  const result: LayerRequestOptions = {};

  if (hasHeaders(headers)) {
    result.headers = headers;
  }
  if (options?.withCredentials) {
    result.credentials = 'include';
  }
  if (request?.credentials !== undefined) {
    result.credentials = request.credentials;
  }
  if (request?.cache !== undefined) {
    result.cache = request.cache;
  }
  return normalizeLayerRequestOptions(result);
}

export function applyLayerRequestOptions<O extends AdapterOptions>(
  options: O,
): O {
  const request = getLayerRequestOptions(options);
  return {
    ...options,
    request,
  } as O;
}

function hasLayerRequestOptions(request?: LayerRequestOptions): boolean {
  return !!(
    request &&
    (hasHeaders(request.headers) ||
      request.credentials !== undefined ||
      (request.cache !== undefined && request.cache !== 'default'))
  );
}
