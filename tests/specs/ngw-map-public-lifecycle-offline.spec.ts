import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { NgwConnectorExtended } from '../../packages/ngw-connector/src/NgwConnectorExtended';
import { NgwMap } from '../../packages/ngw-map/src/NgwMap';
import { FakeMapAdapter } from '../helpers/classes/FakeMapAdapter';
import { mapHtml } from '../helpers/mapHtml';

import type { MapClickEvent } from '../../packages/webmap/src/interfaces/MapAdapter';
import type { NgwMapOptions } from '../../packages/ngw-map/src/interfaces';

const created: NgwMap[] = [];
const click: MapClickEvent = { lngLat: [30, 50], pixel: { left: 20, top: 30 } };
let nextConnectorId = 0;

async function makeMap(options: Partial<NgwMapOptions> = {}) {
  const mapAdapter = new FakeMapAdapter();
  // The connector is real; these scenarios do not call any server endpoints.
  const connector = new NgwConnectorExtended({
    baseUrl: 'https://offline.invalid',
    cacheId: `wave8-ngw-map-${nextConnectorId++}`,
  });
  const map = new NgwMap({
    target: 'map', mapAdapter, connector, ...options,
  });
  created.push(map);
  await map.onLoad('ngw-map:create');
  return { map, mapAdapter, connector };
}

describe('NgwMap lifecycle and selection with no NGW requests', () => {
  beforeEach(() => {
    document.body.innerHTML = mapHtml;
  });

  afterEach(() => {
    for (const map of created.splice(0)) map.destroy();
    vi.restoreAllMocks();
  });

  it('publishes NGW readiness and marks the map container', async () => {
    const { map } = await makeMap();
    expect(map.getEventStatus('ngw-map:create')).toBe(true);
    await vi.waitFor(() => {
      expect(map.getContainer()?.classList.contains('ngw-map-container')).toBe(true);
    });
    await expect(map.onLoad('ngw-map:create')).resolves.toBe(map);
  });

  it('exposes the supplied connector and an empty initial resource index', async () => {
    const { map, connector } = await makeMap();
    expect(map.connector).toBe(connector);
    expect(await map.getNgwLayers()).toEqual({});
    expect(await map.getNgwLayerByResourceId(42)).toBeUndefined();
  });

  it('restores the configured center and zoom when fit is requested', async () => {
    const { map } = await makeMap({ center: [30, 50], zoom: 7 });
    map.setCenter([1, 2]);
    map.setZoom(3);
    map.fit();
    expect(map.getCenter()).toEqual([30, 50]);
    expect(map.getZoom()).toBe(7);
  });

  it('uses configured bounds for fit when no initial center is present', async () => {
    const { map, mapAdapter } = await makeMap({ bounds: [10, 20, 30, 40] });
    const fit = vi.spyOn(mapAdapter, 'fitBounds');
    map.fit();
    expect(fit).toHaveBeenCalledWith([10, 20, 30, 40], undefined);
  });

  it('allows an application control to be added after NGW startup', async () => {
    const { map, mapAdapter } = await makeMap();
    const add = vi.spyOn(mapAdapter, 'addControl');
    const control = {
      onAdd: () => document.createElement('button'),
      onRemove: () => undefined,
    };
    await map.addControl(control, 'bottom-left', { id: 'editor', order: 4 });
    expect(add).toHaveBeenCalledWith(control, 'bottom-left', {
      id: 'editor', order: 4,
    });
  });

  it('enables selection exactly once during bootstrap', async () => {
    const { map } = await makeMap();
    expect(map.emitter.listenerCount('preclick')).toBe(1);
    expect(map.emitter.listenerCount('click')).toBe(1);
    expect(map.emitter.listenerCount('layer:click')).toBe(1);
    map.enableSelection();
    expect(map.emitter.listenerCount('click')).toBe(1);
  });

  it('removes and reinstates selection listeners without affecting the map', async () => {
    const { map } = await makeMap();
    map.disableSelection();
    expect(map.emitter.listenerCount('preclick')).toBe(0);
    expect(map.emitter.listenerCount('click')).toBe(0);
    expect(map.emitter.listenerCount('layer:click')).toBe(0);

    map.enableSelection();
    expect(map.emitter.listenerCount('preclick')).toBe(1);
    expect(map.emitter.listenerCount('click')).toBe(1);
    expect(map.emitter.listenerCount('layer:click')).toBe(1);
  });

  it('reports an empty raster selection without sending an identify request', async () => {
    const { map, connector } = await makeMap();
    const getResource = vi.spyOn(connector, 'getResource');
    const preselect = vi.fn<() => void>();
    const selected = vi.fn<(result: unknown) => void>();
    map.emitter.on('ngw:preselect', preselect);
    map.emitter.on('ngw:select', selected);

    await expect(map.selectFromNgwRaster(click)).resolves.toBeUndefined();

    expect(preselect).toHaveBeenCalledOnce();
    expect(selected).toHaveBeenCalledOnce();
    expect(selected).toHaveBeenCalledWith(null);
    expect(getResource).not.toHaveBeenCalled();
  });

  it('stops all selection listeners when selection is disabled', async () => {
    const { map } = await makeMap();
    const selected = vi.fn<(result: unknown) => void>();
    map.emitter.on('ngw:select', selected);
    map.disableSelection();

    map.emitter.emit('click', click);
    await Promise.resolve();
    expect(selected).not.toHaveBeenCalled();
  });
});
