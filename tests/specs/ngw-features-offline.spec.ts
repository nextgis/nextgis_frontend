import { describe, expect, it, vi } from 'vitest';

import {
  createGeoJsonFeature,
  fetchNgwLayerItemsRequest,
  updateItemRequestParam,
} from '../../packages/ngw-kit/src/utils/featureLayerUtils';
import { createPopupContent } from '../../packages/ngw-kit/src/utils/createPopupContent';
import { fetchNgwLayerCount } from '../../packages/ngw-kit/src/utils/fetchNgwLayerCount';
import { fetchNgwLayerFeatureCollection } from '../../packages/ngw-kit/src/utils/fetchNgwLayerFeatureCollection';
import { fetchNgwLayerFeatures } from '../../packages/ngw-kit/src/utils/fetchNgwLayerFeatures';
import { fetchNgwLayerItem } from '../../packages/ngw-kit/src/utils/fetchNgwLayerItem';
import { fetchNgwLayerItems } from '../../packages/ngw-kit/src/utils/fetchNgwLayerItems';
import { selectNgwLayerDistinct } from '../../packages/ngw-kit/src/utils/selectNgwLayerDistinct';

import type NgwConnector from '@nextgis/ngw-connector';
import type { Feature } from 'geojson';
import type { CompositeRead } from '@nextgisweb/resource/type/api';

const sampleItems = [
  { id: 1, fields: { kind: 'road', rank: 2 }, geom: { type: 'Point', coordinates: [10, 20] } },
  { id: 2, fields: { kind: 'road', rank: 3 }, geom: { type: 'Point', coordinates: [30, 40] } },
  { id: 3, fields: { kind: 'river', rank: 2 }, geom: { type: 'Point', coordinates: [50, 60] } },
];

function fixture(items: unknown = sampleItems) {
  const get = vi.fn().mockResolvedValue(items);
  const route = vi.fn((_name: string, _params?: unknown) => ({ get }));
  const connector = { route } as unknown as NgwConnector;
  return { connector, route, get };
}

