import { afterEach, describe, expect, it, vi } from 'vitest';

import { createQmsAdapter } from '../../packages/qms-kit/src/utils/createQmsAdapter';

import type { WebMap } from '@nextgis/webmap';
import type { QmsTmsService, QmsWmsService } from '../../packages/qms-core/src/interfaces';

function stubQmsService(service: QmsTmsService | QmsWmsService) {
  const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify(service), { status: 200 }));
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

function tmsService(): QmsTmsService {
  return {
    type: 'tms', id: 70, guid: '70', name: 'Tiles', desc: '',
    epsg: 3857, icon: null, license_name: null, license_url: null,
    copyright_text: 'Map data', copyright_url: null, terms_of_use_url: null,
    origin_url: 'https://tiles.test/{z}/{x}/{y}',
    url: 'https://tiles.test/{z}/{x}/{y}', alt_urls: [],
    z_min: 1, z_max: 18, y_origin_top: false,
  };
}

function wmsService(): QmsWmsService {
  return {
    type: 'wms', id: 71, guid: '71', name: 'WMS', desc: '',
    epsg: 3857, icon: null, license_name: null, license_url: null,
    copyright_text: null, copyright_url: null, terms_of_use_url: null,
    url: 'https://wms.test/service',
    layers: 'roads', params: 'VERSION=1.1.1', turn_over: false, format: 'image/png',
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('QMS map adapter without remote tiles', () => {
  it('does not send a request when no service ID is available', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const map = { mapAdapter: { layerAdapters: {} }, options: {} } as unknown as WebMap;
    const Adapter = createQmsAdapter(map);
    const adapter = new Adapter({}, {});
    expect(await adapter.addLayer({})).toBeUndefined();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(adapter.options.baselayer).toBe(true);
  });

  it('resolves QMS TMS metadata into a native tile adapter', async () => {
    const fetchMock = stubQmsService(tmsService());
    const nativeAdd = vi.fn().mockResolvedValue('native-tile');
    class NativeTile {
      constructor(_map: unknown, _options: unknown) {}
      addLayer(options: unknown) { return nativeAdd(options); }
      showLayer() {}
      hideLayer() {}
    }
    const map = {
      mapAdapter: { layerAdapters: { TILE: NativeTile } },
      options: { minZoom: 2, maxZoom: 16 },
    } as unknown as WebMap;
    const Adapter = createQmsAdapter(map, { qmsId: 70 });
    const adapter = new Adapter({}, {});
    expect(await adapter.addLayer(adapter.options)).toBe('native-tile');
    expect(nativeAdd).toHaveBeenCalledWith(expect.objectContaining({
      url: 'https://tiles.test/{z}/{x}/{-y}',
      minZoom: 1, maxZoom: 18, name: 'Tiles', attribution: 'Map data',
      baselayer: true,
    }));
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it('resolves a WMS service into the native WMS adapter', async () => {
    stubQmsService(wmsService());
    const nativeAdd = vi.fn().mockResolvedValue('native-wms');
    class NativeWms {
      constructor(_map: unknown, _options: unknown) {}
      addLayer(options: unknown) { return nativeAdd(options); }
    }
    const map = {
      mapAdapter: { layerAdapters: { WMS: NativeWms } }, options: {},
    } as unknown as WebMap;
    const Adapter = createQmsAdapter({ webMap: map, qmsId: 71 });
    const adapter = new Adapter({}, {});
    expect(await adapter.addLayer(adapter.options)).toBe('native-wms');
    expect(nativeAdd).toHaveBeenCalledWith(expect.objectContaining({
      url: 'https://wms.test/service', layers: 'roads',
      format: 'image/png', version: '1.1.1',
    }));
  });

  it('does not try to add an unknown native layer adapter', async () => {
    stubQmsService(tmsService());
    const map = { mapAdapter: { layerAdapters: {} }, options: {} } as unknown as WebMap;
    const Adapter = createQmsAdapter({ webMap: map, qmsId: 70 });
    const adapter = new Adapter({}, {});
    expect(await adapter.addLayer(adapter.options)).toBeUndefined();
  });

  it('does not fail map creation on a non-abort QMS server error', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('{}', { status: 503 }));
    vi.stubGlobal('fetch', fetchMock);
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      const map = { mapAdapter: { layerAdapters: {} }, options: {} } as unknown as WebMap;
      const Adapter = createQmsAdapter({ webMap: map, qmsId: 70 });
      const adapter = new Adapter({}, {});
      expect(await adapter.addLayer(adapter.options)).toBeUndefined();
      expect(log).toHaveBeenCalledOnce();
    } finally {
      log.mockRestore();
    }
  });
});
