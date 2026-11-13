import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { MaplibreGLMapAdapter } from '../../packages/maplibre-gl-map-adapter/src/MaplibreGLMapAdapter';
import { mapHtml } from '../helpers/mapHtml';
import {
  collection,
  initialPoints,
  point,
} from '../helpers/universalTestCases/geoJsonLayerTests';
import { buildWebMap } from '../helpers/universalTestCases/webMapTests';

import type { Point } from 'geojson';
import type { WebMap } from '../../packages/webmap/src/WebMap';
import type { GeoJsonAdapter } from '../../packages/maplibre-gl-map-adapter/src/layer-adapters/GeoJsonAdapter';

describe('MapLibre-specific GeoJSON behavior', () => {
  let map: WebMap;

  beforeEach(async () => {
    document.body.innerHTML = mapHtml;
    map = await buildWebMap(MaplibreGLMapAdapter, {
      target: 'map',
      center: [25, 12],
      zoom: 3,
    });
  });

  afterEach(() => map?.destroy());

  it('registers a native GeoJSON source', async () => {
    const layer = (await map.addGeoJsonLayer({
      data: initialPoints(),
      type: 'point',
      paint: { type: 'circle', radius: 6 },
    })) as GeoJsonAdapter;

    expect(layer.source).toBeDefined();
    expect(map.mapAdapter.map.getSource(layer.source!)).toBeDefined();
  });

  it('creates native draw and selection layers', async () => {
    const layer = (await map.addGeoJsonLayer({
      data: initialPoints(),
      type: 'point',
      paint: { type: 'circle', radius: 6 },
      selectedPaint: { type: 'circle', radius: 8 },
    })) as GeoJsonAdapter;

    expect(layer.layer?.length).toBeGreaterThan(1);
    for (const id of layer.layer || []) {
      expect(map.mapAdapter.map.getLayer(id)).toBeDefined();
    }
  });

  it('updates its native source through WebMap.addLayerData', async () => {
    const layer = (await map.addGeoJsonLayer({
      data: initialPoints(),
      type: 'point',
      paint: { type: 'circle', radius: 6 },
    })) as GeoJsonAdapter;
    const source = map.mapAdapter.map.getSource(layer.source!) as {
      setData: (data: unknown) => Promise<void>;
    };
    const setData = vi.spyOn(source, 'setData');

    map.addLayerData(layer, collection(point(3, [40, 20])));
    await vi.waitFor(() => expect(setData).toHaveBeenCalled());
    await vi.waitFor(() => expect(layer.getLayers()).toHaveLength(3));
  });

  it('assigns distinct native filter IDs to separate features', async () => {
    const layer = (await map.addGeoJsonLayer({
      data: initialPoints(),
      type: 'point',
      paint: { type: 'circle', radius: 6 },
    })) as GeoJsonAdapter;

    const ids = layer.getLayers().map(({ feature }) => feature.properties?.fid);
    expect(ids).toHaveLength(2);
    expect(new Set(ids).size).toBe(2);
    expect(ids.every((id) => typeof id === 'string')).toBe(true);
  });

  it('updates native paint opacity through WebMap', async () => {
    const layer = (await map.addGeoJsonLayer({
      data: initialPoints(),
      type: 'point',
      paint: { type: 'circle', radius: 6, opacity: 1 },
    })) as GeoJsonAdapter;
    const setPaint = vi.spyOn(map.mapAdapter.map, 'setPaintProperty');

    map.setLayerOpacity(layer, 0.5);
    await vi.waitFor(() => expect(setPaint).toHaveBeenCalled());
    expect(layer.options.opacity).toBe(0.5);
  });

  it('removes native layers and source through WebMap.removeLayer', async () => {
    const layer = (await map.addGeoJsonLayer({
      data: initialPoints(),
      type: 'point',
      paint: { type: 'circle', radius: 6 },
      selectedPaint: { type: 'circle', radius: 8 },
    })) as GeoJsonAdapter;
    const sourceId = layer.source!;
    const ids = [...(layer.layer || [])];

    map.removeLayer(layer);
    expect(map.mapAdapter.map.getSource(sourceId)).toBeUndefined();
    for (const id of ids) {
      expect(map.mapAdapter.map.getLayer(id)).toBeUndefined();
    }
  });

  it('accepts a bare Point geometry through WebMap', async () => {
    const geometry: Point = { type: 'Point', coordinates: [5, 7] };
    const layer = (await map.addGeoJsonLayer({
      data: geometry,
      type: 'point',
      paint: { type: 'circle', radius: 6 },
    })) as GeoJsonAdapter;

    expect(layer.getLayers()).toHaveLength(1);
    expect(layer.getLayers()[0].feature.geometry.type).toBe('Point');
  });

  it('keeps the source empty for an empty collection', async () => {
    const layer = (await map.addGeoJsonLayer({
      data: collection(),
      type: 'point',
      paint: { type: 'circle', radius: 6 },
    })) as GeoJsonAdapter;

    expect(map.mapAdapter.map.getSource(layer.source!)).toBeDefined();
    expect(layer.getLayers()).toHaveLength(0);
  });
});
