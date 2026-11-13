import { describe, expect, it, vi } from 'vitest';

import { BookmarkItem } from '../../packages/ngw-kit/src/BookmarkItem';
import { Legend } from '../../packages/ngw-kit/src/Legend';
import { NgwKit } from '../../packages/ngw-kit/src/NgwKit';
import { NgwResource } from '../../packages/ngw-kit/src/NgwResource';
import { NgwWebmapLayerAdapter } from '../../packages/ngw-kit/src/NgwWebmapLayerAdapter';

import type NgwConnector from '@nextgis/ngw-connector';
import type { LayerAdapter, WebMap } from '@nextgis/webmap';
import type { FeatureItem } from '../../packages/ngw-connector/src/types/FeatureLayer';
import type { LegendSymbol } from '@nextgisweb/render/type/api';
import type { LngLatBoundsArray } from '@nextgis/utils';

function connector() {
  const get = vi.fn().mockResolvedValue([]);
  const route = vi.fn((_name: string, _params?: unknown) => ({ get }));
  const client = {
    options: { baseUrl: 'https://example.invalid' },
    route,
  } as unknown as NgwConnector;
  return { client, get, route };
}

function legendFixture() {
  const updateLayer = vi.fn();
  const layer = {
    id: 'layer-1',
    options: { id: 'layer-1' },
    layer: { id: 'native' },
    updateLayer,
  } as unknown as LayerAdapter;
  const hideLayer = vi.fn();
  const showLayer = vi.fn().mockResolvedValue(undefined);
  const webMap = {
    mapAdapter: { hideLayer },
    showLayer,
  } as unknown as WebMap;
  const { client, get, route } = connector();
  const onSymbolRenderChange = vi.fn();
  const legend = new Legend({
    resourceId: 42,
    layerId: 'layer-1',
    layer,
    webMap,
    connector: client,
    onSymbolRenderChange,
  });
  return {
    legend, layer, updateLayer, hideLayer, showLayer,
    get, route, onSymbolRenderChange,
  };
}

describe('NgwKit configuration and registration', () => {
  it('requires a URL when no connector is provided', () => {
    expect(() => new NgwKit({})).toThrow('url is not defined');
  });

  it('uses an existing connector and exposes its base URL', () => {
    const { client } = connector();
    const kit = new NgwKit({ connector: client });

    expect(kit.connector).toBe(client);
    expect(kit.url).toBe('https://example.invalid');
  });

  it('registers the WEBMAP adapter provider', async () => {
    const { client } = connector();
    const kit = new NgwKit({ connector: client });
    const adapters = await kit.getLayerAdapters();

    expect(adapters).toHaveLength(1);
    expect(adapters[0].name).toBe('WEBMAP');
    expect(typeof adapters[0].createAdapter).toBe('function');
  });

  it('loads a configured NGW webmap resource using the host map', async () => {
    const { client } = connector();
    const kit = new NgwKit({ connector: client, resourceId: 55, pixelRadius: 8 });
    const layer = { id: 'test-layer' };
    const addLayer = vi.fn().mockResolvedValue(layer);
    const webMap = { addLayer } as unknown as WebMap;

    expect(await kit.onLoadSync(webMap)).toBe(layer);
    expect(addLayer).toHaveBeenCalledWith(NgwWebmapLayerAdapter, {
      visibility: true,
      fit: true,
      pixelRadius: 8,
      resourceId: 55,
      connector: client,
      webMap,
    });
  });

  it('does not add a webmap when resourceId is absent', async () => {
    const { client } = connector();
    const kit = new NgwKit({ connector: client });
    const addLayer = vi.fn();
    const webMap = { addLayer } as unknown as WebMap;

    expect(await kit.onLoadSync(webMap)).toBeUndefined();
    expect(addLayer).not.toHaveBeenCalled();
  });
});

