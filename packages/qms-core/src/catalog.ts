import catalogData from './catalog.json';
import { prepareQmsTmsLayer, prepareQmsWmsLayer } from './utils';

import type {
  QmsCatalog,
  QmsCatalogService,
  QmsLayer,
  QmsService,
} from './interfaces';

export const qmsCatalog = catalogData as QmsCatalog;

function getWmsParam(params: URLSearchParams, name: string) {
  for (const [key, value] of params) {
    if (key.toLowerCase() === name) {
      return value;
    }
  }
}

export function catalogServiceToQmsService(
  service: QmsCatalogService,
): QmsService {
  const base = {
    id: service.id,
    guid: `catalog:${service.id}`,
    name: service.name,
    desc: '',
    epsg: 3857,
    icon: null,
    license_name: null,
    license_url: null,
    copyright_text: service.copyrightText || null,
    copyright_url: service.copyrightUrl || null,
    terms_of_use_url: service.termsOfUseUrl || null,
  };

  if (service.type === 'tms') {
    return {
      ...base,
      type: 'tms',
      url: service.url,
      origin_url: service.url,
      alt_urls: [],
      z_min: service.minZoom ?? null,
      z_max: service.maxZoom ?? null,
      y_origin_top: service.yOriginTop,
    };
  }

  const [url, query = ''] = service.url.split('?');
  const params = new URLSearchParams(query);
  new URLSearchParams(service.params).forEach((value, key) => {
    params.set(key, value);
  });
  const layers = service.layers || getWmsParam(params, 'layers') || '';
  for (const key of Array.from(params.keys())) {
    if (key.toLowerCase() === 'layers') {
      params.delete(key);
    }
  }
  return {
    ...base,
    type: 'wms',
    url,
    params: params.toString() || null,
    layers,
    turn_over: false,
    format: getWmsParam(params, 'format') || null,
  };
}

export function prepareQmsCatalogLayer(service: QmsCatalogService): QmsLayer {
  const qmsService = catalogServiceToQmsService(service);
  if (qmsService.type === 'tms') {
    return prepareQmsTmsLayer(qmsService);
  }
  return prepareQmsWmsLayer(qmsService);
}
