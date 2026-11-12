import { expect } from 'chai';
import sinon from 'sinon';

import { NgwMap } from '../../packages/ngw-map/src/NgwMap';

import type { NgwIdentify } from '../../packages/ngw-kit/src/interfaces';

const identify = {
  1: { features: [{ id: 12 }], featureCount: 1 },
  featureCount: 1,
  resources: [1],
  sourceType: 'raster',
} as unknown as NgwIdentify;

function harness() {
  let receivedSignal: AbortSignal | undefined;
  const map = Object.create(NgwMap.prototype) as NgwMap;
  (map as any)._promises = { select: [], identify: [] };
  (map as any).connector = {
    route: () => ({
      get: (options: { signal?: AbortSignal }) => {
        receivedSignal = options.signal;
        return new Promise((_, reject) => {
          options.signal?.addEventListener('abort', () =>
            reject(new DOMException('Aborted', 'AbortError')), { once: true });
        });
      },
    }),
  };
  return { map, signal: () => receivedSignal };
}

describe('NGW identify AbortSignal lifecycle', () => {
  afterEach(() => sinon.restore());

  it('aborts the pending identify item request and removes listener', async () => {
    const h = harness();
    const controller = new AbortController();
    const add = sinon.spy(controller.signal, 'addEventListener');
    const remove = sinon.spy(controller.signal, 'removeEventListener');
    const promise = h.map.fetchIdentifyItem(identify, { signal: controller.signal });
    controller.abort();
    try { await promise; throw new Error('Expected rejection'); }
    catch (error) { expect((error as Error).name).to.equal('AbortError'); }
    expect(h.signal()?.aborted).to.equal(true);
    expect(add.calledWith('abort')).to.equal(true);
    expect(remove.calledWith('abort')).to.equal(true);
  });

  it('does not change the caller requestOptions object', async () => {
    const h = harness();
    const controller = new AbortController();
    const options = { signal: controller.signal };
    const promise = h.map.fetchIdentifyItem(identify, options);
    expect(options.signal).to.equal(controller.signal);
    controller.abort();
    try { await promise; } catch { /* expected */ }
    expect(options.signal).to.equal(controller.signal);
  });

  it('rejects an already-aborted signal without starting an identify query', async () => {
    const h = harness();
    const controller = new AbortController();
    controller.abort();
    let failed = false;
    try { await h.map.fetchIdentifyItem(identify, { signal: controller.signal }); }
    catch (error) { failed = (error as Error).name === 'AbortError'; }
    expect(failed).to.equal(true);
    expect(h.signal()).to.be.undefined;
  });

  it('unsubscribes after a GeoJSON identify with an immediate feature', async () => {
    const h = harness();
    const controller = new AbortController();
    const remove = sinon.spy(controller.signal, 'removeEventListener');
    const directFeature = {
      1: { features: [{ id: 12, geom: { type: 'Point', coordinates: [0, 0] }, fields: {} }] },
      featureCount: 1,
    } as unknown as NgwIdentify;
    await h.map.fetchIdentifyGeoJson(directFeature, { signal: controller.signal });
    expect(remove.calledWith('abort')).to.equal(true);
  });
});
