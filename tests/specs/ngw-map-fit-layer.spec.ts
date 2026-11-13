import { describe, expect, it } from 'vitest';

import { NgwMap } from '../../packages/ngw-map/src/NgwMap';

import type { LngLatBoundsArray } from '@nextgis/utils';

/** Exercise fitLayer without constructing a map or contacting NGW. */
function createMap(): NgwMap {
  const map = Object.create(NgwMap.prototype) as NgwMap;
  (map as unknown as { _ngwLayers: Record<string, unknown> })._ngwLayers = {};
  (map as unknown as { _layers: Record<string, unknown> })._layers = {};
  return map;
}

function registerNgwLayer(
  map: NgwMap,
  id: string,
  layer: Record<string, unknown>,
  resourceId = 7003,
): void {
  const layers = (
    map as unknown as {
      _ngwLayers: Record<string, unknown>;
    }
  )._ngwLayers;
  layers[id] = { layer, resourceId };
}

describe('NgwMap.fitLayer', () => {
  it('uses a string layer ID to find the registered NGW layer', async () => {
    const map = createMap();
    const bounds: LngLatBoundsArray = [100, 50, 110, 60];
    let fitted: LngLatBoundsArray | undefined;
    registerNgwLayer(map, 'roads', { getBounds: async () => bounds });
    map.fitBounds = ((value: LngLatBoundsArray) => {
      fitted = value;
      return map;
    }) as typeof map.fitBounds;

    await map.fitLayer('roads');

    expect(fitted).to.deep.equal(bounds);
  });

  it('also uses a numeric layer ID to find the registered NGW layer', async () => {
    const map = createMap();
    const bounds: LngLatBoundsArray = [10, 20, 30, 40];
    let fitted: LngLatBoundsArray | undefined;
    registerNgwLayer(map, '7003', { getBounds: async () => bounds });
    map.fitBounds = ((value: LngLatBoundsArray) => {
      fitted = value;
      return map;
    }) as typeof map.fitBounds;

    await map.fitLayer(7003);

    expect(fitted).to.deep.equal(bounds);
  });

  it('awaits the remote extent when the NGW layer has no getBounds', async () => {
    const map = createMap();
    const resourceLayer = {
      id: 'roads',
      item: { resource: { id: 7003 } },
    };
    registerNgwLayer(map, 'roads', resourceLayer);
    let release!: () => void;
    const pending = new Promise<void>((resolve) => {
      release = resolve;
    });
    let resourceId: number | undefined;
    map.fitResource = async (resource) => {
      await pending;
      resourceId = Number(resource);
    };

    let settled = false;
    const result = map
      .fitLayer(resourceLayer as unknown as Parameters<NgwMap['fitLayer']>[0])
      .then(() => {
        settled = true;
      });
    await Promise.resolve();
    await Promise.resolve();
    expect(settled).to.equal(false);

    release();
    await result;
    expect(resourceId).to.equal(7003);
  });

  it('waits for the base WebMap fitLayer when layer is not an NGW resource', async () => {
    const map = createMap();
    const bounds: LngLatBoundsArray = [1, 2, 3, 4];
    let resolveBounds!: (value: LngLatBoundsArray) => void;
    const pendingBounds = new Promise<LngLatBoundsArray>((resolve) => {
      resolveBounds = resolve;
    });
    (map as unknown as { _layers: Record<string, unknown> })._layers.local = {
      id: 'local',
      getBounds: () => pendingBounds,
    };
    let fitted: LngLatBoundsArray | undefined;
    map.fitBounds = ((value: LngLatBoundsArray) => {
      fitted = value;
      return map;
    }) as typeof map.fitBounds;

    let settled = false;
    const result = map.fitLayer('local').then(() => {
      settled = true;
    });
    await Promise.resolve();
    await Promise.resolve();
    expect(settled).to.equal(false);

    resolveBounds(bounds);
    await result;
    expect(fitted).to.deep.equal(bounds);
  });
});
