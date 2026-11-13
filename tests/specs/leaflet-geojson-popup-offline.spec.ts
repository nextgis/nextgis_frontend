import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { LeafletMapAdapter } from '../../packages/leaflet-map-adapter/src/LeafletMapAdapter';
import { mapHtml } from '../helpers/mapHtml';
import { buildWebMap } from '../helpers/universalTestCases/webMapTests';

import type { Feature, FeatureCollection, Point } from 'geojson';
import type { GeoJsonAdapter } from '../../packages/leaflet-map-adapter/src/layer-adapters/GeoJsonAdapter/GeoJsonAdapter';
import type { WebMap } from '../../packages/webmap/src/WebMap';
import type { CreatePopupContentProps } from '../../packages/webmap/src/interfaces/LayerAdapter';

const station: Feature<Point> = {
  type: 'Feature', id: 7, properties: { name: 'Survey point' },
  geometry: { type: 'Point', coordinates: [21, 11] },
};
const data: FeatureCollection<Point> = { type: 'FeatureCollection', features: [station] };

describe('Leaflet GeoJSON native popup content and selection lifecycle (offline)', () => {
  const maps: WebMap[] = [];
  beforeEach(() => { document.body.innerHTML = mapHtml; });
  afterEach(() => {
    vi.restoreAllMocks();
    for (const map of maps.splice(0)) map.destroy();
  });

  async function createMap(): Promise<WebMap> {
    const map = await buildWebMap(LeafletMapAdapter, {
      target: 'map', center: [21, 11], zoom: 6,
    });
    maps.push(map);
    return map;
  }

  it('renders native popup HTML and respects the close-button configuration', async () => {
    const map = await createMap();
    await map.addGeoJsonLayer({
      data, type: 'point', paint: { type: 'circle', radius: 6 },
      popup: true,
      popupOptions: {
        popupContent: '<strong id="lf-popup-content">Survey point</strong>',
        closeButton: false, maxWidth: 260,
      },
    });
    await vi.waitFor(() => {
      expect(document.getElementById('lf-popup-content')?.textContent).toBe('Survey point');
    });
    expect(document.querySelector('.leaflet-popup-close-button')).toBeNull();
  });

  it('uses asynchronous createPopupContent and notifies close handlers', async () => {
    const map = await createMap();
    const closes: Array<() => void> = [];
    const onClose = vi.fn();
    const createPopupContent = vi.fn(async ({ close, onClose: register }: CreatePopupContentProps) => {
      closes.push(close);
      register(onClose);
      return '<span id="lf-async-popup">Async content</span>';
    });
    const layer = await map.addGeoJsonLayer({
      data, type: 'point', paint: { type: 'circle', radius: 6 },
      popup: true, popupOptions: { createPopupContent },
    });
    await vi.waitFor(() => {
      expect(document.getElementById('lf-async-popup')).not.toBeNull();
    });
    expect(createPopupContent).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'api', feature: expect.objectContaining({ id: 7 }) }),
    );
    expect(closes).toHaveLength(1);
    closes[0]();
    expect(onClose).toHaveBeenCalledOnce();
    const nativeFeature = (layer as GeoJsonAdapter).getLayers()[0]?.layer;
    if (!nativeFeature) throw new Error('Leaflet feature was not registered');
    expect(nativeFeature.getPopup() ?? null).toBeNull();
  });

  it('removes click-selected feature when its popup closes', async () => {
    const map = await createMap();
    const closes: Array<() => void> = [];
    const layer = await map.addGeoJsonLayer({
      data, type: 'point', paint: { type: 'circle', radius: 6 },
      selectable: true, popupOnSelect: true,
      popupOptions: {
        createPopupContent: ({ close }) => {
          closes.push(close);
          return 'Selection popup';
        },
      },
    });
    const geo = layer as unknown as GeoJsonAdapter;
    geo.select(({ feature }) => feature.id === 7);
    expect(geo.getSelected()).toHaveLength(1);
    await vi.waitFor(() => {
      expect(document.querySelector('.leaflet-popup-content')?.textContent).toContain('Selection popup');
    });
    closes[0]();
    expect(geo.getSelected()).toHaveLength(0);
    const nativeFeature = geo.getLayers()[0]?.layer;
    if (!nativeFeature) throw new Error('Leaflet feature was not registered');
    expect(nativeFeature.getPopup() ?? null).toBeNull();
  });

  it('preserves feature selection on close when the option disables auto-unselect', async () => {
    const map = await createMap();
    const closes: Array<() => void> = [];
    const layer = await map.addGeoJsonLayer({
      data, type: 'point', paint: { type: 'circle', radius: 6 },
      selectable: true, popupOnSelect: true,
      popupOptions: {
        unselectOnClose: false,
        createPopupContent: ({ close }) => {
          closes.push(close);
          return 'Keep selection';
        },
      },
    });
    const geo = layer as unknown as GeoJsonAdapter;
    geo.select(({ feature }) => feature.id === 7);
    await vi.waitFor(() => {
      expect(document.querySelector('.leaflet-popup-content')?.textContent).toContain('Keep selection');
    });
    closes[0]();
    expect(geo.getSelected()).toHaveLength(1);
    geo.unselect();
    expect(geo.getSelected()).toHaveLength(0);
  });
});
