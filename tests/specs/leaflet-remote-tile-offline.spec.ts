import { afterEach, describe, expect, it, vi } from 'vitest';

import { makeRemote } from '../../packages/leaflet-map-adapter/src/utils/makeRemoteTileLayer';

type RemoteOptions = {
  setViewDelay?: number;
  crossOrigin?: string | boolean;
  withCredentials?: boolean;
  headers?: Record<string, string>;
  request?: {
    headers?: Record<string, string>;
    credentials?: RequestCredentials;
  };
};
type TileWithAbort = HTMLImageElement & { abort?: () => void };
type TileEntry = { coords: { z: number }; el: TileWithAbort };

class StubTileLayer {
  options: RemoteOptions;
  _tileZoom = 4;
  _tiles: Record<string, TileEntry> = {};

  constructor(options: RemoteOptions = {}) {
    this.options = options;
  }

  getTileUrl(coords: Record<string, unknown>): string {
    return `https://example.invalid/tiles/${String(coords.z)}`;
  }

  _update(): void {
    // The native GridLayer update is intentionally not invoked in isolation.
  }
}

const Remote = makeRemote(StubTileLayer);
type RemoteMethods = {
  createTile(
    coords: Record<string, unknown>,
    done: (error: unknown, tile: HTMLImageElement) => void,
  ): HTMLImageElement;
  _abortLoading(): void;
};
function methods(layer: StubTileLayer): RemoteMethods {
  return layer as unknown as RemoteMethods;
}

function response(): Response {
  return new Response(new Blob(['tile pixels'], { type: 'image/png' }), {
    status: 200,
  });
}

describe('Leaflet remote GridLayer tile loading and cancellation (offline)', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('loads a tile through fetch and notifies the grid after receiving the object URL', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(response());
    vi.stubGlobal('fetch', fetchMock);
    vi.spyOn(URL, 'createObjectURL').mockReturnValue(
      'blob:offline-remote-tile',
    );
    const layer = new Remote();
    const done = vi.fn<(error: unknown, tile: HTMLImageElement) => void>();
    const tile = methods(layer).createTile({ z: 4 }, done);
    expect(tile.alt).toBe('');
    expect(tile.getAttribute('role')).toBe('presentation');
    await vi.waitFor(() => expect(done).toHaveBeenCalledWith(null, tile));
    expect(tile.getAttribute('src')).toBe('blob:offline-remote-tile');
    expect(fetchMock).toHaveBeenCalledWith(
      'https://example.invalid/tiles/4',
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it('combines tile request headers with explicit credential and cross-origin options', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(response());
    vi.stubGlobal('fetch', fetchMock);
    vi.spyOn(URL, 'createObjectURL').mockReturnValue(
      'blob:offline-remote-tile',
    );
    const layer = new Remote({
      crossOrigin: 'anonymous',
      withCredentials: true,
      headers: { 'X-Test': 'tile' },
      request: {
        credentials: 'omit',
        headers: { Authorization: 'Bearer offline' },
      },
    });
    const done = vi.fn();
    const tile = methods(layer).createTile({ z: 4 }, done);
    expect(tile.crossOrigin).toBe('anonymous');
    await vi.waitFor(() => expect(done).toHaveBeenCalledOnce());
    expect(fetchMock).toHaveBeenCalledWith(
      'https://example.invalid/tiles/4',
      expect.objectContaining({
        credentials: 'omit',
        headers: { 'X-Test': 'tile', Authorization: 'Bearer offline' },
      }),
    );
  });

  it('exposes an abort callback that cancels the active tile fetch', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockImplementation(
      (_input, init) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener(
            'abort',
            () => {
              reject(new DOMException('Canceled', 'AbortError'));
            },
            { once: true },
          );
        }),
    );
    vi.stubGlobal('fetch', fetchMock);
    const layer = new Remote();
    const done = vi.fn();
    const tile = methods(layer).createTile({ z: 4 }, done) as TileWithAbort;
    expect(tile.abort).toBeTypeOf('function');
    tile.abort?.();
    await vi.waitFor(() => expect(done).toHaveBeenCalledWith(null, tile));
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it('removes obsolete incomplete tiles and aborts their requests', () => {
    const layer = new Remote();
    const abort = vi.fn();
    const obsolete = Object.assign(document.createElement('img'), { abort });
    Object.defineProperty(obsolete, 'complete', { value: false });
    document.body.appendChild(obsolete);
    const current = document.createElement('img');
    layer._tiles = {
      old: { coords: { z: 2 }, el: obsolete },
      current: { coords: { z: 4 }, el: current },
    };
    methods(layer)._abortLoading();
    expect(abort).toHaveBeenCalledOnce();
    expect(layer._tiles).not.toHaveProperty('old');
    expect(layer._tiles.current.el).toBe(current);
    expect(obsolete.isConnected).toBe(false);
  });

  it('retains already completed tiles even after their zoom becomes obsolete', () => {
    const layer = new Remote();
    const abort = vi.fn();
    const completed = Object.assign(document.createElement('img'), { abort });
    Object.defineProperty(completed, 'complete', { value: true });
    layer._tiles = { completed: { coords: { z: 2 }, el: completed } };
    methods(layer)._abortLoading();
    expect(layer._tiles).toHaveProperty('completed');
    expect(abort).not.toHaveBeenCalled();
  });

  it('installs the debounced native GridLayer updater when requested', () => {
    const defaultLayer = new Remote();
    const debouncedLayer = new Remote({ setViewDelay: 20 });
    expect(defaultLayer._update).toBe(StubTileLayer.prototype._update);
    expect(debouncedLayer._update).not.toBe(StubTileLayer.prototype._update);
    expect(debouncedLayer._update).toBeTypeOf('function');
  });
});
