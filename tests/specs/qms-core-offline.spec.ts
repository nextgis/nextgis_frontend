import { afterEach, describe, expect, it, vi } from 'vitest';

import { QmsClient } from '../../packages/qms-core/src/QmsClient';
import { getQmsServiceExtent, resolveQmsLayer } from '../../packages/qms-core/src/QmsService';
import { catalogServiceToQmsService, prepareQmsCatalogLayer } from '../../packages/qms-core/src/catalog';
import {
  getQmsTileQuadKey,
  getSubdomainsOriginUrl,
  normalizeQmsUrl,
  parseQmsExtent,
  parseQmsWmsParams,
  prepareQmsTmsLayer,
  prepareQmsWmsLayer,
} from '../../packages/qms-core/src/utils';
import { QmsKit } from '../../packages/qms-kit/src/QmsKit';

import type {
  QmsCatalogService,
  QmsTmsService,
  QmsWmsService,
} from '../../packages/qms-core/src/interfaces';

const base = {
  id: 900001,
  guid: 'unit-test',
  name: 'Test map',
  desc: '',
  epsg: 3857,
  icon: null,
  license_name: null,
  license_url: null,
  copyright_text: 'Attribution',
  copyright_url: null,
  terms_of_use_url: null,
  extent: 'SRID=4326;POLYGON((10 20,30 20,30 40,10 40,10 20))',
};

function tms(id = 900001): QmsTmsService {
  return {
    ...base, id, type: 'tms', url: 'http://tiles.test/{z}/{x}/{y}',
    origin_url: 'http://{switch:a,b}.tiles.test/{z}/{x}/{y}',
    alt_urls: [], z_min: 2, z_max: 18, y_origin_top: true,
  };
}

function wms(id = 900002): QmsWmsService {
  return {
    ...base, id, type: 'wms', url: 'http://wms.test/service',
    params: 'VERSION=1.1.1&transparent=true', layers: 'roads',
    turn_over: false, format: null,
  };
}

function mockJson(data: unknown, status = 200) {
  const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify(data), {
    status, headers: { 'content-type': 'application/json' },
  }));
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('QMS layer transformations', () => {
  it('parses geographic extents in WKT and rejects unsupported SRIDs', () => {
    expect(parseQmsExtent('SRID=4326;POLYGON((10 20,30 40,10 40,10 20))')).toEqual([10, 20, 30, 40]);
    expect(parseQmsExtent('POLYGON((1 2,5 4,1 2))')).toEqual([1, 2, 5, 4]);
    expect(parseQmsExtent('SRID=3857;POLYGON((1 2,3 4))')).toBeUndefined();
    expect(parseQmsExtent('not a polygon')).toBeUndefined();
    expect(parseQmsExtent(null)).toBeUndefined();
  });

  it('ignores invalid coordinates and rejects wholly invalid polygons', () => {
    expect(parseQmsExtent('POLYGON((1 2,bad point,5 6))')).toEqual([1, 2, 5, 6]);
    expect(parseQmsExtent('POLYGON((bad point))')).toBeUndefined();
  });

  it('normalizes plain HTTP and FTP URLs without touching HTTPS', () => {
    expect(normalizeQmsUrl('http://example.test')).toBe('https://example.test');
    expect(normalizeQmsUrl('ftp://example.test')).toBe('https://example.test');
    expect(normalizeQmsUrl('https://example.test')).toBe('https://example.test');
  });

  it('extracts QMS subdomain switches', () => {
    expect(getSubdomainsOriginUrl('https://{switch:a,b,c}.test/{z}')).toEqual([
      'https://{s}.test/{z}', ['a', 'b', 'c'],
    ]);
    expect(getSubdomainsOriginUrl('https://tiles.test/{z}')).toEqual([
      'https://tiles.test/{z}', [],
    ]);
  });

  it('generates standard quadkeys', () => {
    expect(getQmsTileQuadKey(0, 0, 0)).toBe('');
    expect(getQmsTileQuadKey(3, 5, 3)).toBe('213');
  });

  it('parses WMS parameters, including an empty query', () => {
    expect(parseQmsWmsParams('VERSION=1.1.1&LAYERS=roads')).toEqual({
      VERSION: '1.1.1', LAYERS: 'roads',
    });
    expect(parseQmsWmsParams(null)).toEqual({});
  });

  it('prepares TMS layer options from QMS service metadata', () => {
    expect(prepareQmsTmsLayer(tms())).toMatchObject({
      type: 'tms',
      url: 'https://{s}.tiles.test/{z}/{x}/{y}',
      subdomains: ['a', 'b'],
      scheme: 'xyz',
      name: 'Test map', attribution: 'Attribution',
      extent: [10, 20, 30, 40], minZoom: 2, maxZoom: 18,
    });
    expect(prepareQmsTmsLayer({ ...tms(), y_origin_top: false }).scheme).toBe('tms');
  });

  it('prepares WMS layers and falls back to default format and version', () => {
    expect(prepareQmsWmsLayer(wms())).toMatchObject({
      type: 'wms', url: 'https://wms.test/service', layers: 'roads',
      format: 'image/png', version: '1.1.1',
      params: { VERSION: '1.1.1', transparent: 'true' },
      extent: [10, 20, 30, 40],
    });
    expect(prepareQmsWmsLayer({ ...wms(), params: null }).version).toBe('1.3.0');
  });

  it('converts catalog TMS entries into services and layers', () => {
    const entry: QmsCatalogService = {
      id: 'map-1', type: 'tms', name: 'Catalog map', group: 'base',
      url: 'http://tiles.test/{z}/{x}/{y}', yOriginTop: false,
      minZoom: 3, maxZoom: 17,
    };
    expect(catalogServiceToQmsService(entry)).toMatchObject({
      id: 'map-1', guid: 'catalog:map-1', type: 'tms',
      z_min: 3, z_max: 17, y_origin_top: false,
    });
    expect(prepareQmsCatalogLayer(entry)).toMatchObject({
      type: 'tms', scheme: 'tms', minZoom: 3, maxZoom: 17,
    });
  });

  it('converts catalog WMS entries and removes duplicate layer parameters', () => {
    const entry: QmsCatalogService = {
      id: 'map-2', type: 'wms', name: 'WMS catalog', group: 'base',
      url: 'http://wms.test/service?LAYERS=roads&VERSION=1.1.1',
      layers: '', params: 'FORMAT=image/jpeg&transparent=true',
    };
    const service = catalogServiceToQmsService(entry);
    expect(service).toMatchObject({ type: 'wms', layers: 'roads', url: 'http://wms.test/service' });
    if (service.type === 'wms') {
      expect(service.params).not.toMatch(/LAYERS/i);
    }
    expect(prepareQmsCatalogLayer(entry)).toMatchObject({
      type: 'wms', layers: 'roads', version: '1.1.1', format: 'image/jpeg',
    });
  });
});

