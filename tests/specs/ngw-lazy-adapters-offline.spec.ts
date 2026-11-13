import { describe, expect, it, vi } from 'vitest';

import { createOnFirstShowAdapter } from '../../packages/ngw-kit/src/adapters/createOnFirstShowAdapter';
import { createOnFirstShowNgwAdapter } from '../../packages/ngw-kit/src/adapters/createOnFirstShowNgwAdapter';
import { createAsyncAdapter } from '../../packages/ngw-kit/src/adapters/createAsyncAdapter';

import type NgwConnector from '@nextgis/ngw-connector';
import type { WebMap } from '@nextgis/webmap';

vi.mock('../../packages/ngw-kit/src/adapters/createAsyncAdapter', () => ({
  createAsyncAdapter: vi.fn(),
}));

// The public adapter interface permits these hooks to be absent, but a deferred
// adapter must provide them. Assert the runtime contract and narrow the type.
function assertCallable<T extends (...args: any[]) => unknown>(
  fn: T | undefined,
): asserts fn is T {
  expect(fn).toBeTypeOf('function');
}

class NativeLayerAdapter {
  options: Record<string, any>;
  layer?: unknown;
  static added = vi.fn();

  constructor(readonly map: unknown, options: Record<string, any> = {}) {
    this.options = options;
  }

  async addLayer(options: Record<string, any> = {}) {
    NativeLayerAdapter.added(options);
    return { id: 'native' };
  }
}

function setup() {
  const showLayer = vi.fn().mockResolvedValue(undefined);
  const hideLayer = vi.fn().mockResolvedValue(undefined);
  const removeLayer = vi.fn();
  const webMap = {
    mapAdapter: { map: { id: 'native-map' } },
    showLayer, hideLayer, removeLayer,
  } as unknown as WebMap;
  return { webMap, showLayer, hideLayer, removeLayer };
}

