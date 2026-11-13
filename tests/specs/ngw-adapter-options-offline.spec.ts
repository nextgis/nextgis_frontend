import { describe, expect, it, vi } from 'vitest';

import {
  getImageAdapterOptions,
  getLayerAdapterOptions,
  ngwApiToAdapterOptions,
} from '../../packages/ngw-kit/src/utils/ngwApiToAdapterOptions';
import { prepareNgwFieldsToPropertiesFilter } from '../../packages/ngw-kit/src/utils/prepareNgwFieldsToPropertiesFilter';
import { resourceIdFromLayerOptions } from '../../packages/ngw-kit/src/utils/resourceIdFromLayerOptions';
import {
  fetchNgwExtent,
  fetchNgwLayerExtent,
  fetchNgwLayerItemExtent,
  fetchNgwResourceExtent,
  getNgwWebmapExtent,
} from '../../packages/ngw-kit/src/utils/fetchNgwExtent';

import type NgwConnector from '@nextgis/ngw-connector';
import type { WebMap } from '@nextgis/webmap';
import type { CompositeRead } from '@nextgisweb/resource/type/api';
import type { WebMapRead } from '@nextgisweb/webmap/type/api';

function fixture() {
  const get = vi.fn().mockResolvedValue({
    extent: { minLon: 10, minLat: 20, maxLon: 30, maxLat: 40 },
  });
  const route = vi.fn((_name: string, _params?: unknown) => ({ get }));
  const getResource = vi.fn();
  const connector = { route, getResource } as unknown as NgwConnector;
  return { connector, route, get, getResource };
}

describe('NGW adapter configuration (without a map renderer)', () => {
  it('converts image resources and preserves request headers', () => {
    const headers = { Authorization: 'Bearer test' };
    const image = getImageAdapterOptions({
      resourceId: 32, baseUrl: 'https://ngw.test', nd: 404, headers,
    });
    expect(image).toMatchObject({
      url: 'https://ngw.test/api/component/render/image',
      resourceId: 32, headers,
      params: { resource: 32, nd: 404 },
    });
    expect(image.updateWmsParams?.({
      bbox: '1,2,3,4', width: 256, height: 512, other: 1,
    })).toMatchObject({
      resource: 32, extent: '1,2,3,4', size: '256,512', nd: 404, other: 1,
    });
  });

  it('supports a list of resource IDs in image request parameters', () => {
    const image = getImageAdapterOptions({
      resourceId: [1, 2], baseUrl: '/ngw', headers: {},
    });
    expect(image.updateWmsParams?.({ width: 64, height: 32 })).toMatchObject({
      resource: '1,2', size: '64,32', nd: 200,
    });
  });

  it('selects an image adapter by default', () => {
    expect(ngwApiToAdapterOptions({
      options: { resource: 8 }, baseUrl: '/ngw',
    })).toMatchObject({ url: '/ngw/api/component/render/image', resourceId: 8 });
  });

  it('uses tile rendering when the map does not support IMAGE', () => {
    const webMap = {
      getLayerAdapters: () => ({ TILE: {} }),
    } as unknown as WebMap;
    expect(ngwApiToAdapterOptions({
      options: { resource: 17 }, webMap, baseUrl: '/ngw',
    })).toEqual({
      url: '/ngw/api/component/render/tile?z={z}&x={x}&y={y}&resource=17&nd=200',
      adapter: 'TILE',
    });
  });

  it('prepares WMS options from the specified layer name', () => {
    expect(ngwApiToAdapterOptions({
      options: { resource: 17, adapter: 'WMS', adapterOptions: { layers: 'buildings' } },
      baseUrl: '/ngw',
    })).toMatchObject({
      url: '/ngw/api/resource/17/wms',
      format: 'image/png', version: '1.1.1', layers: 'buildings',
    });
  });

  it('prepares MVT URLs and supports zero simplification', () => {
    expect(ngwApiToAdapterOptions({
      options: { resource: 17, adapter: 'MVT', simplification: 0 },
      baseUrl: '/ngw',
    })).toEqual({
      url: '/ngw/api/component/feature_layer/mvt?x={x}&y={y}&z={z}&resource=17&simplification=0',
      sourceLayer: 'ngw:17', featureIdName: '$id',
    });
  });

  it('prepares terrain and 3D model resource URLs', () => {
    expect(ngwApiToAdapterOptions({
      options: { resource: 18, adapter: 'TERRAIN' }, baseUrl: '/ngw',
    })).toEqual({ url: '/ngw/api/resource/18/terrain_provider', adapter: 'TERRAIN' });
    expect(ngwApiToAdapterOptions({
      options: { resource: 19, adapter: 'MODEL_3D' }, baseUrl: '/ngw',
    })).toEqual({ url: '/ngw/api/component/model_3d/19/data.glb' });
  });

  it('passes through custom tile no-data codes', () => {
    const result = ngwApiToAdapterOptions({
      options: { resource: 14, adapter: 'TILE', tileNoData: 204 }, baseUrl: '/ngw',
    });
    expect(result?.url).toContain('nd=204');
  });

  it('rejects invalid resource identifiers instead of generating a broken URL', () => {
    expect(() => ngwApiToAdapterOptions({
      options: { resource: 'layer-by-keyname', adapter: 'TILE' }, baseUrl: '/ngw',
    })).toThrow('Option `resource` must be number');
  });

  it('returns no adapter options for missing resources', () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    try {
      expect(ngwApiToAdapterOptions({ options: {} as never, baseUrl: '/ngw' })).toBeUndefined();
    } finally {
      log.mockRestore();
    }
  });

  it('preserves the legacy adapter option helper', () => {
    const webMap = { getLayerAdapters: () => ({ TILE: {} }) } as unknown as WebMap;
    expect(getLayerAdapterOptions({ resource: 9, adapter: 'TILE' }, webMap, '/ngw'))
      .toEqual(ngwApiToAdapterOptions({
        options: { resource: 9, adapter: 'TILE' }, webMap, baseUrl: '/ngw',
      }));
  });
});

