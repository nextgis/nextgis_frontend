import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { MaplibreGLMapAdapter } from '../../packages/maplibre-gl-map-adapter/src/MaplibreGLMapAdapter';
import { mapHtml } from '../helpers/mapHtml';
import { buildWebMap } from '../helpers/universalTestCases/webMapTests';

import type {
  Feature,
  FeatureCollection,
  LineString,
  Point,
  Polygon,
} from 'geojson';
import type { MapGeoJSONFeature, MapLayerMouseEvent } from 'maplibre-gl';

import type { GeoJsonAdapter } from '../../packages/maplibre-gl-map-adapter/src/layer-adapters/GeoJsonAdapter';
import type { WebMap } from '../../packages/webmap/src/WebMap';

const point = (id: number, kind: string): Feature<Point> => ({
  type: 'Feature',
  id,
  properties: { kind, label: `Station ${id}` },
  geometry: { type: 'Point', coordinates: [20 + id, 10 + id] },
});

const points = (...features: Feature<Point>[]): FeatureCollection<Point> => ({
  type: 'FeatureCollection',
  features,
});

const polygon: Feature<Polygon> = {
  type: 'Feature',
  id: 21,
  properties: { kind: 'reserve' },
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [20, 10],
        [24, 10],
        [24, 14],
        [20, 14],
        [20, 10],
      ],
    ],
  },
};

const road: Feature<LineString> = {
  type: 'Feature',
  id: 31,
  properties: { kind: 'road' },
  geometry: {
    type: 'LineString',
    coordinates: [
      [20, 10],
      [24, 14],
    ],
  },
};

