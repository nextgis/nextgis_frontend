import { afterEach, describe, expect, it, vi } from 'vitest';

import { request } from '../../packages/ngw-connector/src/route/request';
import { NetworksResponseError } from '../../packages/ngw-connector/src/route/error';

const initial = '/api/resource/1';
const summary = '/api/lunkwill/job-42/summary';
const result = '/api/lunkwill/job-42/response';

const mediaType = 'application/vnd.lunkwill.request-summary+json';

const opts = {
  method: 'POST',
  headers: { Authorization: 'Basic dGVzdA==' },
  lunkwill: {
    toHeaders: (_headers: Record<string, string>) => undefined,
  },
};

function json(data: unknown, type = 'application/json'): Response {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'content-type': type },
  });
}

describe('Lunkwill requests', () => {
  afterEach(() => vi.restoreAllMocks());

  it('uses fixed Lunkwill paths and retains authorization', async () => {
    const calls: Array<{ url: string; auth?: string }> = [];

    vi.spyOn(globalThis, 'fetch').mockImplementation(async (url, init) => {
      const address = String(url);

      calls.push({
        url: address,
        auth: (init?.headers as Record<string, string> | undefined)
          ?.Authorization,
      });

      if (address === initial) {
        return json({ id: 'job-42', delay_ms: 0 }, mediaType);
      }
      if (address === summary) {
        return json({ status: 'ready' });
      }
      if (address === result) {
        return json({ complete: true });
      }

      throw new Error(`Unexpected URL: ${address}`);
    });

    const data = await request<{ complete: boolean }>(initial, opts as any);

    expect(data).to.deep.equal({ complete: true });
    expect(calls.map((x) => x.url)).to.deep.equal([initial, summary, result]);
    expect(calls.every((x) => x.auth === opts.headers.Authorization)).to.equal(
      true,
    );
  });

  it('aborts during the polling delay', async () => {
    const controller = new AbortController();

    const fetchStub = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(json({ id: 'job-42', delay_ms: 60000 }, mediaType));

    const promise = request(initial, {
      ...opts,
      signal: controller.signal,
    } as any);

    await Promise.resolve();
    controller.abort();

    await expect(promise).rejects.toMatchObject({ name: 'AbortError' });
    expect(fetchStub).toHaveBeenCalledOnce();
  });

  it('stops after five consecutive polling failures', async () => {
    const fetchStub = vi
      .spyOn(globalThis, 'fetch')
      .mockImplementation(async (url) => {
        if (String(url) === initial) {
          return json({ id: 'job-42', delay_ms: 0, retry_ms: 0 }, mediaType);
        }

        return new Response('error', { status: 503 });
      });

    await expect(request(initial, opts as any)).rejects.toBeInstanceOf(
      NetworksResponseError,
    );
    expect(fetchStub).toHaveBeenCalledTimes(6);
  });
});
