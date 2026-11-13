import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Map as LeafletMap } from 'leaflet';

import { ImageLayer } from '../../packages/leaflet-map-adapter/src/layer-adapters/ImageAdapter/ImageLayer';

describe('Leaflet IMAGE layer request options and native state without network', () => {
  let map: LeafletMap;

  beforeEach(() => {
    document.body.innerHTML = '<div id="leaflet-image-map" style="width: 640px; height: 480px"></div>';
    map = new LeafletMap('leaflet-image-map', {
      zoomControl: false, attributionControl: false,
    }).setView([10, 20], 5);
  });

  afterEach(() => {
    map.remove();
    vi.restoreAllMocks();
  });

  it('keeps standard GetMap defaults and excludes nested request parameters', () => {
    const layer = new ImageLayer('https://example.invalid/image', {
      params: { layers: 'roads', extra: { nested: 1 }, list: [1, 2], ignore: () => 'value' },
    });
    expect(layer.wmsParams).toEqual({ request: 'GetMap', layers: 'roads' });
  });

  it('uses the provided attribution or an empty string by default', () => {
    expect(new ImageLayer('/image', { attribution: 'Custom source' }).getAttribution())
      .toBe('Custom source');
    expect(new ImageLayer('/image', {}).getAttribution()).toBe('');
  });

  it('includes new request params without replacing existing ones', () => {
    const layer = new ImageLayer('/image', { params: { LAYERS: 'a' } });
    layer.setParams({ TIME: '2026', FORMAT: 'image/png' });
    expect(layer.wmsParams).toMatchObject({
      request: 'GetMap', LAYERS: 'a', TIME: '2026', FORMAT: 'image/png',
    });
  });

  it('uses uppercase URL parameter encoding when requested', () => {
    const layer = new ImageLayer('https://example.invalid/image', {
      uppercase: true, params: { layers: 'water' },
    });
    const url = layer.getImageUrl();
    expect(url).toContain('LAYERS=water');
    expect(url).toContain('REQUEST=GetMap');
  });

  it('computes geographic bounds and image dimensions from the native map', () => {
    const layer = new ImageLayer('/image', { params: { layers: 'roads' } });
    layer.updateWmsParams(map);
    expect(layer.wmsParams).toMatchObject({
      width: 640, height: 480,
    });
    expect(layer.wmsParams.bbox).toHaveLength(4);
  });

  it('expands requested image dimensions when the viewport buffer is positive', () => {
    const layer = new ImageLayer('/image', { viewPortBuffer: 0.25 });
    layer.updateWmsParams(map);
    expect(layer.wmsParams.width).toBe(800);
    expect(layer.wmsParams.height).toBe(600);
  });

  it('publishes moveend events through a debounced update callback', () => {
    const layer = new ImageLayer('/image', { setViewDelay: 10 });
    expect(layer.getEvents().moveend).toBeTypeOf('function');
  });

  it('updates opacity and emits the resulting public event', () => {
    const layer = new ImageLayer('/image', {});
    const listener = vi.fn();
    layer.on('opacitychange', listener);
    layer.setOpacity(0.35);
    expect(layer.options.opacity).toBe(0.35);
    expect(listener).toHaveBeenCalledOnce();
  });

  it('stores the desired stacking order and z-index before mounting', () => {
    const layer = new ImageLayer('/image', {});
    layer.bringToBack();
    expect(layer.options.isBack).toBe(true);
    layer.bringToFront();
    expect(layer.options.isBack).toBe(false);
    layer.setZIndex(12);
    expect(layer.options.zIndex).toBe(12);
  });

  it('allows removing an IMAGE layer that has not loaded any overlays', () => {
    const layer = new ImageLayer('/image', {});
    expect(layer.onRemove(map)).toBe(layer);
    expect(layer.onAdd()).toBe(layer);
  });
});
