import { afterEach, describe, expect, it, vi } from 'vitest';

import { NgwConnectorExtended } from '../../packages/ngw-connector/src/NgwConnectorExtended';

import type { CompositeRead } from '@nextgisweb/resource/type/api';

let serial = 0;
const instances: NgwConnectorExtended[] = [];

function setup() {
  const connector = NgwConnectorExtended.create({
    baseUrl: `https://offline-${++serial}.invalid`,
    cacheId: `extended-offline-${serial}`,
  });
  instances.push(connector);
  return connector;
}

function resource(id: number): CompositeRead {
  return {
    resource: { id, cls: 'resource_group', display_name: `Resource ${id}` },
  } as unknown as CompositeRead;
}

afterEach(() => {
  for (const connector of instances.splice(0)) {
    vi.restoreAllMocks();
    connector.logout();
  }
});

describe('NgwConnectorExtended public API without network access', () => {
  it('creates the extended connector and its resources control', () => {
    const connector = setup();
    expect(connector).toBeInstanceOf(NgwConnectorExtended);
    expect(connector.resources).toBeDefined();
    expect(connector.resources.cache).toBeDefined();
  });

  it('clears the connector and resource caches together', () => {
    const connector = setup();
    connector.cache.add('connector-item', 'cached query');
    connector.resources.cache.add('resource-item', Promise.resolve(resource(1)));

    connector.clearCache();

    expect(connector.cache.match('connector-item')).toBeUndefined();
    expect(connector.resources.cache.match('resource-item')).toBeUndefined();
  });

  it('builds a resource URL and sends normalized params through apiRequest', async () => {
    const connector = setup();
    vi.spyOn(connector, 'connect').mockResolvedValue({
      'resource.item': ['/api/resource/{0}', 'id'],
    } as never);
    const makeQuery = vi.spyOn(connector, 'makeQuery').mockResolvedValue({ ok: true });

    const response = await connector.apiRequest('resource.item', {
      id: 17,
      unused: undefined,
    } as never, { cache: false });

    expect(response).toEqual({ ok: true });
    expect(makeQuery).toHaveBeenCalledWith(
      '/api/resource/{id}',
      { id: 17 },
      { cacheName: 'resource.item', cache: false },
    );
  });

  it('prefers requestOptions.params over the separate params argument', async () => {
    const connector = setup();
    vi.spyOn(connector, 'connect').mockResolvedValue({
      'resource.item': ['/api/resource/{0}', 'id'],
    } as never);
    const makeQuery = vi.spyOn(connector, 'makeQuery').mockResolvedValue('replacement');

    await connector.apiRequest('resource.item', { id: 1 }, {
      params: { id: 33 },
      cache: false,
    } as never);

    expect(makeQuery).toHaveBeenCalledWith(
      '/api/resource/{id}',
      { id: 33 },
      expect.objectContaining({ cacheName: 'resource.item', cache: false }),
    );
  });

  it('rejects a route call missing a mandatory URL parameter', async () => {
    const connector = setup();
    vi.spyOn(connector, 'connect').mockResolvedValue({
      'resource.item': ['/api/resource/{0}', 'id'],
    } as never);
    const makeQuery = vi.spyOn(connector, 'makeQuery');

    await expect(connector.apiRequest('resource.item', {} as never))
      .rejects.toThrow('`id` URL API argument is not specified');
    expect(makeQuery).not.toHaveBeenCalled();
  });

  for (const [method, verb] of [
    ['get', 'GET'], ['post', 'POST'], ['patch', 'PATCH'],
    ['put', 'PUT'], ['delete', 'DELETE'],
  ] as const) {
    it(`sends ${verb} requests through the same API route`, async () => {
      const connector = setup();
      const api = vi.spyOn(connector, 'apiRequest').mockResolvedValue({ ok: true } as never);
      const options = { cache: false };
      const params = { id: 11 };

      const invoke = Reflect.get(connector, method) as (
        name: string, options: unknown, params: unknown
      ) => Promise<unknown>;
      const result = await invoke.call(connector, 'resource.item', options, params);

      expect(result).toEqual({ ok: true });
      expect(api).toHaveBeenCalledWith('resource.item', params, {
        cache: false, method: verb,
      });
    });
  }

  it('accepts missing options for GET and DELETE shortcuts', async () => {
    const connector = setup();
    const api = vi.spyOn(connector, 'apiRequest').mockResolvedValue(undefined as never);

    await connector.get('resource.item', null, { id: 1 });
    await connector.delete('resource.item', null, { id: 2 });

    expect(api).toHaveBeenNthCalledWith(1, 'resource.item', { id: 1 }, { method: 'GET' });
    expect(api).toHaveBeenNthCalledWith(2, 'resource.item', { id: 2 }, { method: 'DELETE' });
  });

  it('delegates resource lookup and its legacy aliases to ResourcesControl', async () => {
    const connector = setup();
    const expected = resource(9);
    const getOne = vi.spyOn(connector.resources, 'getOne').mockResolvedValue(expected);

    expect(await connector.getResource(9)).toBe(expected);
    expect(await connector.getResourceById(9)).toBe(expected);
    expect(await connector.getResourceByKeyname('roads')).toBe(expected);
    expect(await connector.getResourceBy({ id: 9 })).toBe(expected);
    expect(getOne).toHaveBeenNthCalledWith(1, 9, undefined);
    expect(getOne).toHaveBeenNthCalledWith(2, 9);
    expect(getOne).toHaveBeenNthCalledWith(3, 'roads');
    expect(getOne).toHaveBeenNthCalledWith(4, { id: 9 });
  });

  it('delegates getResourceOrFail and propagates its failure', async () => {
    const connector = setup();
    const err = new Error('No such resource');
    const getOneOrFail = vi.spyOn(connector.resources, 'getOneOrFail').mockRejectedValue(err);

    await expect(connector.getResourceOrFail(7)).rejects.toBe(err);
    expect(getOneOrFail).toHaveBeenCalledWith(7, undefined);
  });

  it('delegates resource ID lookup and mandatory lookup', async () => {
    const connector = setup();
    const getId = vi.spyOn(connector.resources, 'getId').mockResolvedValue(14);
    const getIdOrFail = vi.spyOn(connector.resources, 'getIdOrFail').mockResolvedValue(14);

    expect(await connector.getResourceId('roads')).toBe(14);
    expect(await connector.getResourceIdOrFail('roads')).toBe(14);
    expect(getId).toHaveBeenCalledWith('roads', undefined);
    expect(getIdOrFail).toHaveBeenCalledWith('roads', undefined);
  });

  it('delegates resource searches and parent traversal', async () => {
    const connector = setup();
    const found = [resource(21)];
    const many = vi.spyOn(connector.resources, 'getMany').mockResolvedValue(found);
    const parent = vi.spyOn(connector.resources, 'getParent').mockResolvedValue(resource(20));

    expect(await connector.getResourcesBy({ display_name: 'Roads' })).toBe(found);
    expect(await connector.getResourceParent(21)).toEqual(resource(20));
    expect(many).toHaveBeenCalledWith({ display_name: 'Roads' }, undefined);
    expect(parent).toHaveBeenCalledWith(21, undefined);
  });

  it('passes options through when requesting children', async () => {
    const connector = setup();
    const children = [resource(2), resource(3)];
    const getChildrenOf = vi.spyOn(connector.resources, 'getChildrenOf')
      .mockResolvedValue(children);
    const options = { recursive: true };

    expect(await connector.getResourceChildren(1, options)).toBe(children);
    expect(getChildrenOf).toHaveBeenCalledWith(1, options);
  });

  it('delegates updates and deletions to the resource controller', async () => {
    const connector = setup();
    const updated = resource(10);
    const update = vi.spyOn(connector.resources, 'update').mockResolvedValue(updated);
    const remove = vi.spyOn(connector.resources, 'delete').mockResolvedValue(undefined);
    const data = { resource: { display_name: 'Renamed' } };

    expect(await connector.updateResource(10, data)).toBe(updated);
    await expect(connector.deleteResource(10)).resolves.toBeUndefined();
    expect(update).toHaveBeenCalledWith(10, data);
    expect(remove).toHaveBeenCalledWith(10);
  });
});
