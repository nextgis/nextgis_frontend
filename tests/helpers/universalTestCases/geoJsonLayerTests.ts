import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { Feature, FeatureCollection, Point } from 'geojson';
import type { Type } from '@nextgis/utils';
import type { MapAdapter } from '../../../packages/webmap/src';

import { mapHtml } from '../mapHtml';
import { buildWebMap } from './webMapTests';

import type { WebMap } from '../../../packages/webmap/src/WebMap';

// One contract, executed against the real Leaflet, OpenLayers and MapLibre
// MapAdapters through WebMap. No native adapter constructors or test-specific
// methods are used by the shared assertions.
export function point(
  id: number,
  coordinates: [number, number],
): Feature<Point> {
  return {
    type: 'Feature',
    id,
    properties: { id, category: id % 2 ? 'odd' : 'even', label: `Point ${id}` },
    geometry: { type: 'Point', coordinates },
  };
}

export function collection(
  ...features: Feature<Point>[]
): FeatureCollection<Point> {
  return { type: 'FeatureCollection', features };
}

export function initialPoints(): FeatureCollection<Point> {
  return collection(point(1, [20, 10]), point(2, [30, 15]));
}

export function geoJsonLayerTests(MA: Type<MapAdapter>): void {
  describe(`${MA.name}: WebMap GeoJSON public API`, () => {
    const maps: WebMap[] = [];

    beforeEach(() => {
      document.body.innerHTML = mapHtml;
    });

    afterEach(() => {
      for (const map of maps.splice(0)) {
        map.destroy();
      }
    });

    async function createMap(): Promise<WebMap> {
      const map = await buildWebMap(MA, {
        target: 'map',
        center: [25, 12],
        zoom: 3,
      });
      maps.push(map);
      return map;
    }

    it('registers a GeoJSON layer with its original feature IDs', async () => {
      const map = await createMap();
      const layer = await map.addGeoJsonLayer({
        data: initialPoints(),
        type: 'point',
        paint: { type: 'circle', radius: 6, color: 'red' },
      });

      expect(map.getLayer(layer.id!)).toBe(layer);
      expect(map.getLayers()).toContain(layer.id);
      expect(layer.getLayers().map(({ feature }) => feature.id)).toEqual([
        1, 2,
      ]);
      expect(layer.getLayers()[0].feature.properties?.category).toBe('odd');
    });

    it('appends features through WebMap.addLayerData', async () => {
      const map = await createMap();
      const layer = await map.addGeoJsonLayer({
        data: initialPoints(),
        type: 'point',
        paint: { type: 'circle', radius: 6 },
      });

      map.addLayerData(layer, collection(point(3, [40, 20])));
      await vi.waitFor(() => {
        expect(layer.getLayers().map(({ feature }) => feature.id)).toEqual([
          1, 2, 3,
        ]);
      });
    });

    it('replaces features through WebMap.setLayerData', async () => {
      const map = await createMap();
      const layer = await map.addGeoJsonLayer({
        data: initialPoints(),
        type: 'point',
        paint: { type: 'circle', radius: 6 },
      });

      await map.setLayerData(layer, collection(point(4, [1, 2])));
      expect(layer.getLayers().map(({ feature }) => feature.id)).toEqual([4]);
    });

    it('removes only matching features through WebMap.clearLayerData', async () => {
      const map = await createMap();
      const layer = await map.addGeoJsonLayer({
        data: initialPoints(),
        type: 'point',
        paint: { type: 'circle', radius: 6 },
      });

      map.clearLayerData(layer, (feature) => feature.id === 1);
      await vi.waitFor(() => {
        expect(layer.getLayers().map(({ feature }) => feature.id)).toEqual([2]);
      });
    });

    it('clears all features through WebMap.clearLayerData', async () => {
      const map = await createMap();
      const layer = await map.addGeoJsonLayer({
        data: initialPoints(),
        type: 'point',
        paint: { type: 'circle', radius: 6 },
      });

      map.clearLayerData(layer);
      await vi.waitFor(() => expect(layer.getLayers()).toHaveLength(0));
    });

    it('returns matching features from WebMap.filterLayer', async () => {
      const map = await createMap();
      const layer = await map.addGeoJsonLayer({
        data: initialPoints(),
        type: 'point',
        paint: { type: 'circle', radius: 6 },
      });

      // WebMap.filterLayer explicitly declares LayerDefinition[] as its return
      // value. A native adapter returning void is a library contract violation.
      const result = map.filterLayer(layer, ({ feature }) => feature.id === 2);
      expect(result.map(({ feature }) => feature.id)).toEqual([2]);
      expect(layer.getLayers()).toHaveLength(2);
      map.removeLayerFilter(layer);
    });

    it('can apply and clear a filter without deleting the data', async () => {
      const map = await createMap();
      const layer = await map.addGeoJsonLayer({
        data: initialPoints(),
        type: 'point',
        paint: { type: 'circle', radius: 6 },
      });

      map.filterLayer(layer, ({ feature }) => feature.id === 99);
      map.removeLayerFilter(layer);
      expect(layer.getLayers().map(({ feature }) => feature.id)).toEqual([
        1, 2,
      ]);
    });

    it('selects and unselects a feature through WebMap', async () => {
      const map = await createMap();
      const layer = await map.addGeoJsonLayer({
        data: initialPoints(),
        type: 'point',
        paint: { type: 'circle', radius: 6 },
        selectedPaint: { type: 'circle', radius: 8, color: 'blue' },
        multiselect: true,
      });

      map.selectLayer(layer, ({ feature }) => feature.id === 2);
      expect(layer.getSelected().map(({ feature }) => feature.id)).toEqual([2]);
      map.unSelectLayer(layer);
      expect(layer.getSelected()).toHaveLength(0);
    });

    it('selects multiple features through the same public API', async () => {
      const map = await createMap();
      const layer = await map.addGeoJsonLayer({
        data: initialPoints(),
        type: 'point',
        paint: { type: 'circle', radius: 6 },
        selectedPaint: { type: 'circle', radius: 8, color: 'blue' },
        multiselect: true,
      });

      map.selectLayer(layer, () => true);
      expect(layer.getSelected().map(({ feature }) => feature.id)).toEqual([
        1, 2,
      ]);
    });

    it('reports geographical bounds in the same coordinate order', async () => {
      const map = await createMap();
      const layer = await map.addGeoJsonLayer({
        data: initialPoints(),
        type: 'point',
        paint: { type: 'circle', radius: 6 },
      });

      const bounds = await layer.getBounds?.();

      expect(bounds).toBeDefined();

      for (const [index, expected] of [20, 10, 30, 15].entries()) {
        expect(bounds?.[index]).toBeCloseTo(expected, 4);
      }
    });

    it('applies regular and selected paint through WebMap methods', async () => {
      const map = await createMap();
      const layer = await map.addGeoJsonLayer({
        data: initialPoints(),
        type: 'point',
        paint: { type: 'circle', color: 'red', radius: 6 },
        selectedPaint: { type: 'circle', color: 'blue', radius: 8 },
      });

      map.setLayerPaint(layer, { type: 'circle', color: 'green', radius: 9 });
      map.updateLayerPaint(layer, { radius: 12 });
      map.setLayerSelectedPaint(layer, {
        type: 'circle',
        color: 'yellow',
        radius: 7,
      });
      map.updateLayerSelectedPaint(layer, { radius: 10 });
      expect(layer.getLayers()).toHaveLength(2);
    });

    it('supports empty GeoJSON collections', async () => {
      const map = await createMap();
      const layer = await map.addGeoJsonLayer({
        data: collection(),
        type: 'point',
        paint: { type: 'circle', radius: 6 },
      });

      expect(layer.getLayers()).toHaveLength(0);
    });

    it('keeps two independently created GeoJSON layers separate', async () => {
      const map = await createMap();
      const first = await map.addGeoJsonLayer({
        data: collection(point(1, [20, 10])),
        type: 'point',
        paint: { type: 'circle', radius: 6 },
      });
      const second = await map.addGeoJsonLayer({
        data: collection(point(2, [30, 15])),
        type: 'point',
        paint: { type: 'circle', radius: 6 },
      });

      map.addLayerData(first, collection(point(3, [40, 20])));
      await vi.waitFor(() => expect(first.getLayers()).toHaveLength(2));
      expect(second.getLayers().map(({ feature }) => feature.id)).toEqual([2]);
    });

    it('shows, hides, and removes a registered GeoJSON layer', async () => {
      const map = await createMap();
      const layer = await map.addGeoJsonLayer({
        data: initialPoints(),
        type: 'point',
        paint: { type: 'circle', radius: 6 },
      });
      const id = layer.id!;

      await map.hideLayer(layer);
      expect(map.isLayerVisible(layer)).toBe(false);
      await map.showLayer(layer);
      expect(map.isLayerVisible(layer)).toBe(true);
      map.removeLayer(layer);
      expect(map.getLayer(id)).toBeUndefined();
    });
  });
}
