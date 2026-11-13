import { describe, expect, it } from 'vitest';
import GeoJSON from 'ol/format/GeoJSON';

import {
  createFeaturePositionOptions,
  getFeaturesBounds,
  getFeaturesCenter,
} from '../../packages/ol-map-adapter/src/utils/createFeaturePositionOptions';
import { getFeature, objectToQuery, queryToObject } from '../../packages/ol-map-adapter/src/utils/utils';

import type { Feature } from 'geojson';

function point(x: number, y: number): Feature {
  return {
    type: 'Feature', properties: { name: `${x},${y}` },
    geometry: { type: 'Point', coordinates: [x, y] },
  };
}

const projections = {
  dataProjection: 'EPSG:4326',
  featureProjection: 'EPSG:3857',
};

describe('OpenLayers public geometry helpers', () => {
  it('calculates geographic bounds for two points in projected space', () => {
    const bounds = getFeaturesBounds({ ...projections, feature: [point(10, 20), point(30, 40)] });
    expect(bounds[0]).toBeCloseTo(10, 4);
    expect(bounds[1]).toBeCloseTo(20, 4);
    expect(bounds[2]).toBeCloseTo(30, 4);
    expect(bounds[3]).toBeCloseTo(40, 4);
  });

  it('calculates the geographical center of multiple features', () => {
    const center = getFeaturesCenter({ ...projections, feature: [point(10, 20), point(30, 40)] });
    expect(center[0]).toBeCloseTo(20, 4);
    expect(center[1]).toBeCloseTo(30, 4);
  });

  it('exposes lazy bounds and center methods for a feature', () => {
    const position = createFeaturePositionOptions({ ...projections, feature: point(12, 34) });
    expect(position.getBounds?.()).toEqual(expect.any(Array));
    expect(position.getCenter?.()).toEqual(expect.any(Array));
  });

  it('converts native OpenLayers features back to geographical GeoJSON', () => {
    const original = point(7, 8);
    const [native] = new GeoJSON().readFeatures({
      type: 'FeatureCollection', features: [original],
    }, projections);
    const feature = getFeature(native);
    expect(feature.geometry?.type).toBe('Point');
    if (feature.geometry?.type === 'Point') {
      expect(feature.geometry.coordinates[0]).toBeCloseTo(7, 4);
      expect(feature.geometry.coordinates[1]).toBeCloseTo(8, 4);
    }
    expect(feature.properties?.name).toBe('7,8');
  });

  it('decodes duplicate query keys without losing their values', () => {
    expect(queryToObject('name=first&name=second&empty&text=with%20spaces'))
      .toEqual({ name: ['first', 'second'], empty: '', text: 'with spaces' });
  });

  it('serializes nested query objects with URI-encoded keys', () => {
    const encoded = objectToQuery({ name: 'Roads & rails', filter: { id: 7 } });
    expect(encoded).toContain('name=Roads%20%26%20rails');
    expect(encoded).toContain('filter%5Bid%5D=7');
  });
});
