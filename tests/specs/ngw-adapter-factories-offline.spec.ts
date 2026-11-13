import { describe, expect, it, vi } from 'vitest';

import { createAsyncAdapter, classAdapters } from '../../packages/ngw-kit/src/adapters/createAsyncAdapter';
import { createBasemapLayerAdapter } from '../../packages/ngw-kit/src/adapters/createBasemapLayerAdapter';
import { createRasterAdapter } from '../../packages/ngw-kit/src/adapters/createRasterAdapter';
import { NgwResource } from '../../packages/ngw-kit/src/NgwResource';

import type NgwConnector from '@nextgis/ngw-connector';
import type { WebMap } from '@nextgis/webmap';
import type { CompositeRead } from '@nextgisweb/resource/type/api';
import type { GetClassAdapterOptions, NgwLayerOptions } from '../../packages/ngw-kit/src/interfaces';

class NativeLayerAdapter {
  options: Record<string, any>;
  lastAddOptions?: Record<string, any>;
  updateLayer = vi.fn();

  constructor(readonly map: unknown, options: Record<string, any>) {
    this.options = options;
  }

  async addLayer(options: Record<string, any> = {}) {
    this.lastAddOptions = options;
    return { id: 'native-layer' };
  }
}

function resource(id: number, cls: string, extra: Record<string, unknown> = {}): CompositeRead {
  return {
    resource: { id, cls, display_name: 'Example', ...extra },
  } as unknown as CompositeRead;
}

function setup(options: {
  id?: number;
  cls?: string;
  adapter?: NgwLayerOptions['adapter'];
  supported?: string[];
  extra?: Record<string, unknown>;
} = {}) {
  const id = options.id ?? 42;
  const item = resource(id, options.cls ?? 'qgis_vector_style', options.extra);
  const getResource = vi.fn().mockResolvedValue(item);
  const getResourceChildren = vi.fn().mockResolvedValue([]);
  const get = vi.fn().mockResolvedValue([]);
  const route = vi.fn((_name: string) => ({ get }));
  const connector = {
    options: { baseUrl: 'https://ngw.invalid' },
    getResource, getResourceChildren, route,
  } as unknown as NgwConnector;
  const adapters: Record<string, typeof NativeLayerAdapter> = {};
  for (const name of options.supported ?? ['IMAGE', 'TILE', 'WMS', 'MVT', 'GEOJSON']) {
    adapters[name] = NativeLayerAdapter;
  }
  const webMap = {
    mapAdapter: { map: { id: 'map' }, layerAdapters: adapters },
    getLayerAdapters: () => adapters,
  } as unknown as WebMap;
  const layerOptions = { resource: id, ...(options.adapter ? { adapter: options.adapter } : {}) };
  const props = { item, connector, webMap, layerOptions } as GetClassAdapterOptions;
  return { props, item, connector, webMap, layerOptions, get, route, getResource, getResourceChildren };
}