describe('NGW vector feature requests with an in-memory transport', () => {
  it('forms a feature collection request with expected defaults', async () => {
    const { connector, route, get } = fixture();
    await fetchNgwLayerItemsRequest({ connector, resourceId: 10 });
    expect(route).toHaveBeenCalledWith('feature_layer.feature.collection', { id: 10 });
    expect(get).toHaveBeenCalledWith({
      query: { srs: 4326, geom_format: 'geojson', dt_format: 'iso', extensions: [] },
      cache: undefined, signal: undefined,
    });
  });

  it('forwards paging, sort order, and custom query parameters', async () => {
    const { connector, get } = fixture([]);
    const signal = new AbortController().signal;
    await fetchNgwLayerItemsRequest({
      connector, resourceId: 10, limit: 20, offset: 5,
      orderBy: ['name', 'id'], geomFormat: 'wkt', cache: true, signal,
      query: { rank: 2 },
      paramList: [['key', 'value']],
    });
    expect(get).toHaveBeenCalledWith({
      query: expect.objectContaining({
        limit: 20, offset: 5, order_by: 'name,id',
        geom_format: 'wkt', rank: 2, key: 'value',
      }),
      cache: true, signal,
    });
  });

  it('omits unlimited limits and disabled geometry parameters', async () => {
    const { connector, get } = fixture([]);
    await fetchNgwLayerItemsRequest({
      connector, resourceId: 1, limit: Infinity, geom: false,
    });
    const query = get.mock.calls[0][0].query;
    expect(query.limit).toBeUndefined();
    expect(query.geom).toBe(false);
    expect(query.srs).toBeUndefined();
    expect(query.geom_format).toBeUndefined();
  });

  it('serializes an explicit WKT intersection without modifying it', async () => {
    const { connector, get } = fixture([]);
    await fetchNgwLayerItemsRequest({
      connector, resourceId: 1, intersects: 'POLYGON((1 2,3 4,1 2))',
    });
    expect(get.mock.calls[0][0].query.intersects).toBe('POLYGON((1 2,3 4,1 2))');
  });

  it('converts bounding boxes to WKT intersection polygons', async () => {
    const { connector, get } = fixture([]);
    await fetchNgwLayerItemsRequest({
      connector, resourceId: 1, intersects: [1, 2, 3, 4],
    });
    expect(get.mock.calls[0][0].query.intersects).toMatch(/^POLYGON\(\(/);
  });

  it('applies request geometry and field flags', () => {
    const params: Parameters<typeof updateItemRequestParam>[0] = { srs: 4326, geom_format: 'geojson' };
    updateItemRequestParam(params, { geom: false, fields: ['name'] });
    expect(params.geom).toBe(false);
    expect(params.fields).toEqual(['name']);
    expect(params.srs).toBeUndefined();
    expect(params.geom_format).toBeUndefined();
    expect(params.extensions).toEqual([]);
  });

  it('passes language search and spatial reference parameters', () => {
    const params: Parameters<typeof updateItemRequestParam>[0] = {};
    updateItemRequestParam(params, { ilike: 'road', srs: 3857, extensions: ['description'] } as never);
    expect(params).toMatchObject({ ilike: 'road', srs: 3857, extensions: ['description'] });
  });

  it('converts NGW feature items to GeoJSON objects', () => {
    expect(createGeoJsonFeature(sampleItems[0] as never)).toEqual({
      type: 'Feature', id: 1, properties: { kind: 'road', rank: 2 },
      geometry: { type: 'Point', coordinates: [10, 20] },
    });
  });

  it('fetches a GeoJSON feature collection', async () => {
    const { connector } = fixture();
    const collection = await fetchNgwLayerFeatureCollection({ connector, resourceId: 12 });
    expect(collection.type).toBe('FeatureCollection');
    expect(collection.features).toHaveLength(3);
    expect(collection.features[0]).toMatchObject({ id: 1, properties: { kind: 'road' } });
  });

  it('fetches a list of GeoJSON features', async () => {
    const { connector } = fixture();
    const features = await fetchNgwLayerFeatures({ connector, resourceId: 12 });
    expect(features.map((feature) => feature.id)).toEqual([1, 2, 3]);
  });

  it('passes NGW expression filters to the server', async () => {
    const { connector, get } = fixture([]);
    await fetchNgwLayerItems({
      connector, resourceId: 12, filters: [['kind', 'eq', 'road']],
    });
    const filter = JSON.parse(get.mock.calls[0][0].query.filter);
    expect(filter).toEqual(['all', ['==', ['get', 'kind'], 'road']]);
  });

  it('optionally checks server-returned feature rows on the client', async () => {
    const { connector } = fixture();
    const items = await fetchNgwLayerItems({
      connector, resourceId: 12, filters: [['kind', 'eq', 'road']],
      clientFilterValidate: true,
    });
    expect(items.map((item) => item.id)).toEqual([1, 2]);
  });

  it('gets distinct values without duplicates or undefined fields', async () => {
    const { connector, get } = fixture();
    const result = await selectNgwLayerDistinct({
      connector, resourceId: 12, fields: ['kind', 'rank'],
    });
    expect(result).toEqual({ kind: ['road', 'river'], rank: [2, 3] });
    expect(get).toHaveBeenCalledWith(expect.objectContaining({
      query: expect.objectContaining({ geom: false, fields: ['kind', 'rank'] }),
    }));
  });

  it('rejects a distinct-values query without a fields list', () => {
    const { connector } = fixture();
    expect(() => selectNgwLayerDistinct({
      connector, resourceId: 12,
    } as never)).toThrow(/`fields` is required/);
  });

  it('requests a single feature and exposes deferred GeoJSON serialization', async () => {
    const { connector, route } = fixture(sampleItems[0]);
    const result = await fetchNgwLayerItem({
      connector, resourceId: 12, featureId: 1,
    });
    expect(route).toHaveBeenCalledWith('feature_layer.feature.item', { id: 12, fid: 1 });
    expect(await result.toGeojson()).toMatchObject({
      type: 'Feature', id: 1, properties: { kind: 'road' },
    });
  });

  it('loads missing feature geometry on demand', async () => {
    const { connector, get } = fixture();
    get.mockResolvedValueOnce({ id: 1, fields: { name: 'One' } });
    get.mockResolvedValueOnce({ id: 1, fields: {}, geom: sampleItems[0].geom });
    const result = await fetchNgwLayerItem({ connector, resourceId: 12, featureId: 1 });
    expect(await result.toGeojson()).toMatchObject({
      geometry: sampleItems[0].geom,
      properties: { name: 'One' },
    });
    expect(get).toHaveBeenCalledTimes(2);
    expect(get.mock.calls[1][0].query.geom).toBe(true);
  });

  it('gets a feature count using the count endpoint', async () => {
    const { connector, get, route } = fixture({ total_count: 123 });
    expect(await fetchNgwLayerCount({ connector, resourceId: 12 })).toBe(123);
    expect(route).toHaveBeenCalledWith('feature_layer.feature.count', { id: 12 });
    expect(get).toHaveBeenCalledWith({ cache: true, signal: undefined });
  });
});

describe('Feature popup generation in the browser', () => {
  const feature: Feature = {
    type: 'Feature', properties: { name: 'Road', population: 15 },
    geometry: { type: 'Point', coordinates: [0, 0] },
  };

  it('renders feature properties without an NGW schema', () => {
    const content = createPopupContent(feature);
    expect(content).toBeInstanceOf(HTMLElement);
    const root = content as HTMLElement;
    expect(root.textContent).toContain('Road');
    expect(root.textContent).toContain('population');
  });

  it('shows only visible NGW schema fields', () => {
    const schema = {
      feature_layer: {
        fields: [
          { keyname: 'name', display_name: 'Display name', grid_visibility: true },
          { keyname: 'population', display_name: 'Residents', grid_visibility: false },
        ],
      },
    } as unknown as CompositeRead;
    const content = createPopupContent(feature, schema) as HTMLElement;
    expect(content.textContent).toContain('Display name');
    expect(content.textContent).not.toContain('Residents');
  });
});
