import { afterEach, describe, expect, it, vi } from 'vitest';

import { callAjax } from '../../packages/leaflet-map-adapter/src/utils/callAjax';

const imageUrl = 'https://example.invalid/image';

function stubFetch(response: Response) {
  const request = vi.fn<typeof fetch>().mockResolvedValue(response);
  vi.stubGlobal('fetch', request);
  return request;
}

describe('Leaflet image request transport without any external HTTP calls', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('creates an object URL only after a successful image response', async () => {
    const body = new Blob(['image'], { type: 'image/png' });
    const request = stubFetch(new Response(body, { status: 200 }));
    const createObjectURL = vi.spyOn(URL, 'createObjectURL')
      .mockReturnValue('blob:offline-image');

    const [loaded] = callAjax({ src: imageUrl });

    await expect(loaded).resolves.toBe('blob:offline-image');
    expect(createObjectURL).toHaveBeenCalledOnce();
    expect(createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
    expect(request).toHaveBeenCalledWith(imageUrl, expect.objectContaining({
      signal: expect.any(AbortSignal),
    }));
  });

  it('combines compatibility headers with explicit request headers', async () => {
    const request = stubFetch(new Response(new Blob(['ok']), { status: 200 }));
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:offline-image');

    const [loaded] = callAjax({
      src: imageUrl,
      headers: { Authorization: 'Basic legacy', 'X-Legacy': 'yes' },
      withCredentials: true,
      request: {
        headers: { Authorization: 'Bearer current' },
        credentials: 'omit',
        cache: 'no-store',
      },
    });
    await loaded;

    expect(request).toHaveBeenCalledWith(imageUrl, expect.objectContaining({
      headers: { Authorization: 'Bearer current', 'X-Legacy': 'yes' },
      credentials: 'omit',
      cache: 'no-store',
    }));
  });

  it('reports HTTP failures and does not create an object URL', async () => {
    stubFetch(new Response('Missing', { status: 404, statusText: 'Not Found' }));
    const createObjectURL = vi.spyOn(URL, 'createObjectURL');
    const [loaded] = callAjax({ src: imageUrl });

    await expect(loaded).rejects.toThrow('Not Found');
    expect(createObjectURL).not.toHaveBeenCalled();
  });

  it('propagates network failures rather than treating them as cancelled loads', async () => {
    const request = vi.fn<typeof fetch>()
      .mockRejectedValue(new TypeError('Offline transport failure'));
    vi.stubGlobal('fetch', request);
    const [loaded] = callAjax({ src: imageUrl });

    await expect(loaded).rejects.toThrow('Offline transport failure');
    expect(request).toHaveBeenCalledOnce();
  });

  it('aborts the active fetch and resolves cancellation to an empty URL', async () => {
    const request = vi.fn<typeof fetch>().mockImplementation((_input, init) =>
      new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => {
          reject(new DOMException('Cancelled', 'AbortError'));
        }, { once: true });
      }),
    );
    vi.stubGlobal('fetch', request);

    const [loaded, cancel] = callAjax({ src: imageUrl });
    cancel();

    await expect(loaded).resolves.toBe('');
    expect(request).toHaveBeenCalledOnce();
  });
});