describe('NGW deferred layer creation', () => {
  it('does not create a native layer before first show', async () => {
    const { webMap } = setup();
    const createAdapter = vi.fn().mockResolvedValue(NativeLayerAdapter);
    const Provider = await createOnFirstShowAdapter({ webMap, createAdapter });
    const layer = new Provider();

    expect(layer.addLayer({})).toEqual([]);
    expect(layer.destroyed()).toBe(false);
    expect(createAdapter).not.toHaveBeenCalled();
  });

  it('loads a native adapter once when first shown', async () => {
    const { webMap, showLayer } = setup();
    const createAdapter = vi.fn().mockResolvedValue(NativeLayerAdapter);
    const onLayerAdded = vi.fn();
    NativeLayerAdapter.added.mockClear();
    const Provider = await createOnFirstShowAdapter({
      webMap, createAdapter, onLayerAdded,
      adapterOptions: { opacity: 0.35 },
    });
    const layer = new Provider();
    layer.options = { order: 4, headers: { Authorization: 'Test' }, baselayer: true };

    assertCallable(layer.showLayer);
    await layer.showLayer();

    expect(createAdapter).toHaveBeenCalledOnce();
    expect(layer.layer).toHaveLength(1);
    expect(NativeLayerAdapter.added).toHaveBeenCalledWith({
      order: 4, headers: { Authorization: 'Test' }, baselayer: true,
    });
    expect(onLayerAdded).toHaveBeenCalledWith(layer.layer[0]);
    expect(layer.layer[0].options.opacity).toBe(0.35);
    expect(showLayer).toHaveBeenCalledWith(layer.layer[0]);
  });

  it('reuses the same native adapter on subsequent shows', async () => {
    const { webMap, showLayer } = setup();
    const createAdapter = vi.fn().mockResolvedValue(NativeLayerAdapter);
    const Provider = await createOnFirstShowAdapter({ webMap, createAdapter });
    const layer = new Provider();

    assertCallable(layer.showLayer);
    await layer.showLayer();
    await layer.showLayer();

    expect(createAdapter).toHaveBeenCalledOnce();
    expect(showLayer).toHaveBeenCalledTimes(2);
    expect(layer.layer).toHaveLength(1);
  });

  it('hides the previously loaded real layer and updates visibility', async () => {
    const { webMap, hideLayer } = setup();
    const Provider = await createOnFirstShowAdapter({
      webMap, createAdapter: async () => NativeLayerAdapter as never,
    });
    const layer = new Provider();
    assertCallable(layer.showLayer);
    await layer.showLayer();

    assertCallable(layer.hideLayer);
    await layer.hideLayer();

    expect(layer.options.visibility).toBe(false);
    expect(hideLayer).toHaveBeenCalledWith(layer.layer[0]);
  });

  it('does not trigger a network load when hiding before first show', async () => {
    const { webMap, hideLayer } = setup();
    const createAdapter = vi.fn().mockResolvedValue(NativeLayerAdapter);
    const Provider = await createOnFirstShowAdapter({ webMap, createAdapter });
    const layer = new Provider();

    assertCallable(layer.hideLayer);
    await layer.hideLayer();

    expect(createAdapter).not.toHaveBeenCalled();
    expect(hideLayer).not.toHaveBeenCalled();
  });

  it('removes its native child layer on disposal', async () => {
    const { webMap, removeLayer } = setup();
    const Provider = await createOnFirstShowAdapter({
      webMap, createAdapter: async () => NativeLayerAdapter as never,
    });
    const layer = new Provider();
    assertCallable(layer.showLayer);
    await layer.showLayer();

    assertCallable(layer.removeLayer);
    layer.removeLayer();

    expect(layer.destroyed()).toBe(true);
    expect(removeLayer).toHaveBeenCalledWith(layer.layer[0]);
  });

  it('can load without showing a hidden parent layer', async () => {
    const { webMap, showLayer } = setup();
    const Provider = await createOnFirstShowAdapter({
      webMap, createAdapter: async () => NativeLayerAdapter as never,
    });
    const layer = new Provider();

    const children = await layer.loadLayer();

    expect(children).toHaveLength(1);
    expect(showLayer).not.toHaveBeenCalled();
  });

  it('does not register a child when no native adapter is available', async () => {
    const { webMap, showLayer } = setup();
    const Provider = await createOnFirstShowAdapter({
      webMap, createAdapter: async () => undefined,
    });
    const layer = new Provider();

    assertCallable(layer.showLayer);
    await layer.showLayer();

    expect(layer.layer).toEqual([]);
    expect(showLayer).not.toHaveBeenCalled();
  });

  it('prevents a concurrent request from constructing the same adapter twice', async () => {
    const { webMap } = setup();
    let release!: (value: typeof NativeLayerAdapter) => void;
    const deferred = new Promise<typeof NativeLayerAdapter>(resolve => { release = resolve; });
    const createAdapter = vi.fn().mockReturnValue(deferred);
    const Provider = await createOnFirstShowAdapter({ webMap, createAdapter });
    const layer = new Provider();

    const first = layer.loadLayer();
    const second = layer.loadLayer();
    release(NativeLayerAdapter);
    await Promise.all([first, second]);

    expect(createAdapter).toHaveBeenCalledOnce();
    expect(layer.layer).toHaveLength(1);
  });
});

describe('NGW first-show resource configuration', () => {
  it('passes the NGW resource ID and display options into the real factory', async () => {
    const { webMap, showLayer } = setup();
    const connector = { options: { baseUrl: 'https://ngw.invalid' } } as NgwConnector;
    const create = vi.mocked(createAsyncAdapter);
    create.mockResolvedValue(NativeLayerAdapter as never);
    create.mockClear();
    const Provider = await createOnFirstShowNgwAdapter({
      webMap, connector,
      item: { resource_id: 17, display_name: 'Public roads', opacity: 0.6 } as never,
    });
    const layer = new Provider();
    assertCallable(layer.showLayer);
    await layer.showLayer();

    expect(create).toHaveBeenCalledWith({
      resource: 17,
      adapterOptions: { name: 'Public roads', opacity: 0.6 },
    }, webMap, connector);
    expect(showLayer).toHaveBeenCalledOnce();
  });

  it('generates the stable child layer ID with an optional prefix', async () => {
    const { webMap } = setup();
    vi.mocked(createAsyncAdapter).mockResolvedValue(NativeLayerAdapter as never);
    const Provider = await createOnFirstShowNgwAdapter({
      webMap,
      connector: { options: {} } as NgwConnector,
      item: { resource_id: 19, display_name: 'Buildings', opacity: 1 } as never,
      idPrefix: 'offline-test',
    });
    const layer = new Provider();
    assertCallable(layer.showLayer);
    await layer.showLayer();
    const children = layer.layer as NativeLayerAdapter[];

    expect(children).toHaveLength(1);
    expect((children[0] as any).id).toBe('offline-test-19');
    expect(children[0].options.baselayer).toBe(false);
  });
});
