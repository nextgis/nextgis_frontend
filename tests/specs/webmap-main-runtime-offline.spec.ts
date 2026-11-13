import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { WebMap } from '../../packages/webmap/src/WebMap';
import { FakeMapAdapter } from '../helpers/classes/FakeMapAdapter';
import { mapHtml } from '../helpers/mapHtml';

import type { MapOptions } from '../../packages/webmap/src/interfaces/MapOptions';
import type { RuntimeParams } from '../../packages/webmap/src/interfaces/RuntimeParams';
import type { MapAdapter, MapClickEvent } from '../../packages/webmap/src/interfaces/MapAdapter';
import type { LngLatBoundsArray } from '@nextgis/utils';

const created: WebMap[] = [];

function makeMap(options: MapOptions = {}) {
  const adapter = new FakeMapAdapter();
  const map = new WebMap({ target: 'map', ...options, mapAdapter: adapter, create: false });
  created.push(map);
  return { map, adapter };
}

describe('WebMap public state, view and map-event lifecycle (offline)', () => {
  beforeEach(() => {
    document.body.innerHTML = mapHtml;
  });

  afterEach(() => {
    for (const map of created.splice(0)) map.destroy();
    vi.restoreAllMocks();
  });

  it('builds the native map only once and records both creation statuses', async () => {
    const { map, adapter } = makeMap();
    const create = vi.spyOn(adapter, 'create');
    expect(map.getEventStatus('create')).toBe(false);
    expect(map.getEventStatus('build-map')).toBe(false);

    expect(await map.create()).toBe(map);
    expect(await map.create()).toBe(map);

    expect(create).toHaveBeenCalledOnce();
    expect(map.getEventStatus('create')).toBe(true);
    expect(map.getEventStatus('build-map')).toBe(true);
  });

  it('resolves an event waiter registered before creation', async () => {
    const { map } = makeMap();
    const loaded = map.onLoad('build-map');
    await map.create();
    await expect(loaded).resolves.toBe(map);
    await expect(map.onLoad('build-map')).resolves.toBe(map);
  });

  it('resolves native map readiness even when requested before create', async () => {
    const { map, adapter } = makeMap();
    const onReady = vi.fn<(mapAdapter: MapAdapter) => void>();
    const ready = map.onMapLoad(onReady);
    await map.create();

    await expect(ready).resolves.toBe(adapter);
    expect(onReady).toHaveBeenCalledOnce();
    expect(onReady).toHaveBeenCalledWith(adapter);
    expect(await map.onMapLoad()).toBe(adapter);
  });

  it('returns the target element before the native map has been created', () => {
    const { map } = makeMap();
    expect(map.getContainer()).toBe(document.getElementById('map'));
  });

  it('supports an HTMLElement target without constructing a native map', () => {
    const target = document.createElement('section');
    document.body.appendChild(target);
    const { map } = makeMap({ target });
    expect(map.getContainer()).toBe(target);
  });

  it('returns the cursor from the container when the adapter has no getter', () => {
    const { map } = makeMap();
    const target = map.getContainer();
    expect(target).toBeDefined();
    if (!target) throw new Error('Map target is missing');
    target.style.cursor = 'crosshair';
    expect(map.getCursor()).toBe('crosshair');
  });

  it('delegates cursor changes after map readiness', async () => {
    const { map, adapter } = makeMap();
    const setCursor = vi.spyOn(adapter, 'setCursor');
    await map.create();
    map.setCursor('pointer');
    await Promise.resolve();
    expect(setCursor).toHaveBeenCalledOnce();
    expect(setCursor).toHaveBeenCalledWith('pointer');
  });

  it('delegates center and zoom mutations and returns the same WebMap', async () => {
    const { map } = makeMap();
    await map.create();
    expect(map.setCenter([33, 44])).toBe(map);
    expect(map.setZoom(7)).toBe(map);
    expect(map.getCenter()).toEqual([33, 44]);
    expect(map.getZoom()).toBe(7);
  });

  it('uses the native setView when it is available', async () => {
    const { map, adapter } = makeMap();
    await map.create();
    const setView = vi.spyOn(adapter, 'setView');
    map.setView([20, 50], 8);
    expect(setView).toHaveBeenCalledOnce();
    expect(setView).toHaveBeenCalledWith([20, 50], 8);
  });

  it('falls back to setCenter and setZoom when setView is unavailable', async () => {
    const { map, adapter } = makeMap();
    await map.create();
    const setCenter = vi.spyOn(adapter, 'setCenter');
    const setZoom = vi.spyOn(adapter, 'setZoom');
    Object.assign(adapter, { setView: undefined });

    map.setView([20, 50], 0);

    expect(setCenter).toHaveBeenCalledOnce();
    expect(setCenter).toHaveBeenCalledWith([20, 50]);
    expect(setZoom).toHaveBeenCalledOnce();
    expect(setZoom).toHaveBeenCalledWith(0);
  });

  it('increases and decreases zoom using the generic fallback', async () => {
    const { map } = makeMap({ zoom: 6 });
    await map.create();
    map.zoomIn();
    expect(map.getZoom()).toBe(7);
    map.zoomOut();
    expect(map.getZoom()).toBe(6);
  });

  it('does not zoom when the underlying adapter cannot report a zoom', () => {
    const { map, adapter } = makeMap();
    const setZoom = vi.spyOn(adapter, 'setZoom');
    map.zoomIn();
    map.zoomOut();
    expect(setZoom).not.toHaveBeenCalled();
  });

  it('clamps Web Mercator latitude limits before fitting bounds', async () => {
    const { map, adapter } = makeMap();
    await map.create();
    const fitBounds = vi.spyOn(adapter, 'fitBounds');
    const bounds: LngLatBoundsArray = [10, -90, 30, 90];
    const options = { maxZoom: 12 };

    expect(map.fitBounds(bounds, options)).toBe(map);
    expect(bounds).toEqual([10, -85.06, 30, 85.06]);
    expect(fitBounds).toHaveBeenCalledOnce();
    expect(fitBounds).toHaveBeenCalledWith(bounds, options);
  });

  it('converts geographical map bounds to a GeoJSON polygon', async () => {
    const bounds: LngLatBoundsArray = [10, 20, 30, 40];
    const { map } = makeMap({ bounds });
    await map.create();
    const polygon = map.getBoundsPolygon();
    expect(polygon?.type).toBe('Feature');
    expect(polygon?.geometry.type).toBe('Polygon');
    expect(polygon?.geometry.coordinates[0]).toContainEqual([10, 20]);
    expect(polygon?.geometry.coordinates[0]).toContainEqual([30, 40]);
  });

  it('does not invent geographical bounds when the adapter has no getBounds', async () => {
    const { map, adapter } = makeMap();
    await map.create();
    Object.assign(adapter, { getBounds: undefined });
    expect(map.getBounds()).toBeUndefined();
    expect(map.getBoundsPolygon()).toBeUndefined();
  });

  it('reads initial map state from registered runtime parameters', async () => {
    const values: Record<string, string> = {
      center: '30_50', zoom: '6', bounds: '20_40_40_60',
    };
    const runtime: RuntimeParams = {
      params: () => values,
      get: (name) => values[String(name)],
      set: (name, value) => { values[String(name)] = String(value); },
      remove: (name) => { delete values[String(name)]; },
    };
    const { map } = makeMap({ runtimeParams: [runtime] });
    await map.create();

    expect(map.getRuntimeParams()).toEqual({
      center: [30, 50], zoom: 6, bounds: [20, 40, 40, 60],
    });
    expect(map.getCenter()).toEqual([30, 50]);
    expect(map.getZoom()).toBe(6);
  });

  it('persists only the state associated with a completed map movement', async () => {
    const updates = vi.fn<(name: string, value: string) => void>();
    const runtime: RuntimeParams = {
      params: () => ({}), get: () => undefined, set: updates, remove: () => undefined,
    };
    const { map, adapter } = makeMap({ center: [30, 50], zoom: 6, runtimeParams: [runtime] });
    await map.create();

    updates.mockClear();
    map.setCenter([31, 51]);
    adapter.emitter.emit('moveend', adapter);
    expect(updates).toHaveBeenCalledWith('center', '31.00000_51.00000');
    expect(updates.mock.calls.some(([name]) => name === 'zoom')).toBe(false);

    updates.mockClear();
    map.setZoom(9);
    adapter.emitter.emit('zoomend', adapter);
    expect(updates).toHaveBeenCalledOnce();
    expect(updates).toHaveBeenCalledWith('zoom', '9');
  });

  it('allows runtime parameter providers to be registered after creation', async () => {
    const { map } = makeMap({ center: [30, 50], zoom: 8 });
    await map.create();
    const runtime: RuntimeParams = {
      params: () => ({}), get: (name) => name === 'zoom' ? '11' : undefined,
      set: () => undefined, remove: () => undefined,
    };
    map.setRuntimeParams(runtime);
    expect(map.getRuntimeParams()).toMatchObject({ zoom: 11 });
  });

  it('restores ordinary map click forwarding after choosing a coordinate', async () => {
    const { map, adapter } = makeMap();
    await map.create();
    const publicClicks = vi.fn<(event: MapClickEvent) => void>();
    map.emitter.on('click', publicClicks);
    const picking = map.getCoordFromMapClick();
    const click: MapClickEvent = { lngLat: [13, 42], pixel: { left: 5, top: 6 } };

    adapter.emitter.emit('click', click);

    await expect(picking).resolves.toEqual([13, 42]);
    expect(publicClicks).not.toHaveBeenCalled();
    adapter.emitter.emit('click', click);
    expect(publicClicks).toHaveBeenCalledOnce();
    expect(publicClicks).toHaveBeenCalledWith(click);
  });

  it('stops forwarding map events after destroy', async () => {
    const { map, adapter } = makeMap();
    await map.create();
    const onMove = vi.fn<(mapAdapter: MapAdapter) => void>();
    map.emitter.on('moveend', onMove);
    adapter.emitter.emit('moveend', adapter);
    expect(onMove).toHaveBeenCalledOnce();

    map.destroy();
    adapter.emitter.emit('moveend', adapter);
    expect(onMove).toHaveBeenCalledOnce();
  });

  it('exposes the named adapters installed on the underlying map engine', async () => {
    const { map, adapter } = makeMap();
    await map.create();
    expect(map.getLayerAdapters()).toBe(adapter.layerAdapters);
    expect(map.getLayerAdapter('GEOJSON')).toBe(adapter.layerAdapters.GEOJSON);
  });

  it('returns an inert locator when no geolocation method exists', async () => {
    const { map, adapter } = makeMap();
    await map.create();
    Object.assign(adapter, { locate: undefined });
    expect(map.locate({ setView: false }).stop()).toEqual({});
  });
});
