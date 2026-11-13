import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import ImageWMS from 'ol/source/ImageWMS';

import { OlMapAdapter } from '../../packages/ol-map-adapter/src/OlMapAdapter';
import { mapHtml } from '../helpers/mapHtml';
import { buildWebMap } from '../helpers/universalTestCases/webMapTests';

import type { WebMap } from '../../packages/webmap/src/WebMap';
import type ImageLayer from 'ol/layer/Image';

describe('OpenLayers IMAGE/WMS layer without remote image requests', () => {
  let map: WebMap;

  beforeEach(async () => {
    document.body.innerHTML = mapHtml;
    map = await buildWebMap(OlMapAdapter, { target: 'map' });
  });

  afterEach(() => map.destroy());

  it('initializes an ImageWMS source with configured rendering parameters', async () => {
    const adapter = await map.addImageLayer({
      url: 'https://example.invalid/render', visibility: false,
      opacity: 0.3, params: { LAYERS: 'roads', FORMAT: 'image/png' },
    });
    const layer = adapter.layer as ImageLayer<ImageWMS>;
    expect(layer.getSource()).toBeInstanceOf(ImageWMS);
    expect(layer.getSource()?.getParams()).toMatchObject({
      LAYERS: 'roads', FORMAT: 'image/png',
    });
    expect(layer.getOpacity()).toBeCloseTo(0.3);
  });

  it('uses the extended renderer when image ratio exceeds one', async () => {
    const adapter = await map.addImageLayer({
      url: 'https://example.invalid/render', visibility: false,
      ratio: 2, params: { LAYERS: 'buildings' },
    });
    const layer = adapter.layer as ImageLayer<ImageWMS>;
    expect(layer.getSource()).toBeInstanceOf(ImageWMS);
    expect(layer.getSource()?.getParams()).toMatchObject({ LAYERS: 'buildings' });
  });

  it('merges parameter updates through WebMap.updateLayer', async () => {
    const adapter = await map.addImageLayer({
      url: 'https://example.invalid/render', visibility: false,
      params: { LAYERS: 'roads' },
    });
    await map.updateLayer(adapter, { params: { TIME: '2026-11-13' } });
    const layer = adapter.layer as ImageLayer<ImageWMS>;
    expect(layer.getSource()?.getParams()).toMatchObject({
      LAYERS: 'roads', TIME: '2026-11-13',
    });
  });

  it('changes image opacity with the public WebMap method', async () => {
    const adapter = await map.addImageLayer({
      url: 'https://example.invalid/render', visibility: false,
      params: {},
    });
    map.setLayerOpacity(adapter, 0.6);
    const layer = adapter.layer as ImageLayer<ImageWMS>;
    expect(layer.getOpacity()).toBeCloseTo(0.6);
  });
});
