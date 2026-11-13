import { EventEmitter } from 'events';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { NgwWebmapLayerAdapter } from '../../packages/ngw-kit/src/NgwWebmapLayerAdapter';
import { fetchNgwLayerItems } from '../../packages/ngw-kit/src/utils/fetchNgwLayerItems';

import type NgwConnector from '@nextgis/ngw-connector';
import type { WebMap } from '@nextgis/webmap';
import type { CompositeRead } from '@nextgisweb/resource/type/api';
import type { NgwWebmapAdapterOptions } from '../../packages/ngw-kit/src/interfaces';

vi.mock('../../packages/ngw-kit/src/utils/fetchNgwLayerItems', () => ({
  fetchNgwLayerItems: vi.fn(),
}));

class OfflineWebmapItem {
  emitter = new EventEmitter();
  tree = { getDescendants: vi.fn().mockReturnValue([]) };
  properties = { property: vi.fn(() => ({ set: vi.fn(), get: () => true, isBlocked: () => false })) };
  constructor(readonly options: Record<string, any>) {
    queueMicrotask(() => this.emitter.emit('init'));
  }
}

function setup(options: Record<string, unknown> = {}) {
  const getResource = vi.fn().mockResolvedValue({
    resource: { id: 42, cls: 'webmap', display_name: 'Research map' },
    webmap: {
      initial_extent: [10, 20, 30, 40],
      extent_left: 1, extent_bottom: 2, extent_right: 3, extent_top: 4,
      constraining_extent: true, draw_order_enabled: true,
      root_item: { item_type: 'root', display_name: 'Old name', children: [] },
      bookmark_resource: { id: 77 },
    },
  } as unknown as CompositeRead);
  const getResourceOrFail = vi.fn().mockResolvedValue({
    feature_layer: { fields: [{ keyname: 'title', label_field: true }] },
  });
  const connector = {
    options: { baseUrl: 'https://offline.invalid' },
    withCredentials: false,
    getResource, getResourceOrFail,
    getAuthorizationHeaders: vi.fn().mockReturnValue({ Authorization: 'Basic test' }),
  } as unknown as NgwConnector;
  const removeLayer = vi.fn();
  const showLayer = vi.fn().mockResolvedValue(undefined);
  const addBaseLayer = vi.fn().mockResolvedValue({ id: 'basemap' });
  const setView = vi.fn();
  const webMap = {
    mapAdapter: { removeLayer },
    removeLayer, showLayer, addBaseLayer, setView,
    getActiveBaseLayer: vi.fn().mockReturnValue(undefined),
    getLayerAdapters: () => ({ IMAGE: {} }),
  } as unknown as WebMap;
  const adapterOptions = {
    resourceId: 42, connector, webMap, useBasemap: false, ...options,
  } as unknown as NgwWebmapAdapterOptions;
  const adapter = new NgwWebmapLayerAdapter({}, adapterOptions);
  adapter.NgwWebmapItem = OfflineWebmapItem as never;
  return { adapter, adapterOptions, connector, webMap, getResource, getResourceOrFail,
    removeLayer, showLayer, addBaseLayer, setView };
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(fetchNgwLayerItems).mockResolvedValue([]);
});

