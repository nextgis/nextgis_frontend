import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { LeafletMapAdapter } from '../../packages/leaflet-map-adapter/src/LeafletMapAdapter';
import { ImageLayer } from '../../packages/leaflet-map-adapter/src/layer-adapters/ImageAdapter/ImageLayer';
import { mapHtml } from '../helpers/mapHtml';
import { buildWebMap } from '../helpers/universalTestCases/webMapTests';

import type { WebMap } from '../../packages/webmap/src/WebMap';

describe('Leaflet IMAGE/WMS layer without remote image requests', () => {
  let map: WebMap;

  beforeEach(async () => {
    document.body.innerHTML = mapHtml;
    map = await buildWebMap(LeafletMapAdapter, {
      target: 'map', center: [30, 50], zoom: 6,
    });
  });

  afterEach(() => map.destroy());

  it('initializes a WMS image layer and retains URL parameters', async () => {
    const adapter = await map.addImageLayer({
      url: 'https://example.invalid/tiles', visibility: false,
      params: { resource: 17, quality: 'high' },
    });
    const layer = adapter.layer as ImageLayer;
    expect(layer).toBeInstanceOf(ImageLayer);
    expect(layer.wmsParams.request).toBe('GetMap');
    expect(layer.wmsParams.resource).toBe(17);
    expect(layer.getImageUrl()).toContain('resource=17');
  });

  it('passes renderer-computed bounds through updateWmsParams', async () => {
    const adapter = await map.addImageLayer({
      url: 'https://example.invalid/render', visibility: false,
      params: { resource: 5 },
      updateWmsParams: (params) => ({ ...params, custom: 'value' }),
    });
    const layer = adapter.layer as ImageLayer;
    layer.updateWmsParams(map.mapAdapter.map);
    expect(layer.wmsParams.custom).toBe('value');
    expect(Number(layer.wmsParams.width)).toBeGreaterThan(0);
    expect(Number(layer.wmsParams.height)).toBeGreaterThan(0);
    expect(layer.getImageUrl()).toContain('custom=value');
  });

  it('updates an IMAGE layer through WebMap without displaying it', async () => {
    const adapter = await map.addImageLayer({
      url: 'https://example.invalid/render', visibility: false,
      params: { resource: 3 },
    });
    const layer = adapter.layer as ImageLayer;
    await map.updateLayer(adapter, { params: { style: 'new-style' } });
    expect(layer.wmsParams.style).toBe('new-style');
    expect(layer.getImageUrl()).toContain('style=new-style');
  });

  it('updates opacity and stacking options before the layer is shown', async () => {
    const adapter = await map.addImageLayer({
      url: 'https://example.invalid/render', visibility: false,
      params: {},
    });
    const layer = adapter.layer as ImageLayer;
    layer.setOpacity(0.25);
    layer.bringToBack();
    expect(layer.options.opacity).toBe(0.25);
    expect(layer.options.isBack).toBe(true);
    layer.bringToFront();
    layer.setZIndex(10);
    expect(layer.options.isBack).toBe(false);
    expect(layer.options.zIndex).toBe(10);
  });
});
