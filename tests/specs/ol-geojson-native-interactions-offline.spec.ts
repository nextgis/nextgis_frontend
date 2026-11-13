import MapBrowserEvent from 'ol/MapBrowserEvent';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { OlMapAdapter } from '../../packages/ol-map-adapter/src/OlMapAdapter';
import { mapHtml } from '../helpers/mapHtml';
import { buildWebMap } from '../helpers/universalTestCases/webMapTests';

import type { Feature, FeatureCollection, Point } from 'geojson';
import type Map from 'ol/Map';

import type { GeoJsonAdapter } from '../../packages/ol-map-adapter/src/layer-adapters/GeoJsonAdapter';
import type { WebMap } from '../../packages/webmap/src/WebMap';

function feature(id: number): Feature<Point> {
  return {
    type: 'Feature',
    id,
    properties: { id, title: `Point ${id}` },
    geometry: { type: 'Point', coordinates: [20 + id, 10 + id] },
  };
}
function collection(...features: Feature<Point>[]): FeatureCollection<Point> {
  return { type: 'FeatureCollection', features };
}
function getNativeMap(map: WebMap): Map {
  const native = (map.mapAdapter as OlMapAdapter).map;

  if (!native) {
    throw new Error('OpenLayers map was not initialized');
  }

  return native;
}

