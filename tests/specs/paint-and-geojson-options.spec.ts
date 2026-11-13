import { describe, expect, it, vi } from 'vitest';

import { preparePaint } from '../../packages/paint/src/preparePaint';
import {
  isBasePaint,
  isIcon,
  isPaint,
  isPaintCallback,
  isPropertiesPaint,
} from '../../packages/paint/src/typeHelpers';
import { updateGeoJsonAdapterOptions } from '../../packages/webmap/src/utils/updateGeoJsonAdapterOptions';

import type { Paint, GetPaintCallback } from '../../packages/paint/src/interfaces';
import type { GeoJsonAdapterOptions } from '../../packages/webmap/src/interfaces/LayerAdapter';
import type { Feature } from 'geojson';

const point: Feature = {
  type: 'Feature',
  properties: { status: 'active', color: 'orange' },
  geometry: { type: 'Point', coordinates: [30, 60] },
};

const polygon: Feature = {
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'Polygon',
    coordinates: [[[0, 0], [1, 0], [1, 1], [0, 0]]],
  },
};

describe('Paint normalization and customization', () => {
  it('rejects an empty paint definition', () => {
    expect(() => preparePaint({ paint: undefined as unknown as Paint }))
      .toThrow('paint is empty');
  });

  it('applies default paint and expands shared color and opacity', () => {
    expect(preparePaint({
      paint: { color: 'red', opacity: 0.4 },
      defaultPaint: { weight: 3 },
    })).toMatchObject({
      color: 'red', opacity: 0.4, weight: 3,
      fillColor: 'red', strokeColor: 'red',
      fillOpacity: 0.4, strokeOpacity: 0.4,
      fill: true, stroke: false,
    });
  });

  it('respects explicit fill and stroke settings', () => {
    expect(preparePaint({
      paint: { color: 'red', fill: false, stroke: false, opacity: 0 },
    })).toMatchObject({
      fill: false, stroke: false, opacity: 0,
      fillOpacity: 0, strokeOpacity: 0,
    });
    expect(preparePaint({ paint: { fill: false } })).toMatchObject({
      fill: false, stroke: true,
    });
  });

  it('preserves an explicit stroke color instead of overwriting it', () => {
    expect(preparePaint({
      paint: { color: 'red', strokeColor: 'navy', fillColor: 'white' },
    })).toMatchObject({ strokeColor: 'navy', fillColor: 'white' });
  });

  it('passes icon paint through without replacing its icon options', () => {
    const icon = { type: 'icon' as const, html: '<span>marker</span>' };

    expect(preparePaint({ paint: icon })).toBe(icon);
  });

  it('supports a named custom paint factory', () => {
    const factory = vi.fn(() => ({ color: 'purple' }));
    const result = preparePaint({
      paint: { type: 'get-paint', from: 'custom', options: { size: 2 } },
      getPaintFunctions: { custom: factory },
    });

    expect(factory).toHaveBeenCalledWith({ size: 2 });
    expect(result).toMatchObject({ color: 'purple', fillColor: 'purple' });
  });

  it('supports an inline paint factory', () => {
    const factory = vi.fn(() => ({ color: 'teal', stroke: true }));
    const result = preparePaint({
      paint: { type: 'get-paint', from: factory },
    });

    expect(factory).toHaveBeenCalledOnce();
    expect(result).toMatchObject({ color: 'teal', stroke: true });
  });

  it('normalizes a feature-dependent paint callback', () => {
    const callback: GetPaintCallback = (feature) => ({
      color: String(feature.properties?.color),
    });
    const result = preparePaint({
      paint: callback,
      defaultPaint: { weight: 2 },
    });

    expect(typeof result).toBe('function');
    expect((result as GetPaintCallback)(point)).toMatchObject({
      color: 'orange', weight: 2, fillColor: 'orange',
    });
  });

  it('selects conditional properties paint and falls back to the base style', () => {
    const paint: Paint = [
      { color: 'gray' },
      [[['status', 'eq', 'active']], { color: 'green' }],
    ];
    const result = preparePaint({ paint });
    expect(typeof result).toBe('function');

    const callback = result as GetPaintCallback;
    expect(callback(point)).toMatchObject({ color: 'green' });
    expect(callback({ ...point, properties: { status: 'inactive' } }))
      .toMatchObject({ color: 'gray' });
  });

  it('distinguishes plain paints, icons, callbacks and conditional paints', () => {
    const plain: Paint = { color: 'red' };
    const icon = { type: 'icon' as const, html: 'pin' };
    const callback: GetPaintCallback = () => ({ color: 'red' });
    const conditional: Paint = [{ color: 'red' }];

    expect(isPaint(plain)).toBe(true);
    expect(isBasePaint(plain)).toBe(true);
    expect(isIcon(icon)).toBe(true);
    expect(isBasePaint(icon)).toBe(false);
    expect(isPaintCallback(callback)).toBe(true);
    expect(isPropertiesPaint(conditional)).toBe(true);
  });
});

describe('GeoJSON style inference', () => {
  it('infers point layers and circle styles', () => {
    const options: GeoJsonAdapterOptions = {
      data: point,
      paint: { color: 'red' },
    };

    expect(updateGeoJsonAdapterOptions(options)).toBe(options);
    expect(options.type).toBe('point');
    expect(options.paint).toMatchObject({ type: 'circle' });
  });

  it('infers polygon layers and path styles', () => {
    const options: GeoJsonAdapterOptions = {
      data: polygon,
      paint: { color: 'red' },
    };

    updateGeoJsonAdapterOptions(options);
    expect(options.type).toBe('polygon');
    expect(options.paint).toMatchObject({ type: 'path' });
  });

  it('honors an explicit layer and paint type', () => {
    const options: GeoJsonAdapterOptions = {
      data: point,
      type: 'line',
      paint: { type: 'path', color: 'red' },
    };

    updateGeoJsonAdapterOptions(options);
    expect(options.type).toBe('line');
    expect(options.paint).toMatchObject({ type: 'path' });
  });

  it('chooses an HTML icon paint for point geometries', () => {
    const options: GeoJsonAdapterOptions = {
      data: point,
      paint: { html: '<span>pin</span>' } as unknown as GeoJsonAdapterOptions['paint'],
    };

    updateGeoJsonAdapterOptions(options);
    expect(options.paint).toMatchObject({ type: 'icon' });
  });

  it('does not infer a style if GeoJSON data is absent', () => {
    const options: GeoJsonAdapterOptions = { paint: { color: 'red' } };

    updateGeoJsonAdapterOptions(options);
    expect(options.type).toBeUndefined();
    expect(options.paint).toEqual({ color: 'red' });
  });
});
