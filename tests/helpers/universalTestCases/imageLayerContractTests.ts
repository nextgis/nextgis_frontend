import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import type { Type } from '@nextgis/utils';
import type { MapAdapter } from '../../../packages/webmap/src';
import type { WebMap } from '../../../packages/webmap/src/WebMap';

import { mapHtml } from '../mapHtml';
import { buildWebMap } from './webMapTests';

/** Only engines that expose the IMAGE adapter should run this contract. */
export function imageLayerContractTests(MA: Type<MapAdapter>): void {
  describe(`${MA.name}: IMAGE layer public API`, () => {
    let map: WebMap;

    beforeEach(async () => {
      document.body.innerHTML = mapHtml;
      map = await buildWebMap(MA, { target: 'map' });
    });

    afterEach(() => map.destroy());

    it('creates and registers an IMAGE layer without requesting an image', async () => {
      const layer = await map.addImageLayer({
        url: 'https://example.invalid/wms',
        id: 'image-contract',
        visibility: false,
        opacity: 0.45,
        params: { layers: 'roads' },
      });

      expect(layer).toBeDefined();
      expect(layer.layer).toBeDefined();
      expect(map.getLayer('image-contract')).toBe(layer);
      expect(map.isLayerVisible(layer)).toBe(false);
    });

    it('updates IMAGE request parameters through WebMap.updateLayer', async () => {
      const layer = await map.addImageLayer({
        url: 'https://example.invalid/wms', visibility: false,
        params: { layers: 'roads' },
      });
      await expect(map.updateLayer(layer, { params: { TIME: '2026-11-13' } }))
        .resolves.toBeUndefined();
      expect(map.getLayer(layer)).toBe(layer);
    });

    it('removes IMAGE layers from the map registry', async () => {
      const layer = await map.addImageLayer({
        url: 'https://example.invalid/wms', id: 'remove-image',
        visibility: false, params: {},
      });
      expect(map.getLayer('remove-image')).toBe(layer);
      map.removeLayer(layer);
      expect(map.getLayer('remove-image')).toBeUndefined();
    });
  });
}
