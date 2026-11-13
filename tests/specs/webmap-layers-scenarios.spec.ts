import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { FakeLayerAdapter } from '../helpers/classes/FakeLayerAdapter';
import { FakeMapAdapter } from '../helpers/classes/FakeMapAdapter';
import { mapHtml } from '../helpers/mapHtml';
import { buildWebMap } from '../helpers/universalTestCases/webMapTests';

import type { AdapterOptions } from '../../packages/webmap/src/interfaces/LayerAdapter';
import type { WebMap } from '../../packages/webmap/src/WebMap';

// No network requests or native map-engine dependencies. The fake adapter
// deliberately retains the caller's layer ID and completes synchronously.
class InstantLayer extends FakeLayerAdapter {
  options: AdapterOptions = {};

  async addLayer(options: AdapterOptions): Promise<unknown> {
    this.options = { ...options };
    return { id: options.id };
  }
}

describe('WebMap layer lifecycle and public operations', () => {
  let map: WebMap;

  beforeEach(async () => {
    document.body.innerHTML = mapHtml;
    map = await buildWebMap(FakeMapAdapter, { target: 'map' });
  });

  afterEach(() => {
    map.destroy();
    vi.restoreAllMocks();
  });

  it('registers a custom ID and finds the layer by either ID or reference', async () => {
    const layer = await map.addLayer(InstantLayer, {
      id: 'roads',
      visibility: false,
    });

    expect(map.getLayers()).toEqual(['roads']);
    expect(map.getLayer('roads')).toBe(layer);
    expect(map.getLayer(layer)).toBe(layer);
    expect(map.getLayerId(layer)).toBe('roads');
    expect(map.allLayers().roads).toBe(layer);
    expect(map.findLayer((item) => item.id === 'roads')).toBe(layer);
    expect(map.findLayer(() => false)).toBeUndefined();
  });

  it('does not replace a registered layer with a duplicate ID', async () => {
    const original = await map.addLayer(InstantLayer, {
      id: 'unique',
      visibility: false,
    });

    await expect(
      map.addLayer(InstantLayer, { id: 'unique', visibility: false }),
    ).rejects.toThrow("layer with id 'unique' already exist");
    expect(map.getLayer('unique')).toBe(original);
    expect(map.getLayers()).toEqual(['unique']);
  });

  it('keeps explicit order and sorts the registered layers', async () => {
    const back = await map.addLayer(InstantLayer, {
      id: 'back',
      order: 20,
      visibility: false,
    });
    const front = await map.addLayer(InstantLayer, {
      id: 'front',
      order: 3,
      visibility: false,
    });

    expect(map.orderedLayers()).toEqual([front, back]);
    expect(map.reserveOrder()).toBeGreaterThan(0);
  });

  it('reserves base-layer and top-layer ordering', async () => {
    const base = await map.addBaseLayer(InstantLayer, {
      id: 'basemap',
      visibility: false,
    });
    const top = await map.addLayer(InstantLayer, {
      id: 'labels',
      toplayer: true,
      visibility: false,
    });

    expect(base.options.order).toBe(0);
    expect(top.options.order).toBe(10000);
    expect(map.isBaseLayer(base)).toBe(true);
    expect(map.isBaseLayer(top)).toBe(false);
    expect(map.getBaseLayersIds()).toEqual(['basemap']);
    expect(map.getBaseLayers()).toEqual([base]);
  });

  it('rejects layers marked as both base and top', async () => {
    await expect(
      map.addLayer(InstantLayer, {
        baselayer: true,
        toplayer: true,
        visibility: false,
      }),
    ).rejects.toThrow('Layer cannot be both baselayer and toplayer');
    expect(map.getLayers()).toEqual([]);
  });

  it('removes overlays while keeping the base layer', async () => {
    const base = await map.addBaseLayer(InstantLayer, {
      id: 'base',
      visibility: false,
    });
    await map.addLayer(InstantLayer, { id: 'overlay', visibility: false });

    map.removeOverlays();

    expect(map.getLayers()).toEqual(['base']);
    expect(map.getBaseLayers()).toEqual([base]);
  });

  it('removes only the layers accepted by the removal predicate', async () => {
    await map.addLayer(InstantLayer, { id: 'keep', visibility: false });
    await map.addLayer(InstantLayer, { id: 'remove', visibility: false });
    const callback = vi.fn((id: string) => id !== 'keep');

    map.removeLayers(callback);

    expect(callback).toHaveBeenCalledTimes(2);
    expect(map.getLayers()).toEqual(['keep']);
  });

  it('emits pre-toggle and completion events and changes visibility', async () => {
    const layer = await map.addLayer(InstantLayer, {
      id: 'visibility',
      visibility: false,
    });
    const preShow = vi.fn();
    const show = vi.fn();
    const preHide = vi.fn();
    const hide = vi.fn();
    map.emitter.on('layer:preshow', preShow);
    map.emitter.on('layer:show', show);
    map.emitter.on('layer:prehide', preHide);
    map.emitter.on('layer:hide', hide);

    await map.showLayer(layer);
    expect(map.isLayerVisible(layer)).toBe(true);
    await map.toggleLayer(layer);
    expect(map.isLayerVisible(layer)).toBe(false);
    expect(preShow).toHaveBeenCalledOnce();
    expect(show).toHaveBeenCalledOnce();
    expect(preHide).toHaveBeenCalledOnce();
    expect(hide).toHaveBeenCalledOnce();
  });

  it('supports silent visibility changes without layer events', async () => {
    const layer = await map.addLayer(InstantLayer, { visibility: false });
    const toggle = vi.fn();
    map.emitter.on('layer:toggle', toggle);

    await map.showLayer(layer, { silent: true });
    await map.hideLayer(layer, { silent: true });

    expect(toggle).not.toHaveBeenCalled();
    expect(map.isLayerVisible(layer)).toBe(false);
  });

  it('automatically hides the previously visible base layer', async () => {
    const first = await map.addBaseLayer(InstantLayer, {
      id: 'first',
      visibility: false,
    });
    const second = await map.addBaseLayer(InstantLayer, {
      id: 'second',
      visibility: false,
    });

    await map.showLayer(first);
    expect(map.getActiveBaseLayer()).toBe(first);
    await map.showLayer(second);

    expect(map.isLayerVisible(first)).toBe(false);
    expect(map.isLayerVisible(second)).toBe(true);
    expect(map.getActiveBaseLayer()).toBe(second);
  });

  it('filters attributions by visibility and base-layer status', async () => {
    await map.addBaseLayer(InstantLayer, {
      id: 'base', attribution: 'Base attribution', visibility: false,
    });
    await map.addLayer(InstantLayer, {
      id: 'visible', attribution: 'Visible attribution', visibility: true,
    });
    await map.addLayer(InstantLayer, {
      id: 'hidden', attribution: 'Hidden attribution', visibility: false,
    });

    expect(map.getAttributions({})).toEqual(['Visible attribution']);
    expect(map.getAttributions({ onlyVisible: false })).toEqual([
      'Base attribution', 'Visible attribution', 'Hidden attribution',
    ]);
    expect(map.getAttributions({ onlyVisible: false, onlyBaselayer: true }))
      .toEqual(['Base attribution']);
  });

  it('calls a layer-specific opacity setter or falls back to the map adapter', async () => {
    const layer = await map.addLayer(InstantLayer, { visibility: false });
    const adapterSetter = vi.spyOn(map.mapAdapter, 'setLayerOpacity');

    map.setLayerOpacity(layer, 0.3);
    expect(adapterSetter).toHaveBeenCalledWith(layer.layer, 0.3);

    const customSetter = vi.fn();
    layer.setOpacity = customSetter;
    map.setLayerOpacity(layer, 0.7);
    expect(customSetter).toHaveBeenCalledWith(0.7);
    expect(adapterSetter).toHaveBeenCalledTimes(1);
  });

  it('refreshes a visible layer using a silent hide/show when updateLayer is absent', async () => {
    const layer = await map.addLayer(InstantLayer, { visibility: true });
    const hide = vi.spyOn(map.mapAdapter, 'hideLayer');
    const show = vi.spyOn(layer as InstantLayer, 'showLayer');

    await map.updateLayer(layer);

    expect(hide).toHaveBeenCalledOnce();
    expect(show).toHaveBeenCalledOnce();
    expect(map.isLayerVisible(layer)).toBe(true);
  });

  it('accepts an asynchronous adapter constructor', async () => {
    const layer = await map.addLayerFromAsyncAdapter(
      async () => InstantLayer,
      { id: 'async-layer', visibility: false },
    );

    expect(layer.id).toBe('async-layer');
    expect(map.getLayer('async-layer')).toBe(layer);
  });

  it('runs onAdded after the layer is registered', async () => {
    const onAdded = vi.fn((layer: { id?: string }) => {
      expect(map.getLayer(layer.id!)).toBe(layer);
    });

    const layer = await map.addLayer(InstantLayer, {
      id: 'callback', visibility: false, onAdded,
    });

    expect(onAdded).toHaveBeenCalledOnce();
    expect(onAdded).toHaveBeenCalledWith(layer);
  });

  it('can remove a layer by ID and reports removal once', async () => {
    const layer = await map.addLayer(InstantLayer, {
      id: 'removable', visibility: false,
    });
    const before = vi.spyOn(layer as InstantLayer, 'removeLayer');
    const removed = vi.fn();
    map.emitter.on('layer:remove', removed);

    map.removeLayer('removable');
    map.removeLayer('removable');

    expect(before).toHaveBeenCalledOnce();
    expect(removed).toHaveBeenCalledOnce();
    expect(map.getLayer('removable')).toBeUndefined();
  });
});
