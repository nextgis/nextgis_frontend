import { describe, expect, it } from 'vitest';

import {
  getMapWidthForLanInMeters,
  getZoomFromScale,
  pixelsInMeterWidth,
  setScaleRatio,
  updateImageParams,
  vectorLayerGeomToPaintTypeAlias,
} from '../../packages/ngw-kit/src/utils/utils';
import { resourceCompare } from '../../packages/ngw-connector/src/utils/resourceCompare';

import type { ResourceRead } from '@nextgisweb/resource/type/api';

describe('NGW layer option and map scale calculations', () => {
  it('converts WMS viewport coordinates into NGW image parameters', () => {
    const now = Date.now();
    const result = updateImageParams({ bbox: [1, 2, 3, 4], width: 256, height: 512, mode: 'fast' }, 12);
    expect(result).toMatchObject({
      extent: [1, 2, 3, 4], size: '256,512', resource: 12, nd: 200, mode: 'fast',
    });
    expect(result.timestamp).toBeGreaterThanOrEqual(now);
  });

  it('joins multiple image resources and preserves explicit no-data status', () => {
    const result = updateImageParams({ width: 64, height: 32, nd: 404 }, [2, 4]);
    expect(result.resource).toBe('2,4');
    expect(result.nd).toBe(404);
    expect(result.size).toBe('64,32');
  });

  it('recognizes single and multi-geometries in the NGW type mapping', () => {
    expect(vectorLayerGeomToPaintTypeAlias.POINT).toBe('point');
    expect(vectorLayerGeomToPaintTypeAlias.MULTIPOINTZ).toBe('point');
    expect(vectorLayerGeomToPaintTypeAlias.LINESTRINGZ).toBe('line');
    expect(vectorLayerGeomToPaintTypeAlias.MULTIPOLYGON).toBe('polygon');
  });

  it('computes the world circumference adjusted for latitude', () => {
    const equator = getMapWidthForLanInMeters(0);
    expect(equator).toBeCloseTo(2 * Math.PI * 6378137, 0);
    expect(getMapWidthForLanInMeters(60)).toBeCloseTo(equator / 2, 4);
  });

  it('converts scale factors to zoom levels', () => {
    expect(getZoomFromScale(256)).toBe(0);
    expect(getZoomFromScale(512)).toBe(1);
    expect(getZoomFromScale(128)).toBe(-1);
  });

  it('measures CSS pixels per meter and produces a finite map scale', () => {
    expect(pixelsInMeterWidth()).toBeGreaterThan(0);
    expect(Number.isFinite(setScaleRatio(500000, 0))).toBe(true);
    expect(setScaleRatio(500000, 0)).toBeGreaterThan(setScaleRatio(500000, 60));
  });

  it('compares the actual resource properties instead of their identities', () => {
    const a = { id: 5, display_name: 'Roads' } as ResourceRead;
    const b = { id: 5, display_name: 'Roads' } as ResourceRead;
    expect(resourceCompare(a, b)).toBe(true);
    expect(resourceCompare(a, { id: 6 } as ResourceRead)).toBe(false);
  });
});
