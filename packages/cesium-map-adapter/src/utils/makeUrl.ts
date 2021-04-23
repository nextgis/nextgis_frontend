import { Resource } from 'cesium';

export function makeUrl(
  url: string,
  headers?: Record<string, any>,
): string | Resource {
  if (headers) {
    return new Resource({ url, headers });
  }
  return url;
}
