import type {
  QmsExtent,
  QmsTmsLayer,
  QmsTmsService,
  QmsWmsLayer,
  QmsWmsService,
} from './interfaces';

export function parseQmsExtent(value?: string | null): QmsExtent | undefined {
  if (!value) {
    return undefined;
  }
  const match = value.match(/^(?:SRID=(\d+);)?POLYGON\s*\(\((.+)\)\)\s*$/i);
  if (!match || (match[1] && match[1] !== '4326')) {
    return undefined;
  }

  const coordinates = match[2]
    .split(',')
    .map((coordinate) => coordinate.trim().split(/\s+/).map(Number))
    .filter(
      (coordinate) =>
        coordinate.length >= 2 &&
        Number.isFinite(coordinate[0]) &&
        Number.isFinite(coordinate[1]),
    );
  if (!coordinates.length) {
    return undefined;
  }

  const xs = coordinates.map((coordinate) => coordinate[0]);
  const ys = coordinates.map((coordinate) => coordinate[1]);
  return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
}

export function normalizeQmsUrl(url: string): string {
  return url.replace(/^(http|ftp):\/\//, 'https://');
}

export function getSubdomainsOriginUrl(originUrl: string): [string, string[]] {
  const subdomains: string[] = [];
  originUrl = originUrl.replace(/{switch:(.*?)}/, (match, group) => {
    if (typeof group === 'string') {
      group.split(',').forEach((subdomain) => subdomains.push(subdomain));
    }
    return '{s}';
  });
  return [originUrl, subdomains];
}

export function parseQmsWmsParams(
  params?: string | null,
): Record<string, string> {
  if (!params) {
    return {};
  }
  return Object.fromEntries(new URLSearchParams(params).entries());
}

export function prepareQmsTmsLayer(service: QmsTmsService): QmsTmsLayer {
  const [url, subdomains] = getSubdomainsOriginUrl(
    normalizeQmsUrl(service.origin_url || service.url),
  );
  return {
    type: 'tms',
    service,
    url,
    subdomains,
    scheme: service.y_origin_top ? 'xyz' : 'tms',
    name: service.name,
    attribution: service.copyright_text || undefined,
    extent: parseQmsExtent(service.extent),
    minZoom: service.z_min ?? undefined,
    maxZoom: service.z_max ?? undefined,
  };
}

export function prepareQmsWmsLayer(service: QmsWmsService): QmsWmsLayer {
  const params = parseQmsWmsParams(service.params);
  const versionEntry = Object.entries(params).find(
    ([key]) => key.toLowerCase() === 'version',
  );
  return {
    type: 'wms',
    service,
    url: normalizeQmsUrl(service.url),
    layers: service.layers,
    format: service.format || 'image/png',
    version: versionEntry?.[1] || '1.3.0',
    params,
    name: service.name,
    attribution: service.copyright_text || undefined,
    extent: parseQmsExtent(service.extent),
  };
}