describe('QMS API client without internet access', () => {
  it('normalizes the configured base URL', () => {
    const oldUrl = QmsClient.url;
    try {
      QmsClient.url = 'https://qms.example.test/';
      expect(new QmsClient().url).toBe('https://qms.example.test');
    } finally {
      QmsClient.url = oldUrl;
    }
  });

  it('fetches and validates TMS metadata', async () => {
    const fetchMock = mockJson(tms());
    const client = new QmsClient();
    const signal = new AbortController().signal;
    expect(await client.getService(900001, { signal })).toEqual(tms());
    expect(fetchMock).toHaveBeenCalledWith(`${client.url}/api/v1/geoservices/900001`, { signal });
  });

  it('rejects unknown service types', async () => {
    mockJson({ ...base, type: 'unknown' });
    await expect(new QmsClient().getService(3)).rejects.toThrow('Unsupported QMS service type');
  });

  it('reports non-success responses with status and URL', async () => {
    mockJson({ detail: 'No service' }, 404);
    await expect(new QmsClient().getService(404)).rejects.toThrow(/QMS request failed with status 404/);
  });

  it('prepares TMS and WMS layers from fetched services', async () => {
    const fetchMock = mockJson(tms());
    const client = new QmsClient();
    expect(await client.getLayer(900001)).toMatchObject({
      type: 'tms', scheme: 'xyz', subdomains: ['a', 'b'],
    });
    fetchMock.mockResolvedValue(new Response(JSON.stringify(wms()), { status: 200 }));
    expect(await client.getLayer(900002)).toMatchObject({
      type: 'wms', layers: 'roads', format: 'image/png',
    });
  });

  it('encodes search parameters, limit, offset and abort signal', async () => {
    const fetchMock = mockJson({ results: [{ id: 1, name: 'City', type: 'tms' }] });
    const signal = new AbortController().signal;
    const result = await new QmsClient().searchServices('city map', {
      type: 'tms', offset: 12, limit: 5, signal,
    });
    expect(result).toHaveLength(1);
    const [url, request] = fetchMock.mock.calls[0];
    expect(new URL(url).searchParams.get('search')).toBe('city map');
    expect(new URL(url).searchParams.get('type')).toBe('tms');
    expect(new URL(url).searchParams.get('limit')).toBe('5');
    expect(new URL(url).searchParams.get('offset')).toBe('12');
    expect(request).toEqual({ signal });
  });

  it('uses the default search limit and omits offset', async () => {
    const fetchMock = mockJson({ results: [] });
    await new QmsClient().searchServices('test', { type: 'wms' });
    const params = new URL(fetchMock.mock.calls[0][0]).searchParams;
    expect(params.get('limit')).toBe('10');
    expect(params.has('offset')).toBe(false);
  });

  it('caches QMS service extent between subsequent calls', async () => {
    const fetchMock = mockJson(tms(990021));
    expect(await getQmsServiceExtent(990021)).toEqual([10, 20, 30, 40]);
    expect(await getQmsServiceExtent(990021)).toEqual([10, 20, 30, 40]);
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it('caches layer extent when resolving a QMS layer', async () => {
    const fetchMock = mockJson(wms(990022));
    expect(await resolveQmsLayer(990022)).toMatchObject({ type: 'wms', layers: 'roads' });
    expect(await getQmsServiceExtent(990022)).toEqual([10, 20, 30, 40]);
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it('exposes a lazy QMS adapter through its starter kit', async () => {
    const providers = await new QmsKit().getLayerAdapters();
    expect(providers).toHaveLength(1);
    expect(providers[0].name).toBe('QMS');
    expect(typeof providers[0].createAdapter).toBe('function');
  });
});
