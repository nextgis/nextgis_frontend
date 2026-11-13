import { describe, expect, it, vi } from 'vitest';

import { IdentifyItem } from '../../packages/ngw-kit/src/IdentifyItem';

import type NgwConnector from '@nextgis/ngw-connector';
import type { LayerFeature } from '../../packages/ngw-connector/src/types/FeatureLayer';
import type { Point } from 'geojson';

const pointGeometry: Point = { type: 'Point', coordinates: [10, 20] };
const feature: LayerFeature = {
  id: 7, layerId: 42, label: 'Road 7', parent: '',
  fields: { name: 'Road', rank: 2 },
  geom: pointGeometry,
};

function fixture() {
  const itemGet = vi.fn().mockResolvedValue({
    id: 7, fields: { name: 'Road', rank: 2 },
    geom: { type: 'Point', coordinates: [10, 20] },
    extensions: { description: 'Survey' },
  });
  const extentGet = vi.fn().mockResolvedValue({
    extent: { minLon: 10, minLat: 20, maxLon: 30, maxLat: 40 },
  });
  const getResource = vi.fn().mockResolvedValue({
    resource: { id: 42, cls: 'vector_layer' },
    feature_layer: { fields: [{ keyname: 'name', datatype: 'STRING' }] },
  });
  const route = vi.fn((name: string) => ({
    get: name === 'feature_layer.feature.item_extent' ? extentGet : itemGet,
  }));
  // Only the transport boundary is replaced; IdentifyItem remains unmodified.
  const connector = { getResource, route } as unknown as NgwConnector;
  const item = new IdentifyItem({ feature, connector });
  return { item, connector, getResource, route, itemGet, extentGet };
}

describe('NGW identified feature lifecycle (offline)', () => {
  it('preserves the identity and original geometry of the identified feature', () => {
    const { item } = fixture();
    expect(item.id).toBe(7);
    expect(item.layerId).toBe(42);
    expect(item.label).toBe('Road 7');
    expect(item.fields).toEqual({ name: 'Road', rank: 2 });
    expect(item.geom).toEqual({ type: 'Point', coordinates: [10, 20] });
  });

  it('fetches identification details with the feature and layer IDs', async () => {
    const { item, route, itemGet } = fixture();
    const result = await item.identify({ cache: false });

    expect(result.id).toBe(7);
    expect(result.fields).toEqual({ name: 'Road', rank: 2 });
    expect(item.extensions).toEqual({ description: 'Survey' });
    expect(route).toHaveBeenCalledWith('feature_layer.feature.item', { id: 42, fid: 7 });
    expect(itemGet).toHaveBeenCalledWith(expect.objectContaining({
      cache: false,
      query: expect.objectContaining({
        extensions: ['attachment', 'description'],
        srs: 4326,
      }),
    }));
  });

  it('reuses an already identified feature instead of issuing another request', async () => {
    const { item, itemGet } = fixture();
    const first = await item.identify();
    const second = await item.identify();
    expect(second).toBe(first);
    expect(itemGet).toHaveBeenCalledOnce();
  });

  it('converts the identified NGW feature to GeoJSON and caches the result', async () => {
    const { item, itemGet } = fixture();
    const first = await item.geojson();
    expect(first).toEqual({
      type: 'Feature', id: 7,
      properties: { name: 'Road', rank: 2 },
      geometry: { type: 'Point', coordinates: [10, 20] },
    });
    expect(await item.geojson()).toBe(first);
    expect(itemGet).toHaveBeenCalledOnce();
  });

  it('loads a vector resource once and caches its composite', async () => {
    const { item, getResource } = fixture();
    const composite = await item.composite({ cache: false });
    expect(composite.resource.id).toBe(42);
    expect((await item.composite()).feature_layer).toBe(composite.feature_layer);
    expect(getResource).toHaveBeenCalledOnce();
    expect(getResource).toHaveBeenCalledWith(42, { cache: false });
  });

  it('exposes the same cached feature-layer metadata through resource()', async () => {
    const { item, getResource } = fixture();
    const meta = await item.resource();
    expect(meta.fields[0].keyname).toBe('name');
    expect(await item.resource()).toBe(meta);
    expect(getResource).toHaveBeenCalledOnce();
  });

  it('rejects an unknown resource rather than returning invalid layer metadata', async () => {
    const { item, getResource } = fixture();
    getResource.mockResolvedValue(undefined);
    await expect(item.composite()).rejects.toThrow('Resource does not exist');
  });

  it('rejects resources that are not vector layers', async () => {
    const { item, getResource } = fixture();
    getResource.mockResolvedValue({ resource: { id: 42, cls: 'resource_group' } });
    await expect(item.resource()).rejects.toThrow('Resource is not a vector layer');
  });

  it('requests a feature extent and converts NGW coordinate fields to bounds', async () => {
    const { item, route, extentGet } = fixture();
    const signal = new AbortController().signal;
    expect(await item.getBounds({ cache: false, signal })).toEqual([10, 20, 30, 40]);
    expect(route).toHaveBeenCalledWith('feature_layer.feature.item_extent', {
      id: 42, fid: 7,
    });
    expect(extentGet).toHaveBeenCalledWith({ cache: false, signal });
  });

  it('returns no extent when NGW supplies no geographical bounds', async () => {
    const { item, extentGet } = fixture();
    extentGet.mockResolvedValue({});
    await expect(item.getBounds()).resolves.toBeUndefined();
  });
});
