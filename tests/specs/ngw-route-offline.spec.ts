import { afterEach, describe, expect, it, vi } from 'vitest';

import { NgwConnector } from '../../packages/ngw-connector/src/NgwConnector';
import { AbortError } from '../../packages/ngw-connector/src/errors/AbortError';
import { route } from '../../packages/ngw-connector/src/route/route';
import { apiRequest } from '../../packages/ngw-connector/src/utils/apiRequest';
import { template } from '../../packages/ngw-connector/src/utils/template';
import { resourceToQuery } from '../../packages/ngw-connector/src/utils/resourceToQuery';

function mockConnector() {
  const routes = {
    'resource.item': ['/api/resource/{0}', 'id'],
    'resource.collection': ['/api/resource/'],
    'feature_layer.feature.item': ['/api/resource/{0}/feature/{1}', 'id', 'fid'],
  };
  const connect = vi.fn().mockResolvedValue(routes);
  const makeQuery = vi.fn().mockResolvedValue({ ok: true });
  const getAuthorizationHeaders = vi.fn().mockReturnValue({ Authorization: 'Basic test' });
  const connector = {
    options: { baseUrl: 'https://example.invalid' },
    connect,
    makeQuery,
    getAuthorizationHeaders,
  } as unknown as NgwConnector;
  return { connector, connect, makeQuery, getAuthorizationHeaders };
}

describe('NGW route construction (offline)', () => {
  afterEach(() => vi.restoreAllMocks());

  it('resolves an object path parameter and encodes query parameters', async () => {
    const { connector } = mockConnector();
    const item = route('resource.item', connector, { id: 42 });

    expect(await item.url()).toBe('https://example.invalid/api/resource/42');
    expect(await item.url({ query: { fields: 'name' } } as any))
      .toBe('https://example.invalid/api/resource/42?fields=name');
  });

  it('resolves multiple placeholders in a feature URL', async () => {
    const { connector } = mockConnector();

    expect(await route('feature_layer.feature.item', connector, {
      id: 10, fid: 7,
    }).url()).toBe('https://example.invalid/api/resource/10/feature/7');
  });

  it('throws a useful error for a missing URL parameter', async () => {
    const { connector } = mockConnector();

    await expect(route('resource.item', connector, {} as { id: number }).url())
      .rejects.toThrow('Undefined parameter 0');
  });

  it('returns a typed GET response and forwards authorization headers', async () => {
    const { connector, getAuthorizationHeaders } = mockConnector();
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ resource: { id: 42 } }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    );

    const result = await route('resource.item', connector, { id: 42 }).get();

    expect(result).toEqual({ resource: { id: 42 } });
    expect(getAuthorizationHeaders).toHaveBeenCalled();
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://example.invalid/api/resource/42',
      expect.objectContaining({
        method: 'GET',
        headers: { Authorization: 'Basic test' },
      }),
    );
  });

  it('refuses an already-aborted request before connecting', () => {
    const { connector, connect } = mockConnector();
    const abort = new AbortController();
    abort.abort();

    expect(() => route('resource.item', connector, { id: 42 }).get({
      signal: abort.signal,
    })).toThrow(AbortError);
    expect(connect).not.toHaveBeenCalled();
  });
});

describe('Legacy NGW API route and query generation', () => {
  it('expands API placeholders and passes non-path parameters as query', async () => {
    const { connector, makeQuery } = mockConnector();

    await apiRequest({
      name: 'feature_layer.feature.item',
      connector,
      params: { id: 10, fid: 7, srs: 4326 },
      requestOptions: { method: 'GET' },
    });

    expect(makeQuery).toHaveBeenCalledWith(
      '/api/resource/{id}/feature/{fid}?srs=4326',
      { id: 10, fid: 7, srs: 4326 },
      { cacheName: 'feature_layer.feature.item', method: 'GET' },
    );
  });

  it('rejects missing required legacy route parameters', async () => {
    const { connector, makeQuery } = mockConnector();

    await expect(apiRequest({
      name: 'resource.item', connector, params: {}, requestOptions: {},
    })).rejects.toThrow('`id` URL API argument is not specified');
    expect(makeQuery).not.toHaveBeenCalled();
  });

  it('returns undefined when the server has no such legacy API route', async () => {
    const { connector, connect } = mockConnector();
    connect.mockResolvedValue({});

    await expect(apiRequest({
      name: 'resource.item', connector, params: { id: 1 }, requestOptions: {},
    })).resolves.toBeUndefined();
  });

  it('substitutes a function value and reports an unknown template variable', () => {
    expect(template('id={id}', { id: () => 42 })).toBe('id=42');
    expect(() => template('id={missing}', {})).toThrow('No value provided');
  });

  it('flattens resource owners and parents without leaking description into searches', () => {
    expect(resourceToQuery({
      keyname: 'road',
      description: 'ignored',
      owner_user: { id: 5 },
      parent: { id: 8 },
    } as Parameters<typeof resourceToQuery>[0])).toEqual({
      keyname: 'road',
      owner_user__id: 5,
      parent_id: 8,
    });
  });
});
