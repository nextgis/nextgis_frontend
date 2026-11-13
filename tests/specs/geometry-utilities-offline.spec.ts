import { describe, expect, it } from 'vitest';

import { coordinatesCount, getCoordinates, getPolygons, eachCoordinates } from '../../packages/utils/src/geom/eachCoordinates';
import { detectType as detectLeafletType } from '../../packages/leaflet-map-adapter/src/utils/detectType';
import { filterGeometries } from '../../packages/leaflet-map-adapter/src/utils/geometries';
import {
  detectType as detectMaplibreType,
  findMostFrequentGeomType,
  geometryFilter,
} from '../../packages/maplibre-gl-map-adapter/src/utils/geomType';
import { getCentroid as getOlCentroid } from '../../packages/ol-map-adapter/src/utils/getCentroid';
import { getCentroid as getMaplibreCentroid } from '../../packages/maplibre-gl-map-adapter/src/utils/getCentroid';

import type { Feature, FeatureCollection, GeometryCollection, LineString, MultiPolygon, Point, Polygon } from 'geojson';

const point = (coordinates: [number, number]): Feature<Point> => ({
  type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates },
});
const polygon: Feature<Polygon> = {
  type: 'Feature', properties: {},
  geometry: { type: 'Polygon', coordinates: [[[0, 0], [4, 0], [4, 4], [0, 4], [0, 0]]] },
};

describe('GeoJSON coordinate traversal', () => {
  it('visits every coordinate of a FeatureCollection', () => {
    const data: FeatureCollection = {
      type: 'FeatureCollection', features: [point([1, 2]), {
        type: 'Feature', properties: {}, geometry: {
          type: 'LineString', coordinates: [[3, 4], [5, 6]],
        },
      }],
    };
    const found: number[][] = [];
    eachCoordinates(data, (position) => found.push(position));
    expect(found).toEqual([[1, 2], [3, 4], [5, 6]]);
    expect(coordinatesCount(data)).toBe(3);
    expect(getCoordinates(data)).toEqual(found);
  });

  it('handles polygon exterior rings and holes', () => {
    const data: Polygon = {
      type: 'Polygon', coordinates: [
        [[0, 0], [8, 0], [8, 8], [0, 0]],
        [[1, 1], [2, 1], [1, 1]],
      ],
    };
    expect(coordinatesCount(data)).toBe(7);
    expect(getPolygons(data)).toEqual(data.coordinates);
  });

  it('flattens MultiPolygon rings without dropping coordinates', () => {
    const data: MultiPolygon = {
      type: 'MultiPolygon', coordinates: [
        [[[0, 0], [1, 0], [0, 0]]],
        [[[10, 10], [11, 10], [10, 10]]],
      ],
    };
    expect(getPolygons(data)).toHaveLength(2);
    expect(coordinatesCount(data)).toBe(6);
  });

  it('supports direct MultiPoint and MultiLineString geometries', () => {
    expect(getCoordinates({ type: 'MultiPoint', coordinates: [[1, 1], [2, 2]] }))
      .toEqual([[1, 1], [2, 2]]);
    expect(coordinatesCount({ type: 'MultiLineString', coordinates: [
      [[0, 0], [1, 1]], [[2, 2]],
    ] })).toBe(3);
  });
});

describe('Geometry detection and type filters', () => {
  const mixed: FeatureCollection = {
    type: 'FeatureCollection', features: [point([1, 2]), point([3, 4]), polygon],
  };

  it('detects the most common geometry in a mixed collection', () => {
    expect(detectLeafletType(mixed)).toBe('Point');
    expect(detectMaplibreType(mixed)).toBe('Point');
    expect(findMostFrequentGeomType(['Polygon', 'Point', 'Polygon'])).toBe('Polygon');
  });

  it('detects geometries in both Features and raw objects', () => {
    expect(detectLeafletType(point([1, 2]))).toBe('Point');
    const line: LineString = {
      type: 'LineString', coordinates: [[0, 0], [1, 1]],
    };
    expect(detectMaplibreType(line)).toBe('LineString');
    const collection: GeometryCollection = {
      type: 'GeometryCollection', geometries: [
        { type: 'Point', coordinates: [1, 2] },
        { type: 'Point', coordinates: [3, 4] },
        { type: 'Polygon', coordinates: [[[0, 0], [1, 0], [0, 0]]] },
      ],
    };
    expect(detectLeafletType(collection)).toBe('Point');
    expect(detectMaplibreType(collection)).toBe('Point');
  });

  it('preserves only matching features for a point layer', () => {
    const input: FeatureCollection = { ...mixed, features: [...mixed.features] };
    const filtered = filterGeometries(input, 'point') as FeatureCollection;
    expect(filtered.features).toHaveLength(2);
    expect(filtered.features.every((feature) => feature.geometry.type === 'Point'))
      .toBe(true);
  });

  it('rejects raw incompatible geometries and accepts compatible ones', () => {
    expect(filterGeometries(polygon.geometry, 'point')).toBe(false);
    expect(filterGeometries(point([1, 2]).geometry, 'point')).toEqual(point([1, 2]).geometry);
    expect(geometryFilter('MultiPoint', 'point')).toBe(true);
    expect(geometryFilter('Polygon', 'line')).toBe(false);
  });
});

describe.each([
  ['OpenLayers', getOlCentroid],
  ['MapLibre', getMaplibreCentroid],
])('%s centroid calculation', (_engine, getCentroid) => {
  it('returns point coordinates unchanged', () => {
    expect(getCentroid(point([5, 7]))).toEqual([5, 7]);
  });

  it('locates a representative point inside a polygon', () => {
    const result = getCentroid(polygon);
    expect(result[0]).toBeGreaterThan(0);
    expect(result[0]).toBeLessThan(4);
    expect(result[1]).toBeGreaterThan(0);
    expect(result[1]).toBeLessThan(4);
  });

  it('calculates the mean of a line feature coordinates', () => {
    const line: Feature = {
      type: 'Feature', properties: {}, geometry: {
        type: 'LineString', coordinates: [[0, 0], [2, 2], [4, 4]],
      },
    };
    expect(getCentroid(line)).toEqual([2, 2]);
  });
});
