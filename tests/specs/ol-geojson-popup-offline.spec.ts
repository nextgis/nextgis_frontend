import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fromLonLat } from 'ol/proj';

import { OlMapAdapter } from '../../packages/ol-map-adapter/src/OlMapAdapter';
import { mapHtml } from '../helpers/mapHtml';
import { buildWebMap } from '../helpers/universalTestCases/webMapTests';

import type { Feature, FeatureCollection, Point } from 'geojson';
import type Map from 'ol/Map';
import type { GeoJsonAdapter } from '../../packages/ol-map-adapter/src/layer-adapters/GeoJsonAdapter';
import type { WebMap } from '../../packages/webmap/src/WebMap';
import type { CreatePopupContentProps } from '../../packages/webmap/src/interfaces/LayerAdapter';

const point: Feature<Point> = {
  type: 'Feature', id: 11, properties: { label: 'Observation site' },
  geometry: { type: 'Point', coordinates: [21, 11] },
};
const data: FeatureCollection<Point> = { type: 'FeatureCollection', features: [point] };

function getNativeMap(map: WebMap): Map {
  const native = (map.mapAdapter as OlMapAdapter).map;
  if (!native) throw new Error('OpenLayers map was not initialized');
  return native;
}

describe('OpenLayers GeoJSON popup DOM and selection lifecycle (offline)', () => {
  const maps: WebMap[] = [];
  beforeEach(() => { document.body.innerHTML = mapHtml; });
  afterEach(() => {
    vi.restoreAllMocks();
    for (const map of maps.splice(0)) map.destroy();
  });

  async function createMap(): Promise<WebMap> {
    const map = await buildWebMap(OlMapAdapter, {
      target: 'map', center: [21, 11], zoom: 6,
    });
    maps.push(map);
    return map;
  }

  it('creates native overlay content, width constraints and WGS84-to-view positioning', async () => {
    const map = await createMap();
    const native = getNativeMap(map);
    await map.addGeoJsonLayer({
      data, type: 'point', paint: { type: 'circle', radius: 6 },
      popup: true,
      popupOptions: {
        popupContent: '<strong>Observation site</strong>',
        minWidth: 120, maxWidth: 240, closeButton: false,
      },
    });
    await vi.waitFor(() => expect(native.getOverlays().getLength()).toBe(1));
    const overlay = native.getOverlays().item(0);
    if (!overlay) throw new Error('OpenLayers popup overlay is missing');
    const element = overlay.getElement();
    expect(element?.querySelector('.popup-content')?.textContent).toBe('Observation site');
    expect(element?.style.minWidth).toBe('120px');
    expect(element?.style.maxWidth).toBe('240px');
    expect(element?.querySelector('.ol-popup-closer')).toBeNull();
    const position = overlay.getPosition();
    const expected = fromLonLat([21, 11]);
    expect(position?.[0]).toBeCloseTo(expected[0]);
    expect(position?.[1]).toBeCloseTo(expected[1]);
  });

  it('awaits asynchronous feature content and invokes registered handlers when closed', async () => {
    const map = await createMap();
    const native = getNativeMap(map);
    const closes: Array<() => void> = [];
    const onClose = vi.fn();
    const createPopupContent = vi.fn(async ({ close, onClose: register }: CreatePopupContentProps) => {
      closes.push(close);
      register(onClose);
      return 'Asynchronous popup';
    });
    await map.addGeoJsonLayer({
      data, type: 'point', paint: { type: 'circle', radius: 6 },
      popup: true, popupOptions: { createPopupContent },
    });
    await vi.waitFor(() => expect(native.getOverlays().getLength()).toBe(1));
    expect(createPopupContent).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'api', feature: expect.objectContaining({ id: 11 }) }),
    );
    expect(native.getOverlays().item(0).getElement()?.textContent).toContain('Asynchronous popup');
    expect(closes).toHaveLength(1);
    closes[0]();
    expect(native.getOverlays().getLength()).toBe(0);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('unselects a selected feature when its popup is closed by default', async () => {
    const map = await createMap();
    const native = getNativeMap(map);
    const closes: Array<() => void> = [];
    const layer = await map.addGeoJsonLayer({
      data, type: 'point', paint: { type: 'circle', radius: 6 },
      selectable: true, popupOnSelect: true,
      popupOptions: {
        createPopupContent: ({ close }) => {
          closes.push(close);
          return 'Selected point';
        },
      },
    });
    const geo = layer as unknown as GeoJsonAdapter;
    geo.select(({ feature }) => feature.id === 11);
    expect(geo.getSelected().map(({ feature }) => feature.id)).toEqual([11]);
    await vi.waitFor(() => expect(native.getOverlays().getLength()).toBe(1));
    closes[0]();
    expect(native.getOverlays().getLength()).toBe(0);
    expect(geo.getSelected()).toHaveLength(0);
  });

  it('keeps the feature selected when unselectOnClose is false', async () => {
    const map = await createMap();
    const native = getNativeMap(map);
    const closes: Array<() => void> = [];
    const layer = await map.addGeoJsonLayer({
      data, type: 'point', paint: { type: 'circle', radius: 6 },
      selectable: true, popupOnSelect: true,
      popupOptions: {
        unselectOnClose: false,
        createPopupContent: ({ close }) => {
          closes.push(close);
          return 'Persistent selection';
        },
      },
    });
    const geo = layer as unknown as GeoJsonAdapter;
    geo.select(({ feature }) => feature.id === 11);
    await vi.waitFor(() => expect(native.getOverlays().getLength()).toBe(1));
    closes[0]();
    expect(native.getOverlays().getLength()).toBe(0);
    expect(geo.getSelected().map(({ feature }) => feature.id)).toEqual([11]);
    geo.unselect();
    expect(geo.getSelected()).toHaveLength(0);
  });

  it('removes active popup overlays and calls close handlers during layer removal', async () => {
    const map = await createMap();
    const native = getNativeMap(map);
    const onClose = vi.fn();
    const layer = await map.addGeoJsonLayer({
      data, type: 'point', paint: { type: 'circle', radius: 6 },
      popup: true,
      popupOptions: {
        createPopupContent: ({ onClose: register }) => {
          register(onClose);
          return 'Active popup';
        },
      },
    });
    await vi.waitFor(() => expect(native.getOverlays().getLength()).toBe(1));
    map.removeLayer(layer);
    expect(native.getOverlays().getLength()).toBe(0);
    expect(onClose).toHaveBeenCalledOnce();
  });
});