describe('OpenLayers GeoJSON native event dispatch and selection (offline)', () => {
  const maps: WebMap[] = [];
  beforeEach(() => {
    document.body.innerHTML = mapHtml;
  });
  afterEach(() => {
    vi.restoreAllMocks();
    for (const map of maps.splice(0)) map.destroy();
  });

  async function createMap(): Promise<WebMap> {
    const map = await buildWebMap(OlMapAdapter, {
      target: 'map',
      center: [21, 11],
      zoom: 6,
    });
    maps.push(map);
    return map;
  }

  function browserEvent(map: Map, type: 'click' | 'dblclick' | 'pointermove') {
    const center = map.getView().getCenter();
    if (!center) {
      throw new Error('OpenLayers map center was not initialized');
    }

    const event = new MapBrowserEvent(
      type,
      map,
      new PointerEvent(type, {
        bubbles: true,
        clientX: 20,
        clientY: 30,
      }),
    );

    event.pixel = [20, 30];
    event.coordinate = center;

    return event;
  }

  it('selects the native feature and sends the click to the public callback', async () => {
    const map = await createMap();
    const onClick = vi.fn();
    const onSelect = vi.fn();
    const layer = await map.addGeoJsonLayer({
      data: collection(feature(1)),
      type: 'point',
      paint: { type: 'circle', radius: 6 },
      selectedPaint: { type: 'circle', radius: 10 },
      selectable: true,
      onClick,
      onSelect,
    });
    const geo = layer as unknown as GeoJsonAdapter;
    const native = getNativeMap(map);
    const first = geo.layer?.getSource()?.getFeatures()[0];
    if (!first) throw new Error('OpenLayers feature was not registered');
    vi.spyOn(native, 'getFeaturesAtPixel').mockReturnValue([first]);
    (map.mapAdapter as OlMapAdapter).onMapClick(browserEvent(native, 'click'));
    expect(geo.getSelected().map(({ feature }) => feature.id)).toEqual([1]);
    expect(onClick).toHaveBeenCalledOnce();
    expect(onClick).toHaveBeenCalledWith(
      expect.objectContaining({
        selected: true,
        feature: expect.objectContaining({ id: 1 }),
      }),
    );
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'click' }),
    );
  });

  it('unselects on the second click when requested', async () => {
    const map = await createMap();
    const layer = await map.addGeoJsonLayer({
      data: collection(feature(1)),
      type: 'point',
      paint: { type: 'circle', radius: 6 },
      selectedPaint: { type: 'circle', radius: 10 },
      selectable: true,
      unselectOnSecondClick: true,
    });
    const geo = layer as unknown as GeoJsonAdapter;
    const native = getNativeMap(map);
    const first = geo.layer?.getSource()?.getFeatures()[0];
    if (!first) throw new Error('OpenLayers feature was not registered');
    vi.spyOn(native, 'getFeaturesAtPixel').mockReturnValue([first]);
    const event = browserEvent(native, 'click');
    (map.mapAdapter as OlMapAdapter).onMapClick(event);
    expect(geo.getSelected()).toHaveLength(1);
    (map.mapAdapter as OlMapAdapter).onMapClick(event);
    expect(geo.getSelected()).toHaveLength(0);
    expect(geo.getLayers()).toHaveLength(1);
  });

  it('routes double-click events without firing the single-click callback', async () => {
    const map = await createMap();
    const onClick = vi.fn();
    const onDoubleClick = vi.fn();
    const layer = await map.addGeoJsonLayer({
      data: collection(feature(2)),
      type: 'point',
      paint: { type: 'circle', radius: 6 },
      onClick,
      onDoubleClick,
    });
    const geo = layer as unknown as GeoJsonAdapter;
    const native = getNativeMap(map);
    const first = geo.layer?.getSource()?.getFeatures()[0];
    if (!first) throw new Error('OpenLayers feature was not registered');
    vi.spyOn(native, 'getFeaturesAtPixel').mockReturnValue([first]);
    (map.mapAdapter as OlMapAdapter).onMapClick(
      browserEvent(native, 'dblclick'),
      'dblclick',
    );
    expect(onDoubleClick).toHaveBeenCalledOnce();
    expect(onDoubleClick).toHaveBeenCalledWith(
      expect.objectContaining({
        feature: expect.objectContaining({ id: 2 }),
      }),
    );
    expect(onClick).not.toHaveBeenCalled();
  });

  it('clears a click-selected feature after a click outside the vector layer', async () => {
    const map = await createMap();
    const layer = await map.addGeoJsonLayer({
      data: collection(feature(1)),
      type: 'point',
      paint: { type: 'circle', radius: 6 },
      selectable: true,
    });
    const geo = layer as unknown as GeoJsonAdapter;
    const native = getNativeMap(map);
    const first = geo.layer?.getSource()?.getFeatures()[0];
    if (!first) throw new Error('OpenLayers feature was not registered');
    const hitTest = vi
      .spyOn(native, 'getFeaturesAtPixel')
      .mockReturnValue([first]);
    (map.mapAdapter as OlMapAdapter).onMapClick(browserEvent(native, 'click'));
    expect(geo.getSelected()).toHaveLength(1);
    hitTest.mockReturnValue([]);
    (map.mapAdapter as OlMapAdapter).onMapClick(browserEvent(native, 'click'));
    expect(geo.getSelected()).toHaveLength(0);
  });

  it('creates a labeled feature style using its feature properties', async () => {
    const map = await createMap();
    const layer = await map.addGeoJsonLayer({
      data: collection(feature(3)),
      type: 'point',
      paint: { type: 'circle', radius: 6 },
      labelField: 'title',
    });
    const geo = layer as unknown as GeoJsonAdapter;
    const first = geo.layer?.getSource()?.getFeatures()[0];
    if (!first) throw new Error('OpenLayers feature was not registered');
    geo.hideLabel();
    expect(geo.isLabelVisible()).toBe(false);
    geo.showLabel();
    expect(geo.isLabelVisible()).toBe(true);
    const style = first.getStyle();
    expect(Array.isArray(style)).toBe(true);
    if (!Array.isArray(style))
      throw new Error('Expected an array of feature styles');
    expect(
      style.some((entry) => entry.getText()?.getText() === 'Point 3'),
    ).toBe(true);
  });

  it('unregisters native hit-test callbacks when the layer is removed', async () => {
    const map = await createMap();
    const native = getNativeMap(map);
    const callbacksBefore = native.get('_forEachFeatureAtPixel') as unknown[];
    const originalLength = callbacksBefore.length;
    const layer = await map.addGeoJsonLayer({
      data: collection(feature(1)),
      type: 'point',
      paint: { type: 'circle', radius: 6 },
      interactive: true,
    });
    expect(callbacksBefore).toHaveLength(originalLength + 1);
    map.removeLayer(layer);
    expect(callbacksBefore).toHaveLength(originalLength);
    expect(map.getLayer(layer.id!)).toBeUndefined();
  });
});
