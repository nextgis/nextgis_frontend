import { latLngBounds } from 'leaflet';
import VectorLayer from 'ol/layer/Vector';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { LeafletMapAdapter } from '../../packages/leaflet-map-adapter/src/LeafletMapAdapter';
import { MaplibreGLMapAdapter } from '../../packages/maplibre-gl-map-adapter/src/MaplibreGLMapAdapter';
import { OlMapAdapter } from '../../packages/ol-map-adapter/src/OlMapAdapter';
import { mapHtml } from '../helpers/mapHtml';
import { buildWebMap } from '../helpers/universalTestCases/webMapTests';

import type { WebMap } from '../../packages/webmap/src/WebMap';

function nativeLeaflet(map: WebMap) {
  const adapter = map.mapAdapter as LeafletMapAdapter;
  if (!adapter.map) throw new Error('Leaflet not initialized');
  return { adapter, native: adapter.map };
}

function nativeOl(map: WebMap) {
  const adapter = map.mapAdapter as OlMapAdapter;
  if (!adapter.map) throw new Error('OpenLayers not initialized');
  return { adapter, native: adapter.map };
}

function nativeMaplibre(map: WebMap) {
  const adapter = map.mapAdapter as MaplibreGLMapAdapter;
  if (!adapter.map) throw new Error('MapLibre not initialized');
  return { adapter, native: adapter.map };
}