describe('NGW raster adapter factory', () => {
  it('creates a native IMAGE adapter with the NGW rendering URL', async () => {
    const { props } = setup();
    const Adapter = await createRasterAdapter(props);
    expect(Adapter).toBeDefined();

    const layer = new Adapter!({}, { id: 'image-1' }) as unknown as NativeLayerAdapter;
    expect(layer.options.url).toBe('https://ngw.invalid/api/component/render/image');
    expect(layer.options.params).toEqual({ resource: 42 });
    expect(layer.options.resourceId).toBe(42);
    expect(layer.options.layers).toBe('42');
    expect((layer as any).ngwImageGroupingSafe).toBe(true);
  });

  it('passes resource options to the underlying native addLayer', async () => {
    const { props } = setup();
    const Adapter = await createRasterAdapter(props);
    const layer = new Adapter!({}, { id: 'image-1' }) as unknown as NativeLayerAdapter;
    await layer.addLayer({ visibility: false, order: 5 });

    expect(layer.lastAddOptions).toMatchObject({
      visibility: false, order: 5,
      url: 'https://ngw.invalid/api/component/render/image',
      resourceId: 42,
    });
  });

  it('uses TILE when the current engine does not implement IMAGE', async () => {
    const { props } = setup({ supported: ['TILE'] });
    const Adapter = await createRasterAdapter(props);
    const layer = new Adapter!({}, {}) as unknown as NativeLayerAdapter;

    expect(layer.options.url).toContain('/api/component/render/tile');
    expect(layer.options.url).toContain('resource=42');
    expect((layer as any).ngwImageGroupingSafe).toBe(false);
  });

  it('uses the WMS service URL for WMS resources', async () => {
    const { props } = setup({ cls: 'wmsserver_service' });
    const Adapter = await createRasterAdapter(props);
    const layer = new Adapter!({}, {}) as unknown as NativeLayerAdapter;

    expect(layer.options.url).toBe('https://ngw.invalid/api/resource/42/wms');
    expect(layer.options.format).toBe('image/png');
  });

  it('supports MVT and identifies the original resource', async () => {
    const { props } = setup({ cls: 'vector_layer', adapter: 'MVT' });
    const Adapter = await createRasterAdapter(props);
    const layer = new Adapter!({}, {}) as unknown as NativeLayerAdapter;

    expect(layer.options.sourceLayer).toBe('ngw:42');
    await expect((layer as any).getIdentificationIds()).resolves.toEqual([42]);
  });

  it('identifies the parent layer when the resource is a style', async () => {
    const { props } = setup({ extra: { parent: { id: 12 } } });
    const Adapter = await createRasterAdapter(props);
    const layer = new Adapter!({}, {}) as unknown as NativeLayerAdapter;

    await expect((layer as any).getIdentificationIds()).resolves.toEqual([12]);
  });

  it('returns no identification resources for an unparented image style', async () => {
    const { props } = setup();
    const Adapter = await createRasterAdapter(props);
    const layer = new Adapter!({}, {}) as unknown as NativeLayerAdapter;

    await expect((layer as any).getIdentificationIds()).resolves.toEqual([]);
  });

  it('remembers the grouping safety restrictions for custom rendering', async () => {
    const { props } = setup();
    props.layerOptions.adapterOptions = { updateWmsParams: () => ({}) } as never;
    const Adapter = await createRasterAdapter(props);
    const layer = new Adapter!({}, {}) as unknown as NativeLayerAdapter;

    expect((layer as any).ngwImageGroupingSafe).toBe(false);
  });

  it('preserves explicit adapter options over generated rendering parameters', async () => {
    const { props } = setup();
    props.layerOptions.adapterOptions = {
      opacity: 0.3, setViewDelay: 0, headers: { Authorization: 'custom' },
    };
    const Adapter = await createRasterAdapter(props);
    const layer = new Adapter!({}, {}) as unknown as NativeLayerAdapter;

    expect(layer.options.opacity).toBe(0.3);
    expect(layer.options.setViewDelay).toBe(0);
    expect(layer.options.headers).toEqual({ Authorization: 'custom' });
  });

  it('updates native layer parameters when its NGW feature filter changes', async () => {
    const { props } = setup();
    const Adapter = await createRasterAdapter(props);
    const layer = new Adapter!({}, {}) as unknown as NativeLayerAdapter;
    const filters = [['status', 'eq', 'active']] as never;

    await (layer as any).propertiesFilter(filters);
    expect(layer.options.params).toHaveProperty('filter[42]');
    expect(layer.updateLayer).toHaveBeenCalledWith({ params: layer.options.params });

    await (layer as any).propertiesFilter(null);
    expect(layer.options.params).not.toHaveProperty('filter[42]');
  });

  it('retrieves a legend using the render API with request options', async () => {
    const { props, route, get } = setup();
    const Adapter = await createRasterAdapter(props);
    const layer = new Adapter!({}, { id: 'styled-layer' }) as unknown as NativeLayerAdapter;
    const legends = await (layer as any).getLegend({ cache: false });

    expect(route).toHaveBeenCalledWith('render.legend_symbols', { id: 42 });
    expect(get).toHaveBeenCalledWith({ cache: false });
    expect(legends).toHaveLength(1);
  });

  it('does not fetch a legend when the layer has no ID', async () => {
    const { props, route } = setup();
    const Adapter = await createRasterAdapter(props);
    const layer = new Adapter!({}, {}) as unknown as NativeLayerAdapter;

    await expect((layer as any).getLegend()).resolves.toEqual([]);
    expect(route).not.toHaveBeenCalled();
  });

  it('reports an unknown map adapter rather than silently dropping the layer', async () => {
    const { props } = setup({ supported: [] });
    await expect(createRasterAdapter(props)).rejects.toThrow('not supported yet');
  });
});

