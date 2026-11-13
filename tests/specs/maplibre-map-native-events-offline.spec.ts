import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { MaplibreGLMapAdapter } from '../../packages/maplibre-gl-map-adapter/src/MaplibreGLMapAdapter';
import { mapHtml } from '../helpers/mapHtml';
import { buildWebMap } from '../helpers/universalTestCases/webMapTests';

import type { Feature, FeatureCollection, Point } from 'geojson';
import type { MapGeoJSONFeature, MapLayerMouseEvent } from 'maplibre-gl';

import type { GeoJsonAdapter } from '../../packages/maplibre-gl-map-adapter/src/layer-adapters/GeoJsonAdapter';
import type { WebMap } from '../../packages/webmap/src/WebMap';

function point(id: number): Feature<Point> {
  return {
    type: 'Feature',
    id,
    properties: { id, title: `Site ${id}` },
    geometry: { type: 'Point', coordinates: [20 + id, 10 + id] },
  };
}
function data(...features: Feature<Point>[]): FeatureCollection<Point> {
  return { type: 'FeatureCollection', features };
}

function clickEvent(): MapLayerMouseEvent {
  return {
    lngLat: { lng: 21, lat: 11 },
    point: { x: 20, y: 15 },
    preventDefault: vi.fn<() => void>(),
  } as unknown as MapLayerMouseEvent;
}