describe('Public native map camera, location and layer state (offline)', () => {
  const maps: WebMap[] = [];
  beforeEach(() => {
    document.body.innerHTML = mapHtml;
  });
  afterEach(() => {
    vi.restoreAllMocks();
    for (const map of maps.splice(0)) map.destroy();
  });

  async function build(
    adapter:
      | typeof LeafletMapAdapter
      | typeof OlMapAdapter
      | typeof MaplibreGLMapAdapter,
  ) {
    const map = await buildWebMap(adapter, {
      target: 'map',
      center: [20, 10],
      zoom: 6,
    });
    maps.push(map);
    return map;
  }

  it('handles uninitialized Leaflet map access and rejects control access before create', () => {
    const adapter = new LeafletMapAdapter();
    expect(adapter.getContainer()).toBeUndefined();
    expect(adapter.getCenter()).toBeUndefined();
    expect(adapter.getBounds()).toBeUndefined();
    expect(adapter.getZoom()).toBeUndefined();
    expect(() => adapter.getControlContainer()).toThrow('not initialized');
    adapter.setView([5, 6], 3);
    adapter.setCursor('crosshair');
  });

  it('routes Leaflet camera, fit options and cursor updates through the native map', async () => {
    const map = await build(LeafletMapAdapter);
    const { adapter, native } = nativeLeaflet(map);
    const setView = vi.spyOn(native, 'setView');
    adapter.setView([25, 15], 7);
    expect(setView).toHaveBeenCalledWith(
      [15, 25],
      7,
      expect.objectContaining({ animate: false }),
    );
    const fit = vi.spyOn(native, 'fitBounds');
    adapter.fitBounds([10, 5, 30, 20], {
      maxZoom: 8,
      padding: 12,
      offset: [1, 2],
    });
    expect(fit).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ maxZoom: 8, padding: [1, 2] }),
    );
    adapter.setCursor('crosshair');
    expect(native.getContainer().style.cursor).toBe('crosshair');
    expect(adapter.getLayerAdapter('GEOJSON')).toBe(
      LeafletMapAdapter.layerAdapters.GEOJSON,
    );
  });

  it('applies and removes Leaflet maximum bounds and zoom constraints', async () => {
    const map = await build(LeafletMapAdapter);
    const { adapter, native } = nativeLeaflet(map);
    adapter.setView({ maxBounds: [10, 5, 30, 20], minZoom: 3, maxZoom: 15 });
    const bounds = native.options.maxBounds;
    if (!bounds) throw new Error('Leaflet maximum bounds were not applied');
    const actualBounds = Array.isArray(bounds) ? latLngBounds(bounds) : bounds;
    expect(actualBounds.getWest()).toBe(10);
    expect(actualBounds.getEast()).toBe(30);
    expect(native.getMaxZoom()).toBe(15);
    adapter.setView({ maxBounds: null });
    expect(native.options.maxBounds).toBeFalsy();
  });

  it('subscribes to Leaflet geolocation events and unregisters on stop', async () => {
    const map = await build(LeafletMapAdapter);
    const { adapter, native } = nativeLeaflet(map);
    const locate = vi.spyOn(native, 'locate').mockReturnValue(native);
    const found = vi.fn();
    const failed = vi.fn();
    const locating = adapter.locate(
      { setView: true },
      {
        locationfound: found,
        locationerror: failed,
      },
    );
    expect(locate).toHaveBeenCalledWith({ setView: true });
    native.fire('locationfound', { latlng: { lng: 22, lat: 12 } });
    expect(found).toHaveBeenCalledWith({ lngLat: [22, 12] });
    native.fire('locationerror', { message: 'denied' });
    expect(failed).toHaveBeenCalledOnce();
    locating.stop();
    native.fire('locationfound', { latlng: { lng: 23, lat: 13 } });
    native.fire('locationerror', { message: 'denied again' });
    expect(found).toHaveBeenCalledOnce();
    expect(failed).toHaveBeenCalledOnce();
  });

  it('provides Leaflet no-op stop when geolocation listeners are omitted', async () => {
    const map = await build(LeafletMapAdapter);
    const { adapter, native } = nativeLeaflet(map);
    const locate = vi.spyOn(native, 'locate').mockReturnValue(native);
    const result = adapter.locate({ setView: false });
    expect(locate).toHaveBeenCalledWith({ setView: false });
    expect(() => result.stop()).not.toThrow();
  });

  it('reads and modifies an OpenLayers view without recreating it', async () => {
    const map = await build(OlMapAdapter);
    const { adapter, native } = nativeOl(map);
    const view = native.getView();
    adapter.setView([26, 16], 7);
    expect(native.getView()).toBe(view);
    expect(view.getZoom()).toBe(7);
    expect(adapter.getCenter()?.[0]).toBeCloseTo(26);
    expect(adapter.getCenter()?.[1]).toBeCloseTo(16);
    adapter.setView({ center: [24, 14], zoom: 8, minZoom: 2, maxZoom: 15 });
    expect(view.getZoom()).toBe(8);
    expect(view.getMinZoom()).toBe(2);
    expect(view.getMaxZoom()).toBe(15);
  });

  it('recreates the OpenLayers view only when the maximum extent changes', async () => {
    const map = await build(OlMapAdapter);
    const { adapter, native } = nativeOl(map);
    const original = native.getView();
    adapter.setView({ maxBounds: [10, 5, 30, 20] });
    expect(native.getView()).not.toBe(original);
    expect(native.getView().getProjection().getCode()).toBe('EPSG:3857');
  });

  it('translates OpenLayers geographic fit options and rotation', async () => {
    const map = await build(OlMapAdapter);
    const { adapter, native } = nativeOl(map);
    const fit = vi
      .spyOn(native.getView(), 'fit')
      .mockImplementation(() => undefined);
    adapter.fitBounds([10, 5, 30, 20], {
      maxZoom: 9,
      padding: 10,
      offset: [1, 2],
    });
    expect(fit).toHaveBeenCalledWith(
      expect.any(Array),
      expect.objectContaining({ maxZoom: 9, padding: [1, 2] }),
    );
    adapter.setRotation(0.4);
    expect(native.getView().getRotation()).toBeCloseTo(0.4);
  });

  it('reorders, hides and shows OpenLayers native vector layers without duplicates', async () => {
    const map = await build(OlMapAdapter);
    const { adapter, native } = nativeOl(map);
    const layer = new VectorLayer();
    adapter.showLayer(layer);
    adapter.showLayer(layer);
    expect(
      native
        .getLayers()
        .getArray()
        .filter((x) => x === layer),
    ).toHaveLength(1);
    adapter.setLayerOrder(layer, 15);
    adapter.setLayerOpacity(layer, 0.45);
    expect(layer.getZIndex()).toBe(15);
    expect(layer.getOpacity()).toBe(0.45);
    adapter.hideLayer(layer);
    expect(native.getLayers().getArray()).not.toContain(layer);
    adapter.showLayer(layer);
    adapter.removeLayer(layer);
    expect(native.getLayers().getArray()).not.toContain(layer);
  });

  it('converts MapLibre centers, zoom and bounds through the native camera', async () => {
    const map = await build(MaplibreGLMapAdapter);
    const { adapter, native } = nativeMaplibre(map);
    const jumpTo = vi.spyOn(native, 'jumpTo');
    adapter.setView([24, 14], 7);
    expect(jumpTo).toHaveBeenCalledWith({ center: [24, 14], zoom: 6 });
    adapter.setCenter([23, 13]);
    expect(adapter.getCenter()).toEqual([23, 13]);
    adapter.setZoom(8);
    expect(adapter.getZoom()).toBe(8);
    expect(adapter.getBounds()).toHaveLength(4);
  });

  it('applies MapLibre native bounds and independent view constraints', async () => {
    const map = await build(MaplibreGLMapAdapter);
    const { adapter, native } = nativeMaplibre(map);
    const fitBounds = vi.spyOn(native, 'fitBounds');
    const setMaxBounds = vi.spyOn(native, 'setMaxBounds');
    adapter.setView({ maxBounds: [10, 5, 30, 20], minZoom: 4, maxZoom: 14 });
    expect(setMaxBounds).toHaveBeenCalled();
    expect(native.getMinZoom()).toBe(3);
    expect(native.getMaxZoom()).toBe(13);
    adapter.fitBounds([10, 5, 30, 20], { maxZoom: 12 });
    expect(fitBounds).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ linear: true, duration: 0, maxZoom: 11 }),
    );
  });
});