describe('NGW basemap adapter factory', () => {
  it('uses the source tile URL and the NGW zoom limits', async () => {
    const { props } = setup();
    props.item.basemap_layer = {
      url: 'https://tiles.invalid/{z}/{x}/{y}.png',
      z_min: 2, z_max: 16, copyright_text: 'Map attribution',
    } as never;
    const Adapter = await createBasemapLayerAdapter(props);
    const layer = new Adapter!({}, { minZoom: 0, maxZoom: 20 }) as unknown as NativeLayerAdapter;
    await layer.addLayer({ minZoom: 0, maxZoom: 20 });

    expect(layer.options.baselayer).toBe(true);
    expect(layer.options.order).toBe(0);
    expect(layer.lastAddOptions).toMatchObject({
      url: 'https://tiles.invalid/{z}/{x}/{y}.png',
      minZoom: 2, maxZoom: 16, attribution: 'Map attribution',
    });
  });

  it('keeps explicit zoom limits if NGW supplies none', async () => {
    const { props } = setup();
    props.item.basemap_layer = { url: 'https://tiles.invalid/tile' } as never;
    const Adapter = await createBasemapLayerAdapter(props);
    const layer = new Adapter!({}, {}) as unknown as NativeLayerAdapter;
    await layer.addLayer({ minZoom: 4, maxZoom: 12 });

    expect(layer.lastAddOptions).toMatchObject({ minZoom: 4, maxZoom: 12 });
  });

  it('returns no tile adapter for a basemap without a source', async () => {
    const { props } = setup();
    props.item.basemap_layer = {} as never;
    await expect(createBasemapLayerAdapter(props)).resolves.toBeUndefined();
  });

  it('does not fabricate tile support in an engine without a TILE adapter', async () => {
    const { props } = setup({ supported: ['IMAGE'] });
    props.item.basemap_layer = { url: '/tiles' } as never;
    await expect(createBasemapLayerAdapter(props)).resolves.toBeUndefined();
  });
});

describe('NGW automatic resource class selection', () => {
  it('resolves a missing resource without returning an adapter', async () => {
    const { webMap, connector, getResource } = setup();
    getResource.mockResolvedValue(undefined);
    await expect(createAsyncAdapter({ resource: 404 }, webMap, connector))
      .rejects.toBe('Resource item is not found');
  });

  it('rejects unsupported resource classes', async () => {
    const { webMap, connector, getResource } = setup();
    getResource.mockResolvedValue(resource(42, 'unsupported_new_class'));
    await expect(createAsyncAdapter({ resource: 42 }, webMap, connector))
      .rejects.toBe("Resource class 'unsupported_new_class' not yet supported.");
  });

  it('returns no adapter if the resource ID cannot be resolved', async () => {
    const { webMap, connector } = setup();
    await expect(createAsyncAdapter({ resource: 0 }, webMap, connector))
      .resolves.toBeUndefined();
  });

  it('creates an NGW raster adapter with resource mixin methods', async () => {
    const { webMap, connector } = setup({ cls: 'qgis_raster_style' });
    const Adapter = await createAsyncAdapter({ resource: 42 }, webMap, connector);
    expect(Adapter).toBeDefined();
    const layer = new Adapter!({}, {}) as unknown as NativeLayerAdapter;

    expect((layer as any).resourceId).toBe(42);
    expect((layer as any).connector).toBe(connector);
    expect(layer).toHaveProperty('options');
    expect(Adapter!.prototype.item).toMatchObject({ resource: { id: 42 } });
    expect(typeof (layer as any).getBounds).toBe('function');
    expect(Reflect.ownKeys(NgwResource.prototype).length).toBeGreaterThan(1);
  });

  it('loads style children for raw raster resources', async () => {
    const { webMap, connector, getResource, getResourceChildren } = setup();
    getResource.mockImplementation(async (id: number) =>
      id === 42 ? resource(42, 'raster_layer') : resource(id, 'raster_style', { parent: { id: 42 } }),
    );
    getResourceChildren.mockResolvedValue([resource(51, 'raster_style')]);

    const Adapter = await createAsyncAdapter({ resource: 42 }, webMap, connector);
    expect(Adapter).toBeDefined();
    expect(getResourceChildren).toHaveBeenCalledWith(42);
    expect(getResource).toHaveBeenCalledWith(51);
  });

  it('returns no adapter when a raw raster resource has no child styles', async () => {
    const { webMap, connector, getResourceChildren } = setup({ cls: 'raster_layer' });
    getResourceChildren.mockResolvedValue([]);

    await expect(createAsyncAdapter({ resource: 42 }, webMap, connector))
      .resolves.toBeUndefined();
  });

  it('supports registered custom NGW resource classes', async () => {
    const { webMap, connector, getResource } = setup();
    class CustomAdapter extends NativeLayerAdapter {}
    getResource.mockResolvedValue(resource(42, 'custom_offline'));
    classAdapters.custom_offline = async () => CustomAdapter as never;
    try {
      const Adapter = await createAsyncAdapter({ resource: 42 }, webMap, connector);
      expect(Adapter).toBeDefined();
      expect(Adapter!.prototype.resourceId).toBe(42);
    } finally {
      delete classAdapters.custom_offline;
    }
  });

  it('selects registered custom adapters by requested rendering type', async () => {
    const { webMap, connector, getResource } = setup();
    class CustomAdapter extends NativeLayerAdapter {}
    getResource.mockResolvedValue(resource(42, 'custom_by_type'));
    classAdapters.custom_by_type = { TILE: async () => CustomAdapter as never };
    try {
      const Adapter = await createAsyncAdapter({ resource: 42, adapter: 'TILE' }, webMap, connector);
      expect(Adapter).toBeDefined();
    } finally {
      delete classAdapters.custom_by_type;
    }
  });
});