describe('MapLibre real map event routing and native layer state (offline)', () => {
  const maps: WebMap[] = [];
  beforeEach(() => {
    document.body.innerHTML = mapHtml;
  });
  afterEach(() => {
    vi.restoreAllMocks();
    for (const map of maps.splice(0)) map.destroy();
  });

  async function createMap(): Promise<WebMap> {
    const map = await buildWebMap(MaplibreGLMapAdapter, {
      target: 'map',
      center: [21, 11],
      zoom: 5,
    });
    maps.push(map);
    return map;
  }

  async function addPoint(
    map: WebMap,
    id = 1,
    options: { order?: number } = {},
  ) {
    const onClick = vi.fn();
    const onDoubleClick = vi.fn();
    const layer = await map.addGeoJsonLayer({
      data: data(point(id)),
      type: 'point',
      paint: { type: 'circle', color: '#2288aa', radius: 6 },
      selectedPaint: { type: 'circle', color: 'red', radius: 9 },
      selectable: true,
      multiselect: true,
      onMouseOver: () => undefined,
      onClick,
      onDoubleClick,
      ...options,
    });
    return {
      adapter: layer as unknown as GeoJsonAdapter,
      onClick,
      onDoubleClick,
    };
  }

  it('emits preclick before click with normalized coordinates', async () => {
    const map = await createMap();
    const order: string[] = [];
    const before = vi.fn<(event: { lngLat: number[] }) => void>(() => {
      order.push('preclick');
    });
    const after = vi.fn<(event: { lngLat: number[] }) => void>(() => {
      order.push('click');
    });
    map.mapAdapter.emitter.on('preclick', before);
    map.mapAdapter.emitter.on('click', after);
    (map.mapAdapter as MaplibreGLMapAdapter).onMapClick(clickEvent());
    expect(order).toEqual(['preclick', 'click']);
    expect(before).toHaveBeenCalledWith(
      expect.objectContaining({
        lngLat: [21, 11],
        pixel: { left: 20, top: 15 },
      }),
    );
    expect(after).toHaveBeenCalledOnce();
  });

  it('routes a native click to the highest-order feature layer only', async () => {
    const map = await createMap();
    const first = await addPoint(map, 1, { order: 1 });
    const second = await addPoint(map, 2, { order: 10 });
    const native = second.adapter.map;
    if (!native) throw new Error('Native MapLibre map is missing');
    vi.spyOn(native, 'queryRenderedFeatures').mockReturnValue([
      second.adapter.getLayers()[0].feature as unknown as MapGeoJSONFeature,
    ]);
    (map.mapAdapter as MaplibreGLMapAdapter).onMapClick(clickEvent());
    expect(second.onClick).toHaveBeenCalledOnce();
    expect(first.onClick).not.toHaveBeenCalled();
    expect(
      second.adapter.getSelected().map(({ feature }) => feature.id),
    ).toEqual([2]);
  });

  it('keeps only the first selected native feature when two layers overlap', async () => {
    const map = await createMap();
    const lower = await addPoint(map, 1, { order: 1 });
    const upper = await addPoint(map, 2, { order: 5 });
    const native = upper.adapter.map;
    if (!native) throw new Error('Native MapLibre map is missing');
    vi.spyOn(native, 'queryRenderedFeatures').mockReturnValue([
      upper.adapter.getLayers()[0].feature as unknown as MapGeoJSONFeature,
    ]);
    (map.mapAdapter as MaplibreGLMapAdapter).onMapClick(clickEvent());
    expect(upper.adapter.getSelected()).toHaveLength(1);
    expect(lower.adapter.getSelected()).toHaveLength(0);
  });

  it('sends double-click to the upper feature layer and emits predblclick first', async () => {
    const map = await createMap();
    const lower = await addPoint(map, 1, { order: 1 });
    const upper = await addPoint(map, 2, { order: 5 });
    const native = upper.adapter.map;
    if (!native) throw new Error('Native MapLibre map is missing');
    vi.spyOn(native, 'queryRenderedFeatures').mockReturnValue([
      upper.adapter.getLayers()[0].feature as unknown as MapGeoJSONFeature,
    ]);
    const sequence: string[] = [];
    const maplibreAdapter = map.mapAdapter as MaplibreGLMapAdapter;

    maplibreAdapter.emitter.on('predblclick', () => sequence.push('before'));
    maplibreAdapter.emitter.on('dblclick', () => sequence.push('after'));
    (map.mapAdapter as MaplibreGLMapAdapter).onMapDoubleClick(clickEvent());
    expect(sequence).toEqual(['before', 'after']);
    expect(upper.onDoubleClick).toHaveBeenCalledOnce();
    expect(lower.onDoubleClick).not.toHaveBeenCalled();
  });

  it('clears selection when a click hits no rendered features', async () => {
    const map = await createMap();
    const { adapter, onClick } = await addPoint(map);
    const native = adapter.map;
    if (!native) throw new Error('Native MapLibre map is missing');
    const hitTest = vi
      .spyOn(native, 'queryRenderedFeatures')
      .mockReturnValue([
        adapter.getLayers()[0].feature as unknown as MapGeoJSONFeature,
      ]);
    (map.mapAdapter as MaplibreGLMapAdapter).onMapClick(clickEvent());
    expect(adapter.getSelected()).toHaveLength(1);
    hitTest.mockReturnValue([]);
    (map.mapAdapter as MaplibreGLMapAdapter).onMapClick(clickEvent());
    expect(adapter.getSelected()).toHaveLength(0);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('updates the native visibility for every layer of one polygon adapter', async () => {
    const map = await createMap();
    const polygon: Feature = {
      type: 'Feature',
      id: 3,
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [20, 10],
            [22, 10],
            [22, 12],
            [20, 12],
            [20, 10],
          ],
        ],
      },
    };
    const layer = await map.addGeoJsonLayer({
      data: { type: 'FeatureCollection', features: [polygon] },
      type: 'polygon',
      paint: { type: 'path', color: 'orange', stroke: true },
    });
    const adapter = layer as unknown as GeoJsonAdapter;
    const native = adapter.map;
    if (!native) throw new Error('Native MapLibre map is missing');
    const ids = [...(adapter.layer ?? [])];
    expect(ids).toHaveLength(2);
    (map.mapAdapter as MaplibreGLMapAdapter).hideLayer(ids);
    await vi.waitFor(() => {
      for (const id of ids)
        expect(native.getLayoutProperty(id, 'visibility')).toBe('none');
    });
    (map.mapAdapter as MaplibreGLMapAdapter).showLayer(ids);
    await vi.waitFor(() => {
      for (const id of ids)
        expect(native.getLayoutProperty(id, 'visibility')).toBe('visible');
    });
  });

  it('applies opacity to an existing native line layer', async () => {
    const map = await createMap();
    const feature: Feature = {
      type: 'Feature',
      id: 5,
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: [
          [20, 10],
          [22, 12],
        ],
      },
    };
    const layer = await map.addGeoJsonLayer({
      data: { type: 'FeatureCollection', features: [feature] },
      type: 'line',
      paint: { type: 'path', color: 'blue', opacity: 1 },
    });
    const adapter = layer as unknown as GeoJsonAdapter;
    const native = adapter.map;
    const id = adapter.layer?.[0];
    if (!native || !id) throw new Error('Native line layer is missing');
    (map.mapAdapter as MaplibreGLMapAdapter).setLayerOpacity([id], 0.45);
    await vi.waitFor(() =>
      expect(native.getPaintProperty(id, 'line-opacity')).toBe(0.45),
    );
    expect(adapter.getLayers().map(({ feature }) => feature.id)).toEqual([5]);
  });
});
