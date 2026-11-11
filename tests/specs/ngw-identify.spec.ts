import { expect } from 'chai';
import { EventEmitter } from 'events';

import { NgwMap } from '../../packages/ngw-map/src/NgwMap';

import type { FeatureLayersIdentify } from '@nextgis/ngw-connector';
import type { MapClickEvent, OnLayerClickOptions } from '@nextgis/webmap';

import type { NgwIdentifyEvent } from '../../packages/ngw-map/src/interfaces';

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<T>((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
}

function click(offset = 0): MapClickEvent {
  return {
    latLng: { lng: 37 + offset, lat: 55 },
    lngLat: [37 + offset, 55],
    pixel: { left: 100 + offset, top: 100 },
  };
}

function response(id: number): FeatureLayersIdentify {
  return {
    featureCount: 1,
    27: {
      featureCount: 1,
      features: [
        {
          id,
          layerId: 27,
          parent: '',
          fields: { objectid: id },
          label: `#${id}`,
        },
      ],
    },
  } as FeatureLayersIdentify;
}

type IdentifyPost = (options: {
  signal?: AbortSignal;
}) => Promise<FeatureLayersIdentify>;

function createMap({
  getIds = () => Promise.resolve([27]),
  post = () => Promise.resolve(response(1)),
}: {
  getIds?: () => Promise<number[] | undefined>;
  post?: IdentifyPost;
} = {}): NgwMap {
  // Avoid map engines, DOM setup, and live HTTP; exercise the actual core methods.
  const map = Object.create(NgwMap.prototype) as NgwMap;
  Object.assign(map, {
    emitter: new EventEmitter(),
    options: {},
    _selectionRequest: 0,
    _eventsStatus: {},
    _promises: { select: [], identify: [] },
    _ngwLayers: {
      style: {
        resourceId: 27,
        layer: {
          id: 'style',
          options: { selectable: true },
          getIdentificationIds: getIds,
        },
      },
    },
    connector: {
      route: (name: string) => {
        expect(name).to.equal('feature_layer.identify');
        return { post };
      },
    },
    isLayerVisible: () => true,
    getCenter: () => [37, 55],
    getZoom: () => 12,
  });
  return map;
}

function vectorClick(id = 1, selectable = true): OnLayerClickOptions {
  return {
    event: click(),
    layer: { options: { selectable }, item: { resource: { id: 27 } } },
    feature: {
      type: 'Feature',
      id,
      properties: { objectid: id },
      geometry: { type: 'Point', coordinates: [37, 55] },
    },
  } as unknown as OnLayerClickOptions;
}

function nextTurn(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

describe('NGW identification lifecycle', () => {
  it('emits start and the prepared raster result', async () => {
    const map = createMap();
    const events: string[] = [];
    map.emitter.on('ngw:preselect', () => events.push('start'));
    map.emitter.on('ngw:select', (result) => {
      events.push(String(result?.getIdentifyItems()[0].id));
    });

    const result = await map.selectFromNgwRaster(click());

    expect(events).to.deep.equal(['start', '1']);
    expect(result?.sourceType).to.equal('raster');
    expect(result?.getIdentifyItems()[0].layerId).to.equal(27);
  });

  it('finishes with null when no identifiable layers are available', async () => {
    let requests = 0;
    const map = createMap({
      getIds: () => Promise.resolve([]),
      post: () => {
        requests++;
        return Promise.resolve(response(1));
      },
    });
    const results: (NgwIdentifyEvent | null)[] = [];
    map.emitter.on('ngw:select', (result) => results.push(result));

    expect(await map.selectFromNgwRaster(click())).to.equal(undefined);
    expect(results).to.deep.equal([null]);
    expect(requests).to.equal(0);
  });

  it('does not emit an old HTTP response after a newer selection', async () => {
    const first = deferred<FeatureLayersIdentify>();
    const second = deferred<FeatureLayersIdentify>();
    const signals: (AbortSignal | undefined)[] = [];
    const map = createMap({
      // Ignore abort in this stub so the revision check is tested too.
      post: ({ signal }) => {
        signals.push(signal);
        return signals.length === 1 ? first.promise : second.promise;
      },
    });
    const selected: number[] = [];
    map.emitter.on('ngw:select', (result) => {
      if (result) selected.push(result.getIdentifyItems()[0].id);
    });

    const oldRequest = map.selectFromNgwRaster(click());
    await nextTurn();
    const newRequest = map.selectFromNgwRaster(click(1));
    await nextTurn();
    second.resolve(response(2));
    await newRequest;
    first.resolve(response(1));
    await oldRequest;

    expect(signals[0]?.aborted).to.equal(true);
    expect(selected).to.deep.equal([2]);
  });

  it('does not start an old HTTP request after newer layer IDs resolve', async () => {
    const firstIds = deferred<number[]>();
    let idsCalls = 0;
    let requests = 0;
    const map = createMap({
      getIds: () =>
        ++idsCalls === 1 ? firstIds.promise : Promise.resolve([27]),
      post: () => {
        requests++;
        return Promise.resolve(response(2));
      },
    });
    const selected: number[] = [];
    map.emitter.on('ngw:select', (result) => {
      if (result) selected.push(result.getIdentifyItems()[0].id);
    });

    const oldRequest = map.selectFromNgwRaster(click());
    await map.selectFromNgwRaster(click(1));
    firstIds.resolve([27]);
    await oldRequest;

    expect(requests).to.equal(1);
    expect(selected).to.deep.equal([2]);
  });

  for (const cancelAll of [false, true]) {
    it(`cancels pending layer discovery using ${cancelAll ? 'all groups' : 'select'}`, async () => {
      const ids = deferred<number[]>();
      let requests = 0;
      const map = createMap({
        getIds: () => ids.promise,
        post: () => {
          requests++;
          return Promise.resolve(response(1));
        },
      });
      const results: (NgwIdentifyEvent | null)[] = [];
      map.emitter.on('ngw:select', (result) => results.push(result));

      const pending = map.selectFromNgwRaster(click());
      if (cancelAll) map.cancelPromises();
      else map.cancelPromises('select');
      ids.resolve([27]);
      await pending;

      expect(requests).to.equal(0);
      expect(results).to.deep.equal([]);
    });
  }

  it('reports active request errors and preserves manual rejection', async () => {
    const failure = new Error('Identify unavailable');
    const map = createMap({ post: () => Promise.reject(failure) });
    const errors: unknown[] = [];
    map.emitter.on('ngw:selecterror', (error) => errors.push(error));
    let rejected: unknown;

    try {
      await map.selectFromNgwRaster(click());
    } catch (error) {
      rejected = error;
    }

    expect(rejected).to.equal(failure);
    expect(errors).to.deep.equal([failure]);
  });

  it('does not report an obsolete error after a newer result', async () => {
    const first = deferred<FeatureLayersIdentify>();
    let requests = 0;
    const map = createMap({
      post: () =>
        ++requests === 1 ? first.promise : Promise.resolve(response(2)),
    });
    const errors: unknown[] = [];
    const selected: number[] = [];
    map.emitter.on('ngw:selecterror', (error) => errors.push(error));
    map.emitter.on('ngw:select', (result) => {
      if (result) selected.push(result.getIdentifyItems()[0].id);
    });

    const oldRequest = map.selectFromNgwRaster(click());
    await nextTurn();
    await map.selectFromNgwRaster(click(1));
    first.reject(new Error('Old request failed'));
    await oldRequest;

    expect(errors).to.deep.equal([]);
    expect(selected).to.deep.equal([2]);
  });

  it('handles automatic click failures without an unhandled rejection', async () => {
    const failure = new Error('Layer discovery unavailable');
    const map = createMap({ getIds: () => Promise.reject(failure) });
    const errors: unknown[] = [];
    const unhandled: unknown[] = [];
    const onUnhandled = (event: PromiseRejectionEvent) =>
      unhandled.push(event.reason);
    map.emitter.on('ngw:select', () => undefined);
    map.emitter.on('ngw:selecterror', (error) => errors.push(error));
    window.addEventListener('unhandledrejection', onUnhandled);
    map.enableSelection();

    try {
      map.emitter.emit('preclick', click());
      map.emitter.emit('click', click());
      await nextTurn();
      expect(errors).to.deep.equal([failure]);
      expect(unhandled).to.deep.equal([]);
    } finally {
      map.disableSelection();
      window.removeEventListener('unhandledrejection', onUnhandled);
    }
  });

  it('prefers a valid vector hit, including feature ID zero, over the same map click', async () => {
    let requests = 0;
    const map = createMap({
      post: () => {
        requests++;
        return Promise.resolve(response(99));
      },
    });
    const results: NgwIdentifyEvent[] = [];
    map.emitter.on('ngw:select', (result) => {
      if (result) results.push(result);
    });
    map.enableSelection();
    const event = vectorClick(0);

    map.emitter.emit('preclick', event.event);
    map.emitter.emit('layer:click', event);
    map.emitter.emit('click', event.event);
    await nextTurn();

    expect(results).to.have.length(1);
    expect(results[0].sourceType).to.equal('vector');
    expect(results[0].getIdentifyItems()[0].id).to.equal(0);
    expect(requests).to.equal(0);
  });

  it('keeps automatic raster identification when the vector hit is not selectable', async () => {
    const map = createMap();
    const results: NgwIdentifyEvent[] = [];
    map.emitter.on('ngw:select', (result) => {
      if (result) results.push(result);
    });
    map.enableSelection();
    const event = vectorClick(1, false);

    map.emitter.emit('preclick', event.event);
    map.emitter.emit('layer:click', event);
    map.emitter.emit('click', event.event);
    await nextTurn();

    expect(results).to.have.length(1);
    expect(results[0].sourceType).to.equal('raster');
  });

  it('lets a valid vector hit invalidate earlier pending raster discovery', async () => {
    const ids = deferred<number[]>();
    let requests = 0;
    const map = createMap({
      getIds: () => ids.promise,
      post: () => {
        requests++;
        return Promise.resolve(response(99));
      },
    });
    const results: NgwIdentifyEvent[] = [];
    map.emitter.on('ngw:select', (result) => {
      if (result) results.push(result);
    });
    map.enableSelection();

    const oldRequest = map.selectFromNgwRaster(click());
    const event = vectorClick();
    map.emitter.emit('layer:click', event);
    ids.resolve([27]);
    await oldRequest;

    expect(results).to.have.length(1);
    expect(results[0].sourceType).to.equal('vector');
    expect(requests).to.equal(0);
  });

  it('resets the vector-first flag for the next background click', async () => {
    const map = createMap();
    const results: string[] = [];
    map.emitter.on('ngw:select', (result) => {
      if (result) results.push(result.sourceType);
    });
    map.enableSelection();
    const event = vectorClick();

    // Leaflet can stop bubbling the feature click before the map click.
    map.emitter.emit('layer:click', event);
    map.emitter.emit('preclick', click(1));
    map.emitter.emit('click', click(1));
    await nextTurn();

    expect(results).to.deep.equal(['vector', 'raster']);
  });

  it('registers automatic listeners once and removes them when disabled', () => {
    const map = createMap();
    map.enableSelection();
    map.enableSelection();

    expect(map.emitter.listenerCount('preclick')).to.equal(1);
    expect(map.emitter.listenerCount('click')).to.equal(1);
    expect(map.emitter.listenerCount('layer:click')).to.equal(1);

    map.disableSelection();

    expect(map.emitter.listenerCount('preclick')).to.equal(0);
    expect(map.emitter.listenerCount('click')).to.equal(0);
    expect(map.emitter.listenerCount('layer:click')).to.equal(0);
  });
});