describe('NGW webmap layer adapter, isolated resource API', () => {
  it('rejects absent NGW webmap IDs', () => {
    expect(() => setup({ resourceId: 0 })).toThrow('NGW `resourceId` is not defined');
  });

  it('supports resource ID and custom layer ID tuples', () => {
    const { adapter } = setup({ resourceId: [15, 'custom-map'] });
    expect(adapter.resourceId).toBe(15);
    expect(adapter.options.id).toBe('custom-map');
  });

  it('loads a webmap and exposes its geographic bounds and bookmark resource', async () => {
    const { adapter, getResource } = setup();
    const layer = await adapter.addLayer(adapter.options);

    expect(layer).toBeDefined();
    expect(getResource).toHaveBeenCalledWith(42);
    expect(adapter.getBounds()).toEqual([1, 2, 3, 4]);
    expect(adapter.getExtent()).toEqual([1, 2, 3, 4]);
    expect(adapter.getBookmarksResourceId()).toBe(77);
  });

  it('sets the allowed extent when the NGW map constrains navigation', async () => {
    const { adapter, setView } = setup({ useExtentConstrained: true });
    await adapter.addLayer(adapter.options);

    expect(setView).toHaveBeenCalledWith({ maxBounds: [10, 20, 30, 40] });
  });

  it('returns no webmap layer for a missing resource', async () => {
    const { adapter, getResource } = setup();
    getResource.mockResolvedValue(undefined);

    expect(await adapter.addLayer(adapter.options)).toBeUndefined();
    expect(adapter.getBounds()).toBeUndefined();
  });

  it('returns no layer when the resource is not an NGW webmap', async () => {
    const { adapter, getResource } = setup();
    getResource.mockResolvedValue({ resource: { id: 42, cls: 'resource_group' } });

    expect(await adapter.addLayer(adapter.options)).toBeUndefined();
  });

  it('passes layer visibility and opacity to tree properties', async () => {
    const { adapter } = setup();
    await adapter.addLayer(adapter.options);
    const set = vi.fn();
    (adapter.layer as unknown as OfflineWebmapItem).properties.property.mockReturnValue({
      set, get: () => true, isBlocked: () => false,
    });

    await adapter.showLayer();
    await adapter.hideLayer();
    await adapter.setOpacity(0.4);

    expect(set).toHaveBeenNthCalledWith(1, true);
    expect(set).toHaveBeenNthCalledWith(2, false);
    expect(set).toHaveBeenNthCalledWith(3, 0.4);
  });

  it('collects and orders dependent legends', async () => {
    const { adapter } = setup();
    const layer = await adapter.addLayer(adapter.options) as unknown as OfflineWebmapItem;
    layer.tree.getDescendants.mockReturnValue([
      { id: 1, getLegend: vi.fn().mockResolvedValue([{ id: 'first' }]) },
      { id: 3, getLegend: vi.fn().mockResolvedValue([{ id: 'third' }]) },
    ]);

    expect(await adapter.getLegend()).toEqual([{ id: 'third' }, { id: 'first' }]);
  });

  it('includes only identifiable visible tree layers', async () => {
    const { adapter } = setup();
    const layer = await adapter.addLayer(adapter.options) as unknown as OfflineWebmapItem;
    const property = (visible: boolean, blocked: boolean) => ({
      property: () => ({ get: () => visible, isBlocked: () => blocked }),
    });
    layer.tree.getDescendants.mockReturnValue([
      { id: 1, item: { item_type: 'layer', layer_identifiable: true, style_parent_id: 11 }, properties: property(true, false) },
      { id: 2, item: { item_type: 'layer', layer_identifiable: true, style_parent_id: 12 }, properties: property(true, true) },
      { id: 3, item: { item_type: 'layer', layer_identifiable: false, style_parent_id: 13 }, properties: property(true, false) },
      { id: 4, item: { item_type: 'layer', layer_identifiable: true, style_parent_id: 14 }, properties: property(false, false) },
      { id: 5, item: { item_type: 'layer', layer_identifiable: true, style_parent_id: 15 }, properties: property(true, false) },
    ]);

    await expect(adapter.getIdentificationIds()).resolves.toEqual([15, 11]);
  });

  it('loads bookmark features with the NGW label field', async () => {
    const { adapter, connector, getResourceOrFail } = setup();
    await adapter.addLayer(adapter.options);
    vi.mocked(fetchNgwLayerItems).mockResolvedValue([
      { id: 9, fields: { title: 'First bookmark' } },
    ] as never);

    const bookmarks = await adapter.fetchBookmarks({ cache: false });
    expect(bookmarks).toHaveLength(1);
    expect(bookmarks[0].name).toBe('First bookmark');
    expect(getResourceOrFail).toHaveBeenCalledWith(77, { cache: false });
    expect(fetchNgwLayerItems).toHaveBeenCalledWith(expect.objectContaining({
      connector, resourceId: 77, fields: ['title'], geom: false, cache: false,
    }));
  });

  it('rejects bookmark requests before the webmap has loaded', async () => {
    const { adapter } = setup();
    expect(() => adapter.fetchBookmarks()).toThrow('Webmap was not loaded correctly');
  });

  it('removes dependent map layers and releases the constrained extent', async () => {
    const { adapter, removeLayer, setView } = setup({ useExtentConstrained: true });
    const layer = await adapter.addLayer(adapter.options) as unknown as OfflineWebmapItem;
    layer.tree.getDescendants.mockReturnValue([{
      layer: { layer: 'native-layer-id' },
    }]);

    adapter.removeLayer();
    expect(removeLayer).toHaveBeenCalledWith('native-layer-id');
    expect(setView).toHaveBeenLastCalledWith({ maxBounds: null });
    expect(adapter.getDependLayers()).toEqual([]);
    expect(adapter.getBounds()).toBeUndefined();
  });

  it('renames root items and injects NGW rendering options into child layers', async () => {
    const { adapter, getResource } = setup();
    const raw = {
      resource: { id: 42, cls: 'webmap', display_name: 'Renamed map' },
      webmap: {
        root_item: {
          item_type: 'root', children: [{
            item_type: 'layer', layer_style_id: 24, layer_adapter: 'image',
          }],
        },
      },
    };
    getResource.mockResolvedValue(raw);

    await adapter.addLayer(adapter.options);

    expect(raw.webmap.root_item).toHaveProperty('display_name', 'Renamed map');
    expect(raw.webmap.root_item.children[0]).toMatchObject({
      resourceId: 24,
      url: 'https://offline.invalid/api/component/render/image',
    });
  });

  it('adds the NGW default basemap when requested and none are configured', async () => {
    const { adapter, addBaseLayer } = setup({ useBasemap: true, defaultBasemap: true });
    await adapter.addLayer(adapter.options);

    expect(addBaseLayer).toHaveBeenCalledWith('OSM', {
      id: 'webmap-default-baselayer', name: 'OpenStreetMap',
    });
  });

  it('adds NGW basemaps with the first enabled layer visible', async () => {
    const { adapter, getResource, addBaseLayer } = setup({ useBasemap: true });
    getResource.mockResolvedValue({
      resource: { id: 42, cls: 'webmap', display_name: 'Basemaps' },
      webmap: { root_item: { item_type: 'root', children: [] } },
      basemap_webmap: { basemaps: [
        { resource_id: 5, display_name: 'Topo', enabled: true, opacity: 0.6 },
        { resource_id: 6, display_name: 'Satellite', enabled: true, opacity: 1 },
      ] },
    });
    await adapter.addLayer(adapter.options);

    await vi.waitFor(() => expect(addBaseLayer).toHaveBeenCalledTimes(2));
    expect(addBaseLayer.mock.calls[0][1]).toMatchObject({
      name: 'Topo', visibility: true,
    });
    expect(addBaseLayer.mock.calls[1][1]).toMatchObject({
      name: 'Satellite', visibility: false,
    });
  });
});
