import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { LeafletMapAdapter } from '../../packages/leaflet-map-adapter/src/LeafletMapAdapter';
import { MaplibreGLMapAdapter } from '../../packages/maplibre-gl-map-adapter/src/MaplibreGLMapAdapter';
import { OlMapAdapter } from '../../packages/ol-map-adapter/src/OlMapAdapter';
import { mapHtml } from '../helpers/mapHtml';
import { buildWebMap } from '../helpers/universalTestCases/webMapTests';

import type { Feature, FeatureCollection, LineString, Polygon } from 'geojson';

import type { WebMap } from '../../packages/webmap/src/WebMap';

function polygon(id: number, dx = 0): Feature<Polygon> {
  return {
    type: 'Feature',
    id,
    properties: { kind: id % 2 ? 'odd' : 'even', name: `Area ${id}` },
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [20 + dx, 10],
          [24 + dx, 10],
          [24 + dx, 14],
          [20 + dx, 14],
          [20 + dx, 10],
        ],
      ],
    },
  };
}

function polygons(...features: Feature<Polygon>[]): FeatureCollection<Polygon> {
  return { type: 'FeatureCollection', features };
}

function line(id: number, dx = 0): Feature<LineString> {
  return {
    type: 'Feature',
    id,
    properties: { kind: id % 2 ? 'odd' : 'even', name: `Road ${id}` },
    geometry: {
      type: 'LineString',
      coordinates: [
        [20 + dx, 10],
        [22 + dx, 12],
        [24 + dx, 14],
      ],
    },
  };
}

function lines(
  ...features: Feature<LineString>[]
): FeatureCollection<LineString> {
  return { type: 'FeatureCollection', features };
}

