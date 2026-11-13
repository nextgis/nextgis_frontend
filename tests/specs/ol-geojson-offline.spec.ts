import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { OlMapAdapter } from '../../packages/ol-map-adapter/src/OlMapAdapter';
import { mapHtml } from '../helpers/mapHtml';
import { initialPoints } from '../helpers/universalTestCases/geoJsonLayerTests';
import { buildWebMap } from '../helpers/universalTestCases/webMapTests';

import type { Point } from 'geojson';
import type { WebMap } from '../../packages/webmap/src/WebMap';
import type { GeoJsonAdapter } from '../../packages/ol-map-adapter/src/layer-adapters/GeoJsonAdapter';

describe('OpenLayers-specific GeoJSON behavior', () => {
  let map: WebMap;

  beforeEach(async () => {
    document.body.innerHTML = mapHtml;
    map = await buildWebMap(OlMapAdapter, {
      target: 'map',
      center: [25, 12],
      zoom: 3,
    });
  });

  afterEach(() => map?.destroy());

  it('creates native OpenLayers features in a vector source', async () => {
    const layer = (await map.addGeoJsonLayer({
      data: initialPoints(),
      type: 'point',
      paint: { type: 'circle', radius: 6 },
    })) as GeoJsonAdapter;

    expect(layer.layer?.getSource()?.getFeatures()).toHaveLength(2);
  });

  it('toggles native labels through the public WebMap label API', async () => {
    const layer = (await map.addGeoJsonLayer({
      data: initialPoints(),
      type: 'point',
      paint: { type: 'circle', radius: 6 },
      labelField: 'label',
    })) as GeoJsonAdapter;

    expect(map.isLayerLabelVisible(layer)).toBe(true);
    map.hideLayerLabel(layer);
    expect(map.isLayerLabelVisible(layer)).toBe(false);
    map.showLayerLabel(layer);
    expect(map.isLayerLabelVisible(layer)).toBe(true);
    expect(layer.layer?.getSource()?.getFeatures()).toHaveLength(2);
  });

  it('reads a bare GeoJSON Point geometry through WebMap', async () => {
    const point: Point = { type: 'Point', coordinates: [10, 20] };
    const layer = (await map.addGeoJsonLayer({
      data: point,
      type: 'point',
      paint: { type: 'circle', radius: 6 },
    })) as GeoJsonAdapter;

    expect(layer.layer?.getSource()?.getFeatures()).toHaveLength(1);
  });

  it('keeps native source features when the clear predicate never matches', async () => {
    const layer = (await map.addGeoJsonLayer({
      data: initialPoints(),
      type: 'point',
      paint: { type: 'circle', radius: 6 },
    })) as GeoJsonAdapter;
    const predicate = vi.fn((feature: { id?: string | number }) => feature.id === 99);

    map.clearLayerData(layer, predicate);
    expect(predicate).toHaveBeenCalledTimes(2);
    expect(layer.layer?.getSource()?.getFeatures()).toHaveLength(2);
  });
});
