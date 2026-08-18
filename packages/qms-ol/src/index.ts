import { getQmsServiceExtent, resolveQmsLayer } from '@nextgis/qms-core';
import TileLayer from 'ol/layer/Tile';
import { transformExtent } from 'ol/proj';
import TileWMS from 'ol/source/TileWMS';
import XYZ from 'ol/source/XYZ';

import type { QmsRequestOptions } from '@nextgis/qms-core';
import type BaseLayer from 'ol/layer/Base';
import type Map from 'ol/Map';
import type { FitOptions } from 'ol/View';

export type QmsOlFitOptions = FitOptions & QmsRequestOptions;

export interface QmsOlOptions extends QmsRequestOptions {
  opacity?: number;
  visible?: boolean;
  zIndex?: number;
  crossOrigin?: 'anonymous';
  fit?: boolean | FitOptions;
}

export async function createQmsLayer(
  id: number,
  options: QmsOlOptions = {},
): Promise<BaseLayer> {
  const qms = await resolveQmsLayer(id, options);
  let layer: BaseLayer;
  const layerOptions = {
    opacity: options.opacity,
    visible: options.visible,
    zIndex: options.zIndex,
  };

  if (qms.type === 'tms') {
    const url = qms.scheme === 'tms' ? qms.url.replace('{y}', '{-y}') : qms.url;
    const urls = qms.subdomains.length
      ? qms.subdomains.map((subdomain) => url.replace('{s}', subdomain))
      : [url];
    layer = new TileLayer({
      ...layerOptions,
      source: new XYZ({
        urls,
        attributions: qms.attribution ? [qms.attribution] : undefined,
        minZoom: qms.minZoom,
        maxZoom: qms.maxZoom,
        crossOrigin: options.crossOrigin,
      }),
    });
  } else {
    layer = new TileLayer({
      ...layerOptions,
      source: new TileWMS({
        url: qms.url,
        params: {
          LAYERS: qms.layers,
          FORMAT: qms.format,
          VERSION: qms.version,
          TRANSPARENT: true,
          TILED: true,
          ...qms.params,
        },
        attributions: qms.attribution ? [qms.attribution] : undefined,
        crossOrigin: options.crossOrigin,
      }),
    });
  }

  return layer;
}

export async function fitQmsService(
  map: Map,
  id: number,
  options: QmsOlFitOptions = {},
): Promise<void> {
  const extent = await getQmsServiceExtent(id, options);
  if (!extent) {
    return;
  }
  const projection = map.getView().getProjection();
  map.getView().fit(transformExtent(extent, 'EPSG:4326', projection), options);
}

export async function addQmsLayer(
  map: Map,
  id: number,
  options: QmsOlOptions = {},
): Promise<BaseLayer> {
  const layer = await createQmsLayer(id, options);
  map.addLayer(layer);
  if (options.fit) {
    await fitQmsService(map, id, {
      signal: options.signal,
      ...(options.fit === true ? {} : options.fit),
    });
  }
  return layer;
}
