import { latLng, point } from 'leaflet';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { LeafletMapAdapter } from '../../packages/leaflet-map-adapter/src/LeafletMapAdapter';
import { mapHtml } from '../helpers/mapHtml';
import { buildWebMap } from '../helpers/universalTestCases/webMapTests';

import type { Feature, FeatureCollection, Point } from 'geojson';
import type { Layer, LeafletMouseEvent } from 'leaflet';

import type { WebMap } from '../../packages/webmap/src/WebMap';

function station(id: number, label: string): Feature<Point> {
  return {
    type: 'Feature',
    id,
    properties: { label, id },
    geometry: { type: 'Point', coordinates: [20 + id, 10 + id] },
  };
}
function data(...features: Feature<Point>[]): FeatureCollection<Point> {
  return { type: 'FeatureCollection', features };
}

describe('Leaflet GeoJSON native feature events and tooltips (offline)', () => {
  const maps: WebMap[] = [];
  beforeEach(() => {
    document.body.innerHTML = mapHtml;
  });
  afterEach(() => {
    vi.restoreAllMocks();
    for (const map of maps.splice(0)) map.destroy();
  });

  async function createMap(): Promise<WebMap> {
    const map = await buildWebMap(LeafletMapAdapter, {
      target: 'map',
      center: [21, 11],
      zoom: 6,
    });
    maps.push(map);
    return map;
  }

  function fireMouse(
    layer: Layer,
    type: 'click' | 'dblclick' | 'mouseover' | 'mouseout',
  ) {
    layer.fire(type, {
      latlng: latLng(11, 21),
      containerPoint: point(15, 25),
      layerPoint: point(15, 25),
      originalEvent: new MouseEvent(type),
    } satisfies Partial<LeafletMouseEvent>);
  }

  it('passes the feature and geographical mouse position to onClick', async () => {
    const map = await createMap();
    const onClick =
      vi.fn<
        (evt: { feature?: Feature; event?: { lngLat: number[] } }) => void
      >();
    const adapter = await map.addGeoJsonLayer({
      data: data(station(1, 'First')),
      type: 'point',
      paint: { type: 'circle', radius: 6 },
      onClick,
    });
    const native = adapter.getLayers()[0].layer;
    expect(native).toBeDefined();
    if (!native) throw new Error('Leaflet feature layer is missing');
    fireMouse(native, 'click');
    expect(onClick).toHaveBeenCalledOnce();
    expect(onClick).toHaveBeenCalledWith(
      expect.objectContaining({
        feature: expect.objectContaining({ id: 1 }),
        event: expect.objectContaining({ lngLat: [21, 11] }),
      }),
    );
    expect(adapter.getSelected()).toHaveLength(0);
  });

  it('delivers double-click data separately from a single click', async () => {
    const map = await createMap();
    const onClick = vi.fn();
    const onDoubleClick = vi.fn();
    const adapter = await map.addGeoJsonLayer({
      data: data(station(1, 'First')),
      type: 'point',
      paint: { type: 'circle', radius: 6 },
      onClick,
      onDoubleClick,
    });
    const native = adapter.getLayers()[0].layer;
    if (!native) throw new Error('Leaflet feature layer is missing');
    fireMouse(native, 'dblclick');
    expect(onDoubleClick).toHaveBeenCalledOnce();
    expect(onClick).not.toHaveBeenCalled();
    expect(onDoubleClick).toHaveBeenCalledWith(
      expect.objectContaining({
        feature: expect.objectContaining({
          properties: expect.objectContaining({ label: 'First' }),
        }),
      }),
    );
  });

  it('selects on mouse over and deselects on mouse out when selectOnHover is enabled', async () => {
    const map = await createMap();
    const onSelect = vi.fn();
    const adapter = await map.addGeoJsonLayer({
      data: data(station(1, 'First')),
      type: 'point',
      paint: { type: 'circle', radius: 6 },
      selectedPaint: { type: 'circle', radius: 10 },
      selectable: true,
      selectOnHover: true,
      onSelect,
    });
    const native = adapter.getLayers()[0].layer;
    if (!native) throw new Error('Leaflet feature layer is missing');
    fireMouse(native, 'mouseover');
    expect(adapter.getSelected().map(({ feature }) => feature.id)).toEqual([1]);
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'hover',
        features: [expect.objectContaining({ id: 1 })],
      }),
    );
    fireMouse(native, 'mouseout');
    expect(adapter.getSelected()).toHaveLength(0);
  });

  it('toggles click selection on the same feature without deleting it', async () => {
    const map = await createMap();
    const adapter = await map.addGeoJsonLayer({
      data: data(station(1, 'First')),
      type: 'point',
      paint: { type: 'circle', radius: 6 },
      selectedPaint: { type: 'circle', radius: 10 },
      selectable: true,
      unselectOnSecondClick: true,
    });
    const native = adapter.getLayers()[0].layer;
    if (!native) throw new Error('Leaflet feature layer is missing');
    fireMouse(native, 'click');
    expect(adapter.getSelected().map(({ feature }) => feature.id)).toEqual([1]);
    fireMouse(native, 'click');
    expect(adapter.getSelected()).toHaveLength(0);
    expect(adapter.getLayers().map(({ feature }) => feature.id)).toEqual([1]);
  });

  it('notifies mouse-enter and mouse-leave listeners with the feature', async () => {
    const map = await createMap();
    const onMouseOver = vi.fn();
    const onMouseOut = vi.fn();
    const adapter = await map.addGeoJsonLayer({
      data: data(station(1, 'First')),
      type: 'point',
      paint: { type: 'circle', radius: 6 },
      onMouseOver,
      onMouseOut,
    });
    const native = adapter.getLayers()[0].layer;
    if (!native) throw new Error('Leaflet feature layer is missing');
    fireMouse(native, 'mouseover');
    fireMouse(native, 'mouseout');
    expect(onMouseOver).toHaveBeenCalledOnce();
    expect(onMouseOut).toHaveBeenCalledOnce();
    for (const spy of [onMouseOver, onMouseOut]) {
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          feature: expect.objectContaining({ id: 1 }),
        }),
      );
    }
  });

  it('creates a tooltip from labelField and updates it with new GeoJSON', async () => {
    const map = await createMap();
    const adapter = await map.addGeoJsonLayer({
      data: data(station(1, 'Old title')),
      type: 'point',
      paint: { type: 'circle', radius: 6 },
      labelField: 'label',
    });
    const first = adapter.getLayers()[0].layer;
    if (!first) throw new Error('Leaflet feature layer is missing');
    await vi.waitFor(() =>
      expect(first.getTooltip()?.getContent()).toBe('Old title'),
    );
    await map.setLayerData(adapter, data(station(2, 'New title')));
    const second = adapter.getLayers()[0].layer;
    if (!second)
      throw new Error('Replacement Leaflet feature layer is missing');
    await vi.waitFor(() =>
      expect(second.getTooltip()?.getContent()).toBe('New title'),
    );
    expect(adapter.getLayers().map(({ feature }) => feature.id)).toEqual([2]);
  });

  it('computes tooltip text using the label callback when no labelField is supplied', async () => {
    const map = await createMap();
    const label = vi.fn<(feature: { feature: Feature }) => string>(
      ({ feature }) => `Station ${feature.id}`,
    );
    const adapter = await map.addGeoJsonLayer({
      data: data(station(8, 'Stored')),
      type: 'point',
      paint: { type: 'circle', radius: 6 },
      label,
    });
    const native = adapter.getLayers()[0].layer;
    if (!native) throw new Error('Leaflet feature layer is missing');
    await vi.waitFor(() =>
      expect(native.getTooltip()?.getContent()).toBe('Station 8'),
    );
    expect(label).toHaveBeenCalledWith(
      expect.objectContaining({
        feature: expect.objectContaining({ id: 8 }),
      }),
    );
  });
});
