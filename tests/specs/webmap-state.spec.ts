import { describe, expect, it, vi } from 'vitest';

import { BoundState } from '../../packages/webmap/src/components/mapStates/BoundState';
import { CenterState } from '../../packages/webmap/src/components/mapStates/CenterState';
import { ZoomState } from '../../packages/webmap/src/components/mapStates/ZoomState';
import {
  detectGeometryType,
  findMostFrequentGeomType,
} from '../../packages/webmap/src/utils/geometryTypes';

import type { WebMap } from '../../packages/webmap/src/WebMap';

import type {
  Feature,
  FeatureCollection,
  GeometryCollection,
  MultiPolygon,
} from 'geojson';

function mapStub() {
  return {
    getZoom: vi.fn(() => 10.6 as number | undefined),
    setZoom: vi.fn(),
    getCenter: vi.fn(
      () => [1.1234567, 2.3456789] as [number, number] | undefined,
    ),
    setCenter: vi.fn(),
    getBounds: vi.fn(
      () =>
        [1.1234567, 2.3456789, 3.9876543, 4.5678901] as
          | [number, number, number, number]
          | undefined,
    ),
    setView: vi.fn(),
  };
}

describe('WebMap states', () => {
  it('rounds, formats and parses zoom', () => {
    const map = mapStub();
    const state = new ZoomState(map as unknown as WebMap);
    expect(state.name).toBe('zoom');
    expect(state.event).toEqual(['zoomend']);
    expect(state.getValue()).toBe(11);
    expect(state.toString()).toBe('11');
    expect(state.parse('7.5')).toBe(7.5);
    state.setValue(8);
    expect(map.setZoom).toHaveBeenCalledWith(8);
  });

  it('handles missing zoom without converting it to zero', () => {
    const map = mapStub();
    map.getZoom.mockReturnValue(undefined);
    const state = new ZoomState(map as unknown as WebMap);
    expect(state.getValue()).toBeUndefined();
    expect(state.toString()).toBe('undefined');
  });

  it('applies constructor options to a state', () => {
    const map = mapStub();
    const state = new ZoomState(map as unknown as WebMap, {
      value: 6,
      event: 'moveend',
    });
    expect(map.setZoom).toHaveBeenCalledWith(6);
    expect(state.event).toEqual(['moveend']);
  });

  it('formats and parses map center coordinates', () => {
    const map = mapStub();
    const state = new CenterState(map as unknown as WebMap);
    expect(state.name).toBe('center');
    expect(state.event).toEqual(['moveend']);
    expect(state.getValue()).toEqual([1.1234567, 2.3456789]);
    expect(state.toString()).toBe('1.12346_2.34568');
    expect(state.parse('12.5_-8.25')).toEqual([12.5, -8.25]);
    state.setValue([4, 5]);
    expect(map.setCenter).toHaveBeenCalledWith([4, 5]);
  });

  it('serializes missing center as an empty string', () => {
    const map = mapStub();
    map.getCenter.mockReturnValue(undefined);
    expect(new CenterState(map as unknown as WebMap).toString()).toBe('');
  });

  it('formats, parses and forwards bounds to setView', () => {
    const map = mapStub();
    const state = new BoundState(map as unknown as WebMap);
    expect(state.name).toBe('bounds');
    expect(state.event).toEqual(['moveend']);
    expect(state.toString()).toBe('1.12346_2.34568_3.98765_4.56789');
    expect(state.parse('0_1_2_3')).toEqual([0, 1, 2, 3]);
    state.setValue([0, 1, 2, 3]);
    expect(map.setView).toHaveBeenCalledWith({ bounds: [0, 1, 2, 3] });
  });

  it('serializes missing bounds as undefined', () => {
    const map = mapStub();
    map.getBounds.mockReturnValue(undefined);
    expect(new BoundState(map as unknown as WebMap).toString()).toBeUndefined();
  });
});

describe('GeoJSON geometry type detection', () => {
  it('chooses the most frequent geometry type', () => {
    expect(findMostFrequentGeomType(['Point', 'LineString', 'Point'])).toBe(
      'Point',
    );
  });

  it('detects a standalone geometry', () => {
    const geometry: MultiPolygon = {
      type: 'MultiPolygon',
      coordinates: [],
    };

    expect(detectGeometryType(geometry)).toBe('MultiPolygon');
  });

  it('detects the geometry of a Feature', () => {
    const feature: Feature = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: [10, 20],
      },
    };

    expect(detectGeometryType(feature)).toBe('Point');
  });

  it('detects the majority geometry of a FeatureCollection', () => {
    const collection: FeatureCollection = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: { type: 'Point', coordinates: [0, 0] },
        },
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [
              [0, 0],
              [1, 1],
            ],
          },
        },
        {
          type: 'Feature',
          properties: {},
          geometry: { type: 'Point', coordinates: [1, 1] },
        },
      ],
    };
    expect(detectGeometryType(collection)).toBe('Point');
  });

  it('detects the majority geometry of a GeometryCollection', () => {
    const collection: GeometryCollection = {
      type: 'GeometryCollection',
      geometries: [
        {
          type: 'LineString',
          coordinates: [
            [0, 0],
            [1, 1],
          ],
        },
        { type: 'Point', coordinates: [0, 0] },
        {
          type: 'LineString',
          coordinates: [
            [1, 1],
            [2, 2],
          ],
        },
      ],
    };
    expect(detectGeometryType(collection)).toBe('LineString');
  });
});
