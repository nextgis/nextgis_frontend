import { afterEach, describe, expect, it, vi } from 'vitest';

import { NgwError } from '../../packages/ngw-connector/src/errors/NgwError';
import { ServerResponseError } from '../../packages/ngw-connector/src/route/error';
import { request } from '../../packages/ngw-connector/src/route/request';
import { loadData } from '../../packages/ngw-connector/src/utils/loadData';

type LegacyResult =
  | { success: true; value: unknown }
  | { success: false; error: unknown };

function legacyResponse(
  status: number,
  responseText = '',
  responseType?: 'blob',
): Promise<{ result: LegacyResult; successes: number; failures: number }> {
  // Keep a mutable record: an erroneous second callback must be observable.
  const outcome = {
    result: undefined as unknown as LegacyResult,
    successes: 0,
    failures: 0,
  };
  const xhr = {
    status,
    statusText: status === 204 ? 'No Content' : 'Response status',
    responseText,
    response: new Blob([responseText]),
    upload: {},
    onload: undefined as (() => void) | undefined,
    open() {},
    setRequestHeader() {},
    abort() {},
    send() {
      queueMicrotask(() => xhr.onload?.());
    },
  };
  vi.spyOn(globalThis, 'XMLHttpRequest').mockImplementation(function () {
    return xhr as unknown as XMLHttpRequest;
  });

  return new Promise((resolve) => {
    loadData(
      '/api/test',
      (value: unknown) => {
        outcome.successes++;
        outcome.result ||= { success: true, value };
        resolve(outcome);
      },
      { responseType },
      (error: unknown) => {
        outcome.failures++;
        outcome.result ||= { success: false, error };
        resolve(outcome);
      },
      () => undefined,
    );
  });
}

describe('NGW HTTP responses', () => {
  afterEach(() => vi.restoreAllMocks());

  describe('legacy XMLHttpRequest transport', () => {
    it('accepts a successful empty 204 response', async () => {
      const { result, successes, failures } = await legacyResponse(204);
      expect(result).to.deep.equal({ success: true, value: undefined });
      expect(successes).to.equal(1);
      expect(failures).to.equal(0);
    });

    it('accepts a 204 response in blob mode', async () => {
      const { result } = await legacyResponse(204, '', 'blob');
      expect(result).to.deep.equal({ success: true, value: undefined });
    });

    it('returns JSON for a successful response', async () => {
      const { result } = await legacyResponse(200, '{"id":1}');
      expect(result).to.deep.equal({ success: true, value: { id: 1 } });
    });

    it('rejects every HTTP error status exactly once', async () => {
      for (const status of [400, 404, 429, 502]) {
        const { result, successes, failures } = await legacyResponse(
          status,
          '{"title":"NGW error","message":"Request failed"}',
        );
        expect(result.success).to.equal(false);
        if (!result.success) {
          expect(result.error).to.be.instanceOf(NgwError);
          expect((result.error as NgwError).status_code).to.equal(status);
          expect((result.error as Error).message).to.equal('Request failed');
        }
        expect(successes).to.equal(0);
        expect(failures).to.equal(1);
        vi.restoreAllMocks();
      }
    });

    it('reports blob HTTP errors without reading responseText', async () => {
      const { result, successes, failures } = await legacyResponse(
        503,
        '',
        'blob',
      );
      expect(result.success).to.equal(false);
      if (!result.success) {
        expect((result.error as NgwError).status_code).to.equal(503);
      }
      expect(successes).to.equal(0);
      expect(failures).to.equal(1);
    });
  });

  describe('typed route transport', () => {
    it('accepts empty 204 and 205 responses', async () => {
      for (const status of [204, 205]) {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
          new Response(null, { status }),
        );
        expect(await request('/api/test', { method: 'DELETE' })).to.equal(
          undefined,
        );
        vi.restoreAllMocks();
      }
    });

    it('preserves a structured JSON error', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response('{"message":"Access denied","title":"Forbidden"}', {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        }),
      );
      const error = await request('/api/test').then(
        () => undefined,
        (err: unknown) => err,
      );
      expect(error).to.be.instanceOf(ServerResponseError);
      expect((error as Error).message).to.equal('Access denied');
      expect((error as ServerResponseError).title).to.equal('Forbidden');
    });

    it('reports text/plain and empty HTTP error bodies', async () => {
      for (const [status, body] of [
        [429, 'Rate limited'],
        [503, ''],
      ] as const) {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
          new Response(body, {
            status,
            statusText: 'Service unavailable',
            headers: { 'Content-Type': 'text/plain' },
          }),
        );
        const error = await request('/api/test').then(
          () => undefined,
          (err: unknown) => err,
        );
        expect(error).to.be.instanceOf(ServerResponseError);
        expect((error as Error).message).to.equal(
          body || 'Service unavailable',
        );
        vi.restoreAllMocks();
      }
    });

    it('continues parsing successful JSON responses', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response('{"id":42}', {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );
      expect(await request('/api/test')).to.deep.equal({ id: 42 });
    });
  });
});
