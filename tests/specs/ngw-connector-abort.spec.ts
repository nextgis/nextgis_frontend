import { expect } from 'chai';
import sinon from 'sinon';

import { NgwConnector } from '../../packages/ngw-connector/src/NgwConnector';
import { removeConnector } from '../../packages/ngw-connector/src/activeConnectors';
import { AbortError } from '../../packages/ngw-connector/src/errors/AbortError';

import type { RequestOptions } from '../../packages/ngw-connector/src/interfaces';

type PendingRequest = {
  signal: AbortSignal;
  resolve: (data: unknown) => void;
  reject: (reason: Error) => void;
};

class PendingConnector extends NgwConnector {
  readonly pending: PendingRequest[] = [];

  protected override _loadData<R = unknown>(
    _url: string,
    options: RequestOptions,
  ): Promise<R> {
    const signal = options.signal;
    if (!signal) throw new Error('Expected a request abort signal');

    return new Promise<R>((resolve, reject) => {
      if (signal.aborted) {
        reject(new AbortError());
        return;
      }
      signal.addEventListener('abort', () => reject(new AbortError()), {
        once: true,
      });
      this.pending.push({
        signal,
        resolve: (data) => resolve(data as R),
        reject,
      });
    });
  }
}

let sequence = 0;

describe('NgwConnector request cancellation', () => {
  let connector: PendingConnector;

  beforeEach(() => {
    const id = ++sequence;
    connector = new PendingConnector({
      baseUrl: `https://abort-lifecycle-${id}.invalid`,
      cacheId: `abort-lifecycle-${id}`,
    });
  });

  afterEach(() => {
    connector.abort();
    connector.clearCache();
    removeConnector(connector);
  });

  it('tracks requests until their promises settle', async () => {
    const request = connector.makeQuery('/slow', null, { cache: false });
    expect(Object.keys(connector.getActiveApiRequests())).to.have.length(1);

    connector.pending[0].resolve('ok');
    expect(await request).to.equal('ok');
    expect(Object.keys(connector.getActiveApiRequests())).to.have.length(0);
  });

  it('aborts in-flight requests via connector.abort()', async () => {
    const request = connector.makeQuery('/slow', null, { cache: false });
    const signal = connector.pending[0].signal;

    connector.abort();
    expect(signal.aborted).to.equal(true);
    try {
      await request;
      throw new Error('Request was expected to abort');
    } catch (error) {
      expect((error as Error).name).to.equal('AbortError');
    }
    expect(Object.keys(connector.getActiveApiRequests())).to.have.length(0);
  });

  it('removes external abort listeners after a successful request', async () => {
    const external = new AbortController();
    const add = sinon.spy(external.signal, 'addEventListener');
    const remove = sinon.spy(external.signal, 'removeEventListener');

    const request = connector.makeQuery('/slow', null, {
      cache: false,
      signal: external.signal,
    });
    expect(add.calledWith('abort')).to.equal(true);

    connector.pending[0].resolve('ok');
    await request;
    expect(remove.calledWith('abort', add.firstCall.args[1])).to.equal(true);
    expect(Object.keys(connector.getActiveApiRequests())).to.have.length(0);
  });

  it('cleans up abort listeners after rejection', async () => {
    const external = new AbortController();
    const remove = sinon.spy(external.signal, 'removeEventListener');
    const request = connector.makeQuery('/fail', null, {
      cache: false,
      signal: external.signal,
    });

    connector.pending[0].reject(new Error('failed'));
    try {
      await request;
      throw new Error('Request was expected to fail');
    } catch (error) {
      expect((error as Error).message).to.equal('failed');
    }
    expect(remove.calledWith('abort')).to.equal(true);
    expect(Object.keys(connector.getActiveApiRequests())).to.have.length(0);
  });

  it('aborts using the caller signal', async () => {
    const external = new AbortController();
    const request = connector.makeQuery('/slow', null, {
      cache: false,
      signal: external.signal,
    });
    external.abort();
    expect(connector.pending[0].signal.aborted).to.equal(true);
    try {
      await request;
      throw new Error('Request was expected to abort');
    } catch (error) {
      expect((error as Error).name).to.equal('AbortError');
    }
    expect(Object.keys(connector.getActiveApiRequests())).to.have.length(0);
  });

  it('does not register abort listeners for a cached GET', async () => {
    const first = connector.makeQuery('/cached', null, { cache: true });
    connector.pending[0].resolve({ ok: true });
    await first;

    const external = new AbortController();
    const add = sinon.spy(external.signal, 'addEventListener');
    const cached = await connector.makeQuery('/cached', null, {
      cache: true,
      signal: external.signal,
    });

    expect(cached).to.deep.equal({ ok: true });
    expect(connector.pending).to.have.length(1);
    expect(add.called).to.equal(false);
  });

  it('rejects an already-aborted caller signal without starting a request', async () => {
    const external = new AbortController();
    external.abort();
    try {
      await connector.makeQuery('/aborted', null, {
        cache: false,
        signal: external.signal,
      });
      throw new Error('Request was expected to abort');
    } catch (error) {
      expect((error as Error).name).to.equal('AbortError');
    }
    expect(connector.pending).to.have.length(0);
    expect(Object.keys(connector.getActiveApiRequests())).to.have.length(0);
  });
});