// These checks intentionally use the same public WebMap API for all engines.
// Native rendering, selection and filtering are supplied by the actual adapters.
for (const Adapter of [LeafletMapAdapter, OlMapAdapter, MaplibreGLMapAdapter]) {
  describe(`${Adapter.name}: polygon and line WebMap contract (offline)`, () => {
    const maps: WebMap[] = [];

    beforeEach(() => {
      document.body.innerHTML = mapHtml;
    });

    afterEach(() => {
      for (const map of maps.splice(0)) map.destroy();
    });

    async function newMap(): Promise<WebMap> {
      const map = await buildWebMap(Adapter, {
        target: 'map',
        center: [23, 12],
        zoom: 5,
      });
      maps.push(map);
      return map;
    }

    it('preserves feature identifiers and properties for polygon geometry', async () => {
      const map = await newMap();
      const layer = await map.addGeoJsonLayer({
        data: polygons(polygon(1), polygon(2, 6)),
        type: 'polygon',
        paint: { type: 'path', color: '#204060', fill: true, stroke: true },
      });
      expect(layer.getLayers().map(({ feature }) => feature.id)).toEqual([
        1, 2,
      ]);
      expect(layer.getLayers()[0].feature.geometry.type).toBe('Polygon');
      expect(layer.getLayers()[1].feature.properties?.name).toBe('Area 2');
    });

    it('derives bounds from real polygon geometry', async () => {
      const map = await newMap();
      const layer = await map.addGeoJsonLayer({
        data: polygons(polygon(1)),
        type: 'polygon',
        paint: { type: 'path', fillColor: 'steelblue', stroke: true },
      });
      const bounds = await layer.getBounds?.();
      expect(bounds).toBeDefined();
      for (const [index, value] of [20, 10, 24, 14].entries()) {
        expect(bounds?.[index]).toBeCloseTo(value, 3);
      }
    });

    it('appends polygon features without changing existing ones', async () => {
      const map = await newMap();
      const layer = await map.addGeoJsonLayer({
        data: polygons(polygon(1)),
        type: 'polygon',
        paint: { type: 'path', color: '#204060' },
      });
      map.addLayerData(layer, polygons(polygon(3, 8)));
      await vi.waitFor(() => {
        expect(layer.getLayers().map(({ feature }) => feature.id)).toEqual([
          1, 3,
        ]);
      });
    });

    it('replaces polygons rather than appending on setLayerData', async () => {
      const map = await newMap();
      const layer = await map.addGeoJsonLayer({
        data: polygons(polygon(1), polygon(2, 8)),
        type: 'polygon',
        paint: { type: 'path', fill: true },
      });
      await map.setLayerData(layer, polygons(polygon(7, 3)));
      expect(layer.getLayers().map(({ feature }) => feature.id)).toEqual([7]);
    });

    it('clears matching polygons while retaining other features', async () => {
      const map = await newMap();
      const layer = await map.addGeoJsonLayer({
        data: polygons(polygon(1), polygon(2, 8), polygon(3, 16)),
        type: 'polygon',
        paint: { type: 'path', color: '#444444' },
      });
      map.clearLayerData(layer, (feature) => feature.id === 2);
      expect(layer.getLayers().map(({ feature }) => feature.id)).toEqual([
        1, 3,
      ]);
    });

    it('filters polygon properties through WebMap without deleting data', async () => {
      const map = await newMap();
      const layer = await map.addGeoJsonLayer({
        data: polygons(polygon(1), polygon(2, 8)),
        type: 'polygon',
        paint: { type: 'path', color: '#444444' },
      });
      const matches = map.filterLayer(
        layer,
        ({ feature }) => feature.properties?.kind === 'even',
      );
      expect(matches.map(({ feature }) => feature.id)).toEqual([2]);
      map.removeLayerFilter(layer);
      expect(layer.getLayers().map(({ feature }) => feature.id)).toEqual([
        1, 2,
      ]);
    });

    it('selects and unselects a polygon without removing its geometry', async () => {
      const map = await newMap();
      const layer = await map.addGeoJsonLayer({
        data: polygons(polygon(1), polygon(2, 8)),
        type: 'polygon',
        paint: { type: 'path', color: 'red' },
        selectedPaint: { type: 'path', color: 'blue' },
        multiselect: true,
      });
      map.selectLayer(layer, ({ feature }) => feature.id === 2);
      expect(layer.getSelected().map(({ feature }) => feature.id)).toEqual([2]);
      map.unSelectLayer(layer);
      expect(layer.getSelected()).toHaveLength(0);
      expect(layer.getLayers()).toHaveLength(2);
    });

    it('keeps polygon data through public paint updates', async () => {
      const map = await newMap();
      const layer = await map.addGeoJsonLayer({
        data: polygons(polygon(1)),
        type: 'polygon',
        paint: { type: 'path', color: 'red', weight: 2 },
        selectedPaint: { type: 'path', color: 'blue' },
      });
      map.setLayerPaint(layer, { type: 'path', color: 'green', weight: 3 });
      map.updateLayerPaint(layer, { weight: 4, fillOpacity: 0.5 });
      map.setLayerSelectedPaint(layer, { type: 'path', color: 'yellow' });
      map.updateLayerSelectedPaint(layer, { weight: 5 });
      expect(layer.getLayers().map(({ feature }) => feature.id)).toEqual([1]);
    });

    it('preserves line coordinates and feature properties', async () => {
      const map = await newMap();
      const layer = await map.addGeoJsonLayer({
        data: lines(line(5), line(6, 8)),
        type: 'line',
        paint: { type: 'path', color: '#224466', weight: 3 },
      });
      expect(layer.getLayers().map(({ feature }) => feature.id)).toEqual([
        5, 6,
      ]);
      expect(layer.getLayers()[0].feature.geometry.type).toBe('LineString');
      expect(layer.getLayers()[1].feature.properties?.kind).toBe('even');
    });

    it('retains the exact geographic bounds of a line', async () => {
      const map = await newMap();
      const layer = await map.addGeoJsonLayer({
        data: lines(line(5)),
        type: 'line',
        paint: { type: 'path', color: 'red', weight: 2 },
      });
      const bounds = await layer.getBounds?.();
      expect(bounds).toBeDefined();
      for (const [index, value] of [20, 10, 24, 14].entries()) {
        expect(bounds?.[index]).toBeCloseTo(value, 3);
      }
    });

    it('supports replacing and selectively removing line geometry', async () => {
      const map = await newMap();
      const layer = await map.addGeoJsonLayer({
        data: lines(line(1), line(2, 8)),
        type: 'line',
        paint: { type: 'path', color: '#335577' },
      });
      await map.setLayerData(layer, lines(line(3), line(4, 8)));
      expect(layer.getLayers().map(({ feature }) => feature.id)).toEqual([
        3, 4,
      ]);
      map.clearLayerData(layer, (feature) => feature.id === 3);
      expect(layer.getLayers().map(({ feature }) => feature.id)).toEqual([4]);
    });

    it('filters and reselects a line without affecting source data', async () => {
      const map = await newMap();
      const layer = await map.addGeoJsonLayer({
        data: lines(line(1), line(2, 8)),
        type: 'line',
        paint: { type: 'path', color: '#335577' },
        selectedPaint: { type: 'path', color: 'orange' },
        multiselect: true,
      });
      expect(
        map
          .filterLayer(layer, ({ feature }) => feature.id === 1)
          .map(({ feature }) => feature.id),
      ).toEqual([1]);
      map.removeLayerFilter(layer);
      map.selectLayer(layer, ({ feature }) => feature.id === 2);
      expect(layer.getSelected().map(({ feature }) => feature.id)).toEqual([2]);
      map.unSelectLayer(layer);
      expect(layer.getLayers().map(({ feature }) => feature.id)).toEqual([
        1, 2,
      ]);
    });

    it('keeps separate polygon and line layers independent', async () => {
      const map = await newMap();
      const polygonLayer = await map.addGeoJsonLayer({
        data: polygons(polygon(1)),
        type: 'polygon',
        paint: { type: 'path', fillColor: 'navy' },
      });
      const lineLayer = await map.addGeoJsonLayer({
        data: lines(line(2)),
        type: 'line',
        paint: { type: 'path', color: 'red', weight: 2 },
      });
      map.clearLayerData(polygonLayer);
      expect(polygonLayer.getLayers()).toHaveLength(0);
      expect(lineLayer.getLayers().map(({ feature }) => feature.id)).toEqual([
        2,
      ]);
    });

    it('preserves features when a polygon layer is hidden and shown again', async () => {
      const map = await newMap();
      const layer = await map.addGeoJsonLayer({
        data: polygons(polygon(1)),
        type: 'polygon',
        paint: { type: 'path', color: 'purple' },
      });
      await map.hideLayer(layer);
      expect(map.isLayerVisible(layer)).toBe(false);
      await map.showLayer(layer);
      expect(map.isLayerVisible(layer)).toBe(true);
      expect(layer.getLayers().map(({ feature }) => feature.id)).toEqual([1]);
    });
  });
}
