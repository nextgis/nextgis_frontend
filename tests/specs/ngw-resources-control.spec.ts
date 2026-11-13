import { describe, expect, it, vi } from 'vitest';

import { ResourcesControl } from '../../packages/ngw-connector/src/ResourcesControl';
import { ResourceNotFoundError } from '../../packages/ngw-connector/src/errors/ResourceNotFoundError';

import type { NgwConnectorExtended } from '../../packages/ngw-connector/src/NgwConnectorExtended';
import type { CompositeRead } from '@nextgisweb/resource/type/api';

function resource(id: number, extra: Record<string, unknown> = {}): CompositeRead {
  return {
    resource: { id, cls: 'resource_group', display_name: `Resource ${id}`, ...extra },
  } as unknown as CompositeRead;
}

let cacheId = 0;
function setup() {
  const item = vi.fn().mockResolvedValue(undefined);
  const search = vi.fn().mockResolvedValue([]);
  const collection = vi.fn().mockResolvedValue([]);
  const put = vi.fn().mockResolvedValue(resource(10));
  const del = vi.fn().mockResolvedValue(undefined);
  const route = vi.fn((name: string, _params?: { id: number }) => {
    if (name === 'resource.item') return { get: item };
    if (name === 'resource.search') return { get: search };
    if (name === 'resource.collection') return { get: collection };
    throw new Error(`Unexpected route: ${name}`);
  });
  const connector = { route, put, delete: del } as unknown as NgwConnectorExtended;
  const resources = new ResourcesControl({ connector, cacheId: `offline-resource-${cacheId++}` });
  return { resources, route, item, search, collection, put, del };
}

describe('ResourcesControl without a live NGW server', () => {
  it('loads a resource directly by numeric ID', async () => {
    const { resources, route, item } = setup();
    const expected = resource(42);
    item.mockResolvedValue(expected);

    await expect(resources.getOne(42, { cache: false })).resolves.toBe(expected);
    expect(route).toHaveBeenCalledWith('resource.item', { id: 42 });
    expect(item).toHaveBeenCalledWith({ cache: false });
  });

  it('looks up a keyname using the full resource search API', async () => {
    const { resources, route, search } = setup();
    const expected = resource(7, { keyname: 'roads' });
    search.mockResolvedValue([expected]);

    expect(await resources.getOne('roads')).toBe(expected);
    expect(route).toHaveBeenCalledWith('resource.search');
    expect(search).toHaveBeenCalledWith({
      query: { serialization: 'full', keyname: 'roads' },
    });
  });

  it('flattens a resource search query and omits the description', async () => {
    const { resources, search } = setup();
    const query = {
      display_name: 'Roads',
      parent: { id: 10 },
      owner_user: { id: 11 },
      description: 'Do not search descriptions',
    } as Parameters<ResourcesControl['getMany']>[0];

    await resources.getMany(query);

    expect(search).toHaveBeenCalledWith({
      query: {
        serialization: 'full',
        display_name: 'Roads',
        parent_id: 10,
        owner_user__id: 11,
      },
    });
  });

  it('accepts the paginated resource-search response', async () => {
    const { resources, search } = setup();
    const expected = resource(15);
    search.mockResolvedValue({ items: [expected], total_count: 1 });

    await expect(resources.getMany({ display_name: 'Resource 15' }))
      .resolves.toEqual([expected]);
  });

  it('returns undefined for missing resources and rejects getOneOrFail', async () => {
    const { resources } = setup();

    expect(await resources.getOne('missing')).toBeUndefined();
    await expect(resources.getOneOrFail('missing'))
      .rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('resolves IDs without fetching numeric identifiers', async () => {
    const { resources, route, search } = setup();
    search.mockResolvedValue([resource(19, { keyname: 'sample' })]);

    expect(await resources.getId(9)).toBe(9);
    expect(route).not.toHaveBeenCalled();
    expect(await resources.getId('sample')).toBe(19);
    search.mockResolvedValue([]);
    expect(await resources.getId('unknown')).toBeUndefined();
  });

  it('rejects getIdOrFail when the search returns nothing', async () => {
    const { resources } = setup();

    await expect(resources.getIdOrFail('not-found')).rejects.toThrow();
  });

  it('loads the parent resource by the ID in a child resource', async () => {
    const { resources, route } = setup();
    const child = resource(2, { parent: { id: 1 } });
    const parent = resource(1);
    route.mockImplementation((_name, params) => ({
      get: vi.fn().mockResolvedValue(params?.id === 1 ? parent : child),
    }));

    await expect(resources.getParent(2)).resolves.toBe(parent);
    expect(route).toHaveBeenCalledWith('resource.item', { id: 1 });
  });

  it('returns undefined for a resource without a parent', async () => {
    const { resources, item } = setup();
    item.mockResolvedValue(resource(1));

    await expect(resources.getParent(1)).resolves.toBeUndefined();
  });

  it('collects descendants recursively when requested', async () => {
    const { resources, collection } = setup();
    const child = resource(11, { children: true });
    const grandchild = resource(12);
    collection.mockImplementation(async ({ query }: { query: { parent: number } }) => {
      return query.parent === 10 ? [child] : query.parent === 11 ? [grandchild] : [];
    });

    expect(await resources.getChildrenOf(10, { recursive: true })).toEqual([
      child, grandchild,
    ]);
    expect(collection).toHaveBeenCalledTimes(2);
  });

  it('does not descend into child groups when recursive is false', async () => {
    const { resources, collection } = setup();
    const child = resource(11, { children: true });
    collection.mockResolvedValue([child]);

    expect(await resources.getChildrenOf(10)).toEqual([child]);
    expect(collection).toHaveBeenCalledTimes(1);
  });

  it('updates a resource using its resolved ID', async () => {
    const { resources, put } = setup();
    const data = { resource: { display_name: 'Renamed' } };

    await resources.update(10, data);

    expect(put).toHaveBeenCalledWith('resource.item', { data }, { id: 10 });
  });

  it('deletes a resource and does not send requests for missing resources', async () => {
    const { resources, del, put } = setup();

    await resources.delete(10);
    expect(del).toHaveBeenCalledWith('resource.item', null, { id: 10 });

    await resources.update('missing', { resource: { display_name: 'Ignored' } });
    await resources.delete('missing');
    expect(put).not.toHaveBeenCalled();
    expect(del).toHaveBeenCalledOnce();
  });
});