describe('NGW resource resolution and extent', () => {
  it('returns resource IDs without making an API call', async () => {
    const { connector, getResource } = fixture();
    expect(await resourceIdFromLayerOptions({ resource: 42 }, connector)).toBe(42);
    expect(await resourceIdFromLayerOptions({ resource: { resource: { id: 43 } } } as never, connector)).toBe(43);
    expect(getResource).not.toHaveBeenCalled();
  });

  it('resolves resource keynames through a connector', async () => {
    const { connector, getResource } = fixture();
    getResource.mockResolvedValue({ resource: { id: 71 } });
    expect(await resourceIdFromLayerOptions({ resource: 'roads' }, connector)).toBe(71);
    expect(getResource).toHaveBeenCalledWith('roads');
  });

  it('clamps webmap geographical bounds to supported latitudes', () => {
    const webmap = {
      extent_left: 10, extent_bottom: -89, extent_right: 70, extent_top: 88,
    } as WebMapRead;
    expect(getNgwWebmapExtent(webmap)).toEqual([10, -82, 70, 82]);
    expect(getNgwWebmapExtent({} as WebMapRead)).toBeUndefined();
  });

  it('fetches the extent of an NGW raster/vector layer', async () => {
    const { connector, route, get } = fixture();
    const signal = new AbortController().signal;
    expect(await fetchNgwLayerExtent({
      resourceId: 18, connector, cache: false, signal,
    })).toEqual([10, 20, 30, 40]);
    expect(route).toHaveBeenCalledWith('layer.extent', { id: 18 });
    expect(get).toHaveBeenCalledWith({ cache: false, signal });
  });

  it('fetches the extent of a specific NGW feature', async () => {
    const { connector, route } = fixture();
    expect(await fetchNgwLayerItemExtent({
      resourceId: 18, featureId: 7, connector,
    })).toEqual([10, 20, 30, 40]);
    expect(route).toHaveBeenCalledWith('feature_layer.feature.item_extent', {
      id: 18, fid: 7,
    });
  });

  it('loads the extent of a style using its parent resource', async () => {
    const { connector, route, getResource } = fixture();
    getResource.mockResolvedValue({ resource: { id: 24 } });
    const item = {
      resource: { id: 31, cls: 'qgis_vector_style', parent: { id: 24 } },
    } as CompositeRead;
    expect(await fetchNgwResourceExtent(item, connector)).toEqual([10, 20, 30, 40]);
    expect(getResource).toHaveBeenCalledWith(24, undefined);
    expect(route).toHaveBeenCalledWith('layer.extent', { id: 24 });
  });

  it('uses the embedded webmap extent without requesting a layer', async () => {
    const { connector, route } = fixture();
    const item = {
      resource: { id: 32 },
      webmap: { extent_left: 1, extent_bottom: 2, extent_right: 3, extent_top: 4 },
    } as CompositeRead;
    expect(await fetchNgwResourceExtent(item, connector)).toEqual([1, 2, 3, 4]);
    expect(route).not.toHaveBeenCalled();
  });

  it('obtains a resource before resolving the extent', async () => {
    const { connector, getResource, route } = fixture();
    getResource.mockResolvedValue({ resource: { id: 56, cls: 'vector_layer' } });
    expect(await fetchNgwExtent({ resourceId: 56, connector })).toEqual([10, 20, 30, 40]);
    expect(route).toHaveBeenCalledWith('layer.extent', { id: 56 });
  });

  it('returns undefined when an NGW resource cannot be found', async () => {
    const { connector, getResource, route } = fixture();
    getResource.mockResolvedValue(undefined);
    expect(await fetchNgwExtent({ resourceId: 999, connector })).toBeUndefined();
    expect(route).not.toHaveBeenCalled();
  });
});

describe('NGW fields conversion for client-side filters', () => {
  it('converts comma-separated feature IDs to numeric lists', () => {
    expect(prepareNgwFieldsToPropertiesFilter({ id: '1,2,3', name: 'Roads' }))
      .toEqual({ id: [1, 2, 3], name: 'Roads' });
  });

  it('converts date and date-time objects into ISO timestamps', () => {
    const value = prepareNgwFieldsToPropertiesFilter({
      date: { year: 2026, month: 11, day: 13 },
      datetime: { year: 2026, month: 11, day: 13, hour: 14, minute: 5, second: 9 },
    });
    expect(value.date).toMatch(/^2026-11-1[23]T/);
    expect(new Date(value.datetime).getFullYear()).toBe(2026);
    expect(new Date(value.datetime).getHours()).toBe(14);
  });

  it('keeps incomplete dates and unrelated objects unchanged', () => {
    const value = { date: { year: 2026, month: 11 }, other: { active: true } };
    expect(prepareNgwFieldsToPropertiesFilter(value)).toEqual({
      date: { year: 2026, month: 11 }, other: { active: true },
    });
  });
});
