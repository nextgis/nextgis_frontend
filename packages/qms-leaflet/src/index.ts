import { getQmsServiceExtent, resolveQmsLayer } from '@nextgis/qms-core';
import { TileLayer } from 'leaflet';

import type { QmsRequestOptions } from '@nextgis/qms-core';
import type {
  FitBoundsOptions,
  Layer,
  Map,
  TileLayerOptions,
  WMSOptions,
} from 'leaflet';

export type QmsLeafletFitOptions = FitBoundsOptions & QmsRequestOptions;

export interface QmsLeafletOptions extends QmsRequestOptions {
  opacity?: number;
  fit?: boolean | FitBoundsOptions;
}

function getLeafletWmsParams(params: Record<string, string>) {
  const managedParams = new Set([
    'bbox',
    'crs',
    'height',
    'request',
    'service',
    'srs',
    'version',
    'width',
  ]);
  const normalizedParams: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    const normalizedKey = key.toLowerCase();
    if (!managedParams.has(normalizedKey)) {
      normalizedParams[normalizedKey] = value;
    }
  }
  return normalizedParams;
}

export async function createQmsLayer(
  id: number,
  options: QmsLeafletOptions = {},
): Promise<Layer> {
  const qms = await resolveQmsLayer(id, options);
  let layer: Layer;

  if (qms.type === 'tms') {
    const layerOptions: TileLayerOptions = {
      attribution: qms.attribution,
      minZoom: qms.minZoom,
      maxZoom: qms.maxZoom,
      subdomains: qms.subdomains,
      tms: qms.scheme === 'tms',
      opacity: options.opacity,
    };
    layer = new TileLayer(qms.url, layerOptions);
  } else {
    const layerOptions: WMSOptions = {
      layers: qms.layers,
      format: qms.format,
      transparent: true,
      version: qms.version,
      ...getLeafletWmsParams(qms.params),
      attribution: qms.attribution,
      opacity: options.opacity,
      uppercase: true,
    };
    layer = new TileLayer.WMS(qms.url, layerOptions);
  }

  return layer;
}

export async function fitQmsService(
  map: Map,
  id: number,
  options: QmsLeafletFitOptions = {},
): Promise<void> {
  const extent = await getQmsServiceExtent(id, options);
  if (!extent) {
    return;
  }
  const [west, south, east, north] = extent;
  map.fitBounds(
    [
      [south, west],
      [north, east],
    ],
    options,
  );
}

export async function addQmsLayer(
  map: Map,
  id: number,
  options: QmsLeafletOptions = {},
): Promise<Layer> {
  const layer = await createQmsLayer(id, options);
  layer.addTo(map);
  if (options.fit) {
    await fitQmsService(map, id, {
      signal: options.signal,
      ...(options.fit === true ? {} : options.fit),
    });
  }
  return layer;
}
