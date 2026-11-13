import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CircleMarker } from 'leaflet';

import { LeafletMapAdapter } from '../../packages/leaflet-map-adapter/src/LeafletMapAdapter';
import { mapHtml } from '../helpers/mapHtml';
import { initialPoints } from '../helpers/universalTestCases/geoJsonLayerTests';
import { buildWebMap } from '../helpers/universalTestCases/webMapTests';

import type { Polygon } from 'geojson';
import type { WebMap } from '../../packages/webmap/src/WebMap';
import type { GeoJsonAdapter } from '../../packages/leaflet-map-adapter/src/layer-adapters/GeoJsonAdapter/GeoJsonAdapter';

// Engine-specific assertions are intentionally separate from the WebMap contract.
describe('Leaflet-specific GeoJSON behavior', () => {
  let map: WebMap;

  beforeEach(async () => {
    document.body.innerHTML = mapHtml;
    map = await buildWebMap(LeafletMapAdapter, {
      target: 'map',
      center: [25, 12],
      zoom: 3,
    });
  });

  afterEach(() => map?.destroy());

  it('renders points as native Leaflet CircleMarker layers', async () => {
    const layer = (await map.addGeoJsonLayer({
      data: initialPoints(),
      type: 'point',
      paint: { type: 'circle', radius: 6 },
    })) as GeoJsonAdapter;

    expect(layer.type).toBe('point');
    expect(layer.layer?.getLayers()).toHaveLength(2);
    expect(layer.getLayers()[0].layer).toBeInstanceOf(CircleMarker);
  });

  it('applies opacity to a native Leaflet GeoJSON layer', async () => {
    const layer = (await map.addGeoJsonLayer({
      data: initialPoints(),
      type: 'point',
      paint: { type: 'circle', radius: 6, opacity: 1 },
    })) as GeoJsonAdapter;

    map.setLayerOpacity(layer, 0.4);
    expect(layer.options.opacity).toBe(0.4);
    expect(layer.layer?.getLayers()).toHaveLength(2);
  });

  it('rejects an incompatible geometry instead of corrupting a point layer', async () => {
    const layer = await map.addGeoJsonLayer({
      data: initialPoints(),
      type: 'point',
      paint: { type: 'circle', radius: 6 },
    });
    const polygon: Polygon = {
      type: 'Polygon',
      coordinates: [[[0, 0], [1, 0], [0, 1], [0, 0]]],
    };
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});

    try {
      map.addLayerData(layer, polygon);
      expect(layer.getLayers()).toHaveLength(2);
      expect(warning).toHaveBeenCalled();
    } finally {
      warning.mockRestore();
    }
  });
});