describe('NGW webmap legends without HTTP requests', () => {
  it('consolidates consecutive symbol indices into compact intervals', () => {
    const { legend, updateLayer, showLayer } = legendFixture();

    legend.setLegendSymbol([8, 2, 3, 4, 6]);

    expect(updateLayer).toHaveBeenCalledWith({
      params: { 'symbols[42]': '2-4,6,8' },
    });
    expect(showLayer).toHaveBeenCalledWith('layer-1', { silent: true });
  });

  it('updates symbol render status and notifies the subscriber', () => {
    const { legend, updateLayer, onSymbolRenderChange } = legendFixture();
    legend.legend = [
      { index: 1, render: true },
      { index: 2, render: true },
      { index: 3, render: true },
    ] as LegendSymbol[];

    legend.setSymbolRender(2, false);

    expect(updateLayer).toHaveBeenCalledWith({
      params: { 'symbols[42]': '1,3' },
    });
    expect(onSymbolRenderChange).toHaveBeenCalledWith([1, 3]);
    legend.setSymbolRender(2, false);
    expect(onSymbolRenderChange).toHaveBeenCalledOnce();
  });

  it('fetches a legend and exposes compatibility names for symbol metadata', async () => {
    const { legend, get, route } = legendFixture();
    get.mockResolvedValue([{
      index: 1, render: true,
      display_name: 'Roads', icon: 'road-icon',
    }]);

    const result = await legend.create({ cache: false });

    expect(route).toHaveBeenCalledWith('render.legend_symbols', { id: 42 });
    expect(get).toHaveBeenCalledWith({ cache: false });
    expect(result).toEqual([{
      index: 1, render: true,
      display_name: 'Roads', icon: 'road-icon',
      name: 'Roads', symbol: 'road-icon',
    }]);
  });

  it('updates attached layer references', () => {
    const { legend } = legendFixture();
    const replacement = { id: 'replacement' } as LayerAdapter;

    legend.attachLayer(replacement);

    expect(legend.layerId).toBe('replacement');
    expect(legend.layer).toBe(replacement);
  });
});

describe('NGW cached resources and bookmarks', () => {
  it('uses cached extent without requesting the resource again', async () => {
    class CachedResource extends NgwResource {
      setCachedExtent(bounds: LngLatBoundsArray) {
        this._extent = bounds;
      }
    }
    const resource = new CachedResource();
    const bounds: LngLatBoundsArray = [0, 1, 2, 3];
    resource.setCachedExtent(bounds);

    expect(await resource.getBounds()).toBe(bounds);
    expect(await resource.getExtent()).toBe(bounds);
  });

  it('caches a bookmark extent and retains its label', async () => {
    const { client, get, route } = connector();
    get.mockResolvedValue({
      extent: { minLon: 1, minLat: 2, maxLon: 3, maxLat: 4 },
    });
    const item = {
      id: 8,
      fields: { label: 'City' },
    } as unknown as FeatureItem;
    const bookmark = new BookmarkItem({
      connector: client,
      resourceId: 100,
      item,
      labelField: 'label',
    });

    expect(bookmark.name).toBe('City');
    expect(await bookmark.extent({ cache: false })).toEqual([1, 2, 3, 4]);
    expect(await bookmark.extent()).toEqual([1, 2, 3, 4]);
    expect(route).toHaveBeenCalledOnce();
    expect(route).toHaveBeenCalledWith(
      'feature_layer.feature.item_extent', { id: 100, fid: 8 },
    );
  });

  it('returns an already loaded geometry without a second API call', async () => {
    const { client, route } = connector();
    const item = {
      id: 6,
      fields: { name: 'Feature' },
      geom: { type: 'Point', coordinates: [1, 2] },
    } as unknown as FeatureItem;
    const bookmark = new BookmarkItem({
      connector: client,
      resourceId: 100,
      item,
    });

    await expect(bookmark.geoJson()).resolves.toEqual({
      type: 'Feature', id: 6,
      properties: { name: 'Feature' },
      geometry: { type: 'Point', coordinates: [1, 2] },
    });
    expect(route).not.toHaveBeenCalled();
  });
});