describe('MapLibre real native GeoJSON source, paint and filters (offline)', () => {
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
      center: [24, 14],
      zoom: 5,
    });
    maps.push(map);
    return map;
  }

  function nativeLayer(adapter: GeoJsonAdapter, index = 0): string {
    const id = adapter.layer?.[index];
    if (!id) throw new Error(`Expected native layer at index ${index}`);
    return id;
  }

  it('registers native fill, stroke and selected paint layers for polygons', async () => {
    const map = await createMap();
    const layer = await map.addGeoJsonLayer({
      data: { type: 'FeatureCollection', features: [polygon] },
      type: 'polygon',
      paint: { type: 'path', fill: true, stroke: true, color: '#123456' },
      selectedPaint: { type: 'path', fillColor: '#abcdef', stroke: true },
    });
    const adapter = layer as unknown as GeoJsonAdapter;
    const native = adapter.map;
    expect(native).toBeDefined();
    expect(adapter.layer).toHaveLength(4);
    for (const id of adapter.layer ?? []) {
      expect(native?.getLayer(id)).toBeDefined();
    }
    expect(native?.getLayer(nativeLayer(adapter))).toMatchObject({
      type: 'fill',
    });
    expect(native?.getLayer(nativeLayer(adapter, 1))).toMatchObject({
      type: 'line',
    });
  });

  it('installs a native line paint layer for LineString geometry', async () => {
    const map = await createMap();
    const layer = await map.addGeoJsonLayer({
      data: { type: 'FeatureCollection', features: [road] },
      type: 'line',
      paint: { type: 'path', color: '#123456', stroke: true, weight: 3 },
    });
    const adapter = layer as unknown as GeoJsonAdapter;
    const id = nativeLayer(adapter);
    expect(adapter.map?.getLayer(id)).toMatchObject({ type: 'line' });
    expect(adapter.map?.getPaintProperty(id, 'line-color')).toBe('#123456');
    expect(adapter.map?.getPaintProperty(id, 'line-width')).toBe(3);
  });

  it('registers native circle and selected layers for points', async () => {
    const map = await createMap();
    const layer = await map.addGeoJsonLayer({
      data: points(point(1, 'sensor')),
      type: 'point',
      paint: { type: 'circle', radius: 5, color: '#116633' },
      selectedPaint: { type: 'circle', radius: 9, color: '#ff0000' },
    });
    const adapter = layer as unknown as GeoJsonAdapter;
    expect(adapter.layer).toHaveLength(2);
    expect(adapter.map?.getLayer(nativeLayer(adapter))).toMatchObject({
      type: 'circle',
    });
    expect(
      adapter.map?.getPaintProperty(nativeLayer(adapter), 'circle-radius'),
    ).toBe(5);
    expect(
      adapter.map?.getPaintProperty(nativeLayer(adapter, 1), 'circle-radius'),
    ).toBe(9);
  });

  it('updates native circle paint through WebMap without replacing features', async () => {
    const map = await createMap();
    const layer = await map.addGeoJsonLayer({
      data: points(point(1, 'sensor')),
      type: 'point',
      paint: { type: 'circle', radius: 5, color: '#116633' },
    });
    const adapter = layer as unknown as GeoJsonAdapter;
    const native = adapter.map;
    const id = nativeLayer(adapter);
    map.setLayerPaint(layer, { type: 'circle', radius: 7, color: '#225577' });
    await vi.waitFor(() => {
      expect(native?.getPaintProperty(id, 'circle-radius')).toBe(7);
      expect(native?.getPaintProperty(id, 'circle-color')).toBe('#225577');
    });
    expect(layer.getLayers().map(({ feature }) => feature.id)).toEqual([1]);
  });

  it('applies global opacity to a native circle style', async () => {
    const map = await createMap();
    const layer = await map.addGeoJsonLayer({
      data: points(point(1, 'sensor')),
      type: 'point',
      paint: { type: 'circle', color: '#116633', opacity: 1 },
    });
    const adapter = layer as unknown as GeoJsonAdapter;
    const id = nativeLayer(adapter);
    map.setLayerOpacity(layer, 0.35);
    await vi.waitFor(() => {
      expect(adapter.map?.getPaintProperty(id, 'circle-opacity')).toBeCloseTo(
        0.35,
      );
    });
    expect(adapter.options.opacity).toBe(0.35);
  });

  it('translates an equality properties filter into a native filter', async () => {
    const map = await createMap();
    const layer = await map.addGeoJsonLayer({
      data: points(point(1, 'river'), point(2, 'road')),
      type: 'point',
      paint: { type: 'circle', radius: 6 },
    });
    const adapter = layer as unknown as GeoJsonAdapter;
    await adapter.propertiesFilter([['kind', 'eq', 'road']]);
    const filter = adapter.map?.getFilter(nativeLayer(adapter));
    expect(filter).toBeDefined();
    expect(JSON.stringify(filter)).toContain('"kind"');
    expect(JSON.stringify(filter)).toContain('"road"');
    expect(adapter.getLayers()).toHaveLength(2);
  });

  it('converts set membership and negated membership into native filters', async () => {
    const map = await createMap();
    const layer = await map.addGeoJsonLayer({
      data: points(point(1, 'road'), point(2, 'rail')),
      type: 'point',
      paint: { type: 'circle', radius: 6 },
    });
    const adapter = layer as unknown as GeoJsonAdapter;
    const id = nativeLayer(adapter);
    await adapter.propertiesFilter([['kind', 'in', ['road', 'rail']]]);
    expect(JSON.stringify(adapter.map?.getFilter(id))).toContain('"in"');
    await adapter.propertiesFilter([['kind', 'notin', ['rail']]]);
    expect(JSON.stringify(adapter.map?.getFilter(id))).toContain('"!in"');
  });

  it('clears native property constraints while retaining the geometry filter', async () => {
    const map = await createMap();
    const layer = await map.addGeoJsonLayer({
      data: points(point(1, 'road'), point(2, 'rail')),
      type: 'point',
      paint: { type: 'circle', radius: 6 },
    });
    const adapter = layer as unknown as GeoJsonAdapter;
    const id = nativeLayer(adapter);
    await adapter.propertiesFilter([['kind', 'eq', 'road']]);
    expect(JSON.stringify(adapter.map?.getFilter(id))).toContain('"road"');
    await adapter.propertiesFilter(null);
    const finalFilter = JSON.stringify(adapter.map?.getFilter(id));
    expect(finalFilter).toContain('"$type"');
    expect(finalFilter).not.toContain('"road"');
  });

  it('selects features by a properties filter and clears that selection', async () => {
    const map = await createMap();
    const layer = await map.addGeoJsonLayer({
      data: points(point(1, 'road'), point(2, 'rail')),
      type: 'point',
      paint: { type: 'circle', color: 'green' },
      selectedPaint: { type: 'circle', color: 'red' },
    });
    const adapter = layer as unknown as GeoJsonAdapter;
    adapter.select([['kind', 'eq', 'road']]);
    expect(adapter.getSelected().map(({ feature }) => feature.id)).toEqual([1]);
    expect(
      JSON.stringify(adapter.map?.getFilter(nativeLayer(adapter, 1))),
    ).toContain('"road"');
    adapter.unselect();
    expect(adapter.getSelected()).toHaveLength(0);
  });

  it('retains source data while native filters are updated repeatedly', async () => {
    const map = await createMap();
    const layer = await map.addGeoJsonLayer({
      data: points(point(1, 'road'), point(2, 'rail'), point(3, 'road')),
      type: 'point',
      paint: { type: 'circle', radius: 6 },
    });
    const adapter = layer as unknown as GeoJsonAdapter;
    await adapter.propertiesFilter([['kind', 'eq', 'road']]);
    await adapter.propertiesFilter([['kind', 'eq', 'rail']]);
    adapter.removeFilter();
    expect(adapter.getLayers().map(({ feature }) => feature.id)).toEqual([
      1, 2, 3,
    ]);
  });

  it('delivers native click events with GeoJSON feature data and selection state', async () => {
    const map = await createMap();
    const onClick = vi.fn<(evt: unknown) => void>();
    const layer = await map.addGeoJsonLayer({
      data: points(point(1, 'road')),
      type: 'point',
      paint: { type: 'circle', radius: 6 },
      selectedPaint: { type: 'circle', radius: 9 },
      multiselect: true,
      selectable: true,
      onClick,
      onMouseOver: () => undefined,
    });
    const adapter = layer as unknown as GeoJsonAdapter;
    const native = adapter.map;
    expect(native).toBeDefined();
    if (!native) throw new Error('Native MapLibre map is not initialized');
    const feature = adapter.getLayers()[0].feature;
    vi.spyOn(native, 'queryRenderedFeatures').mockReturnValue([
      feature as unknown as MapGeoJSONFeature,
    ]);
    const preventDefault = vi.fn<() => void>();
    const event = {
      lngLat: { lng: 21, lat: 11 },
      point: { x: 20, y: 15 },
      preventDefault,
    } as unknown as MapLayerMouseEvent;
    const result = adapter._onLayerClick(event);
    expect(result?.id).toBe(1);
    expect(preventDefault).toHaveBeenCalledOnce();
    expect(onClick).toHaveBeenCalledOnce();
    expect(adapter.getSelected().map(({ feature }) => feature.id)).toEqual([1]);
  });

  it('unselects a feature when the same native click is repeated', async () => {
    const map = await createMap();
    const layer = await map.addGeoJsonLayer({
      data: points(point(1, 'road')),
      type: 'point',
      paint: { type: 'circle', radius: 6 },
      selectedPaint: { type: 'circle', radius: 9 },
      multiselect: true,
      selectable: true,
      unselectOnSecondClick: true,
      onMouseOver: () => undefined,
    });
    const adapter = layer as unknown as GeoJsonAdapter;
    const native = adapter.map;
    if (!native) throw new Error('Native MapLibre map is not initialized');
    vi.spyOn(native, 'queryRenderedFeatures').mockReturnValue([
      adapter.getLayers()[0].feature as unknown as MapGeoJSONFeature,
    ]);
    const event = {
      lngLat: { lng: 21, lat: 11 },
      point: { x: 20, y: 15 },
      preventDefault: () => undefined,
    } as unknown as MapLayerMouseEvent;
    adapter._onLayerClick(event);
    expect(adapter.getSelected().map(({ feature }) => feature.id)).toEqual([1]);
    adapter._onLayerClick(event);
    expect(adapter.getSelected()).toHaveLength(0);
  });

  it('removes native GeoJSON layers and their source on WebMap.removeLayer', async () => {
    const map = await createMap();
    const layer = await map.addGeoJsonLayer({
      data: points(point(1, 'road')),
      type: 'point',
      paint: { type: 'circle', color: 'green' },
    });
    const adapter = layer as unknown as GeoJsonAdapter;
    const native = adapter.map;
    if (!native) throw new Error('Native MapLibre map is not initialized');
    const ids = [...(adapter.layer ?? [])];
    const sourceId = adapter.source;
    expect(sourceId).toBeDefined();
    expect(native.getSource(sourceId!)).toBeDefined();
    map.removeLayer(layer);
    for (const id of ids) expect(native.getLayer(id)).toBeUndefined();
    expect(native.getSource(sourceId!)).toBeUndefined();
  });
});
