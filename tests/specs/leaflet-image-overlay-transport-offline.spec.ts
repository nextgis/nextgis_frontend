import { Util } from 'leaflet';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ImageOverlay } from '../../packages/leaflet-map-adapter/src/layer-adapters/ImageAdapter/ImageOverlay';
import imageQueue from '../../packages/leaflet-map-adapter/src/layer-adapters/ImageAdapter/imageQueue';

type QueueTask = Parameters<typeof imageQueue.add>[0];
type RunningTask = [Promise<unknown>, () => void];

function image(overlay: ImageOverlay): HTMLImageElement {
  return (overlay as unknown as { _image: HTMLImageElement })._image;
}

function captureQueueTask() {
  let task: QueueTask | undefined;
  const added = vi.spyOn(imageQueue, 'add').mockImplementation((callback) => {
    task = callback;
  });
  return {
    added,
    run(signal = new AbortController().signal): RunningTask {
      const callback = task;
      if (!callback) throw new Error('ImageOverlay did not register a load');
      const result = callback({ signal });
      if (!Array.isArray(result)) {
        throw new Error('ImageOverlay must provide an abortable request');
      }
      return result as RunningTask;
    },
  };
}

function overlay() {
  return new ImageOverlay(
    'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEAAAAALAAAAAABAAEAAAIBAAA=',
    [
      [10, 20],
      [12, 22],
    ],
    {
      withCredentials: true,
      headers: { 'X-Legacy': 'yes' },
      request: {
        headers: { Authorization: 'Bearer offline' },
        cache: 'no-store',
      },
    },
  );
}

describe('Leaflet ImageOverlay abortable image queue and URL fallback (offline)', () => {
  afterEach(() => {
    imageQueue.abort();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('queues an image request instead of directly loading its remote URL', () => {
    const { added } = captureQueueTask();
    const layer = overlay();
    layer._initImage();
    expect(added).toHaveBeenCalledOnce();
    expect(added).toHaveBeenCalledWith(expect.any(Function), {
      id: Util.stamp(layer),
    });
    expect(image(layer).getAttribute('src')).toBe('');
  });

  it('loads a Blob URL and forwards layer request options to fetch', async () => {
    const { run } = captureQueueTask();
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(
        new Response(new Blob(['offline image']), { status: 200 }),
      );
    vi.stubGlobal('fetch', fetchMock);
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:offline-overlay');
    const layer = overlay();
    layer._initImage();
    const [request] = run();
    await request;
    await vi.waitFor(() =>
      expect(image(layer).getAttribute('src')).toBe('blob:offline-overlay'),
    );
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('data:image/gif;base64,'),
      expect.objectContaining({
        headers: { 'X-Legacy': 'yes', Authorization: 'Bearer offline' },
        cache: 'no-store',
      }),
    );
  });

  it('uses the transparent fallback after a transport error', async () => {
    const { run } = captureQueueTask();
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockRejectedValue(new TypeError('Offline image failure'));
    vi.stubGlobal('fetch', fetchMock);
    const report = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    const layer = overlay();
    layer._initImage();
    const [request] = run();
    await expect(request).rejects.toThrow('Offline image failure');
    await vi.waitFor(() =>
      expect(image(layer).src).toContain('data:image/gif;base64,'),
    );
    expect(report).toHaveBeenCalledWith(expect.any(TypeError));
  });

  it('does not overwrite the image when its queued signal has already been cancelled', async () => {
    const { run } = captureQueueTask();
    vi.stubGlobal(
      'fetch',
      vi
        .fn<typeof fetch>()
        .mockResolvedValue(new Response(new Blob(['late']), { status: 200 })),
    );
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:late-result');
    const controller = new AbortController();
    const layer = overlay();
    layer._initImage();
    const before = image(layer).getAttribute('src');
    const [request] = run(controller.signal);
    controller.abort();
    await request;
    expect(image(layer).getAttribute('src')).toBe(before);
  });

  it('removes a queued request by ID when it is cancelled before starting', () => {
    const { added } = captureQueueTask();
    const remove = vi.spyOn(imageQueue, 'remove');
    const layer = overlay();
    layer._initImage();
    expect(added).toHaveBeenCalledOnce();
    layer.cancelLoad();
    expect(remove).toHaveBeenCalledWith(Util.stamp(layer));
  });

  it('aborts an active fetch when cancelLoad is invoked', async () => {
    const { run } = captureQueueTask();
    const remove = vi.spyOn(imageQueue, 'remove');
    let activeSignal: AbortSignal | undefined;
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockImplementation((_src, init) => {
        activeSignal = init?.signal ?? undefined;
        return new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener(
            'abort',
            () => {
              reject(new DOMException('Aborted', 'AbortError'));
            },
            { once: true },
          );
        });
      }),
    );
    const layer = overlay();
    layer._initImage();
    const [request] = run();
    layer.cancelLoad();
    await expect(request).resolves.toBe('');
    expect(activeSignal?.aborted).toBe(true);
    expect(remove).toHaveBeenCalledWith(Util.stamp(layer));
  });
});
