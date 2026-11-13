import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { MaplibreGLMapAdapter } from '../../packages/maplibre-gl-map-adapter/src/MaplibreGLMapAdapter';
import { GeoJsonAdapter } from '../../packages/maplibre-gl-map-adapter/src/layer-adapters/GeoJsonAdapter';
import { mapHtml } from '../helpers/mapHtml';
import { buildWebMap } from '../helpers/universalTestCases/webMapTests';

import type { Feature, FeatureCollection, Point } from 'geojson';
import type { MapGeoJSONFeature, MapLayerMouseEvent } from 'maplibre-gl';
import type { WebMap } from '../../packages/webmap/src/WebMap';
import type { CreatePopupContentProps } from '../../packages/webmap/src/interfaces/LayerAdapter';

function station(id: number): Feature<Point> {
  return {
    type: 'Feature', id, properties: { label: `Station ${id}`, kind: 'station' },
    geometry: { type: 'Point', coordinates: [20 + id, 10 + id] },
  };
}
function data(...features: Feature<Point>[]): FeatureCollection<Point> {
  return { type: 'FeatureCollection', features };
}

describe('MapLibre native feature popups and labels (offline)', () => {
  const maps: WebMap[] = [];
  beforeEach(() => { document.body.innerHTML = mapHtml; });
  afterEach(() => {
    vi.restoreAllMocks();
    for (const map of maps.splice(0)) map.destroy();
  });

  async function createMap(): Promise<WebMap> {
    const map = await buildWebMap(MaplibreGLMapAdapter, {
      target: 'map', center: [21, 11], zoom: 6,
    });
    maps.push(map);
    return map;
  }

  it('renders HTML popup content with configured native width and close-button behavior', async () => {
    const map = await createMap();
    await map.addGeoJsonLayer({
      data: data(station(1)), type: 'point',
      paint: { type: 'circle', radius: 6 },
      popup: true,
      popupOptions: {
        popupContent: '<strong id="ml-popup-content">Sensor</strong>',
        maxWidth: 240, closeButton: false,
      },
    });
    await vi.waitFor(() => {
      expect(document.getElementById('ml-popup-content')?.textContent).toBe('Sensor');
    });
    const popup = document.querySelector<HTMLElement>('.maplibregl-popup');
    expect(popup).not.toBeNull();
    expect(popup?.style.maxWidth).toBe('240px');
    expect(popup?.querySelector('.maplibregl-popup-close-button')).toBeNull();
  });

  it('passes the feature to an asynchronous popup callback and invokes its close handlers on removal', async () => {
    const map = await createMap();
    const onClose = vi.fn();
    const createPopupContent = vi.fn(async ({ onClose: register }: CreatePopupContentProps) => {
      register(onClose);
      return '<div id="ml-async-popup">Async popup</div>';
    });
    const layer = await map.addGeoJsonLayer({
      data: data(station(1)), type: 'point',
      paint: { type: 'circle', radius: 6 },
      popup: true, popupOptions: { createPopupContent },
    });
    await vi.waitFor(() => {
      expect(document.getElementById('ml-async-popup')).not.toBeNull();
    });
    expect(createPopupContent).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'api', feature: expect.objectContaining({ id: 1 }) }),
    );
    map.removeLayer(layer);
    expect(onClose).toHaveBeenCalledOnce();
    expect(document.getElementById('ml-async-popup')).toBeNull();
  });

  it('does not duplicate the same feature popup when click selection refreshes it', async () => {
    const map = await createMap();
    const createPopupContent = vi.fn(() => 'Feature details');
    const layer = await map.addGeoJsonLayer({
      data: data(station(1)), type: 'point',
      paint: { type: 'circle', radius: 6 },
      selectedPaint: { type: 'circle', radius: 9 },
      selectable: true, popup: true, popupOnSelect: true,
      onMouseOver: () => undefined,
      popupOptions: { createPopupContent },
    });
    const adapter = layer as unknown as GeoJsonAdapter;
    const native = adapter.map;
    if (!native) throw new Error('MapLibre native map is missing');
    vi.spyOn(native, 'queryRenderedFeatures').mockReturnValue([
      adapter.getLayers()[0].feature as unknown as MapGeoJSONFeature,
    ]);
    expect(document.querySelectorAll('.maplibregl-popup')).toHaveLength(1);
    const event = {
      lngLat: { lng: 21, lat: 11 }, point: { x: 10, y: 20 },
      preventDefault: () => undefined,
    } as unknown as MapLayerMouseEvent;
    adapter._onLayerClick(event);
    expect(adapter.getSelected().map(({ feature }) => feature.id)).toEqual([1]);
    expect(document.querySelectorAll('.maplibregl-popup')).toHaveLength(1);
    expect(createPopupContent).toHaveBeenCalledOnce();
  });

  it('shows permanent labels from feature properties and updates them on feature filtering', async () => {
    const map = await createMap();
    const layer = await map.addGeoJsonLayer({
      data: data(station(1), station(2)), type: 'point',
      paint: { type: 'circle', radius: 6 },
      labelField: 'label', labelOnHover: false,
    });
    const adapter = layer as unknown as GeoJsonAdapter;
    await vi.waitFor(() => {
      expect(document.querySelectorAll('.maplibregl-popup')).toHaveLength(2);
    });
    expect(document.body.textContent).toContain('Station 1');
    expect(document.body.textContent).toContain('Station 2');

    adapter.filter(({ feature }) => feature.id === 2);
    await vi.waitFor(() => {
      expect(document.querySelectorAll('.maplibregl-popup')).toHaveLength(1);
    });
    expect(document.querySelector('.maplibregl-popup')?.textContent).toContain('Station 2');
    adapter.filter(() => true);
    await vi.waitFor(() => {
      expect(document.querySelectorAll('.maplibregl-popup')).toHaveLength(2);
    });
  });

  it('removes native label popups when their GeoJSON layer is removed', async () => {
    const map = await createMap();
    const layer = await map.addGeoJsonLayer({
      data: data(station(1)), type: 'point',
      paint: { type: 'circle', radius: 6 }, labelField: 'label',
    });
    await vi.waitFor(() => {
      expect(document.querySelector('.maplibregl-popup')?.textContent).toContain('Station 1');
    });
    map.removeLayer(layer);
    expect(document.querySelectorAll('.maplibregl-popup')).toHaveLength(0);
  });
});
