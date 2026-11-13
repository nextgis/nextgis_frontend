import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { act, createElement, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { useIdentifyEvents } from '../../packages/react-ngw-map/src/hooks/useIdentifyEvents';

import type { NgwMap } from '@nextgis/ngw-map';
import type { Root } from 'react-dom/client';

import type { IdentifyHandlers } from '../../packages/react-ngw-map/src/interfaces';

type Listener = (...args: unknown[]) => void;
type Items = Parameters<NonNullable<IdentifyHandlers['onIdentify']>>[0];
type Result = Parameters<NonNullable<IdentifyHandlers['onIdentify']>>[1];

class FakeEmitter {
  added = 0;
  removed = 0;
  private listeners = new Map<string, Set<Listener>>();

  on(name: string, listener: Listener) {
    this.added++;
    const listeners = this.listeners.get(name) || new Set<Listener>();
    listeners.add(listener);
    this.listeners.set(name, listeners);
  }

  removeListener(name: string, listener: Listener) {
    this.removed++;
    this.listeners.get(name)?.delete(listener);
  }

  listenerCount(name: string) {
    return this.listeners.get(name)?.size || 0;
  }

  emit(name: string, ...args: unknown[]) {
    for (const listener of this.listeners.get(name) || []) listener(...args);
  }
}

function createMap() {
  const canceled: string[][] = [];
  return {
    emitter: new FakeEmitter(),
    canceled,
    cancelPromises: (...keys: string[]) => {
      canceled.push(keys);
    },
  };
}

type FakeMap = ReturnType<typeof createMap>;

function Probe({
  map,
  handlers,
}: {
  map: FakeMap | null;
  handlers: IdentifyHandlers;
}) {
  useIdentifyEvents(map as unknown as NgwMap | null, handlers);
  return null;
}

function result(items: Items): Exclude<Result, null> {
  return { getIdentifyItems: () => items } as Exclude<Result, null>;
}

describe('React identification callbacks', () => {
  const environment = globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
  };
  let previousActEnvironment: boolean | undefined;
  let container: HTMLDivElement;
  let root: Root | undefined;
  let map: FakeMap;

  beforeAll(() => {
    previousActEnvironment = environment.IS_REACT_ACT_ENVIRONMENT;
    environment.IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterAll(() => {
    if (previousActEnvironment === undefined) {
      delete environment.IS_REACT_ACT_ENVIRONMENT;
    } else {
      environment.IS_REACT_ACT_ENVIRONMENT = previousActEnvironment;
    }
  });

  beforeEach(() => {
    map = createMap();
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  async function render(
    handlers: IdentifyHandlers,
    nextMap: FakeMap | null = map,
    strict = false,
  ) {
    const probe = createElement(Probe, { map: nextMap, handlers });
    await act(async () => {
      root!.render(strict ? createElement(StrictMode, null, probe) : probe);
    });
  }

  async function unmount() {
    const current = root;
    root = undefined;
    if (current) {
      await act(async () => {
        current.unmount();
      });
    }
  }

  afterEach(async () => {
    await unmount();
    container.remove();
  });

  it('uses the latest callbacks without resubscribing', async () => {
    const calls: string[] = [];
    await render({
      onIdentify: () => calls.push('old result'),
      onIdentifyStart: () => calls.push('old start'),
      onIdentifyError: () => calls.push('old error'),
    });
    await render({
      onIdentify: () => calls.push('new result'),
      onIdentifyStart: () => calls.push('new start'),
      onIdentifyError: () => calls.push('new error'),
    });

    map.emitter.emit('ngw:preselect');
    map.emitter.emit('ngw:select', result([]));
    map.emitter.emit('ngw:selecterror', new Error('Network error'));

    expect(calls).to.deep.equal(['new start', 'new result', 'new error']);
    expect(map.emitter.added).to.equal(3);
    expect(map.emitter.removed).to.equal(0);
    expect(map.canceled).to.deep.equal([]);
  });

  it('provides identified items and preserves the original result', async () => {
    const items = [{ id: 2, layerId: 27, fields: { name: 'Park' } }] as unknown as Items;
    const event = result(items);
    const received: Array<{ items: Items; event: Result }> = [];
    await render({
      onIdentify: (items, event) => received.push({ items, event }),
    });

    map.emitter.emit('ngw:select', event);

    expect(received).to.have.length(1);
    expect(received[0].items).to.equal(items);
    expect(received[0].event).to.equal(event);
  });

  it('reports empty clicks for both null and empty results', async () => {
    const received: Array<{ items: Items; event: Result }> = [];
    const empty = result([]);
    await render({
      onIdentify: (items, event) => received.push({ items, event }),
    });

    map.emitter.emit('ngw:select', null);
    map.emitter.emit('ngw:select', empty);

    expect(received).to.deep.equal([
      { items: [], event: null },
      { items: [], event: empty },
    ]);
  });

  it('allows loading and error callbacks without a result callback', async () => {
    const calls: unknown[] = [];
    const error = new Error('Identification failed');
    await render({
      onIdentifyStart: () => calls.push('loading'),
      onIdentifyError: (error) => calls.push(error),
    });

    map.emitter.emit('ngw:preselect');
    map.emitter.emit('ngw:selecterror', error);

    expect(calls).to.deep.equal(['loading', error]);
    expect(map.emitter.listenerCount('ngw:select')).to.equal(1);
  });

  it('subscribes only when both the map and callbacks are available', async () => {
    await render({});
    expect(map.emitter.added).to.equal(0);
    await render({ onIdentify: () => undefined }, null);
    expect(map.emitter.added).to.equal(0);

    await render({ onIdentify: () => undefined });
    expect(map.emitter.listenerCount('ngw:select')).to.equal(1);
    await render({});

    expect(map.emitter.listenerCount('ngw:select')).to.equal(0);
    expect(map.emitter.listenerCount('ngw:preselect')).to.equal(0);
    expect(map.emitter.listenerCount('ngw:selecterror')).to.equal(0);
    expect(map.canceled).to.deep.equal([['select']]);
  });

  it('does not deliver late events after unmount', async () => {
    const calls: string[] = [];
    await render({
      onIdentify: () => calls.push('result'),
      onIdentifyStart: () => calls.push('start'),
      onIdentifyError: () => calls.push('error'),
    });
    map.emitter.emit('ngw:preselect');
    await unmount();
    map.emitter.emit('ngw:select', result([]));
    map.emitter.emit('ngw:selecterror', new Error('Late error'));
    map.emitter.emit('ngw:preselect');

    expect(calls).to.deep.equal(['start']);
    expect(map.canceled).to.deep.equal([['select']]);
    expect(map.emitter.removed).to.equal(map.emitter.added);
  });

  it('preserves independent listeners and their requests', async () => {
    let externalResults = 0;
    map.emitter.on('ngw:select', () => externalResults++);
    await render({ onIdentify: () => undefined });
    await unmount();
    map.emitter.emit('ngw:select', result([]));

    expect(externalResults).to.equal(1);
    expect(map.emitter.listenerCount('ngw:select')).to.equal(1);
    expect(map.canceled).to.deep.equal([]);
  });

  it('detaches from the previous map when its instance changes', async () => {
    let results = 0;
    const nextMap = createMap();
    const handlers = { onIdentify: () => results++ };
    await render(handlers);
    await render(handlers, nextMap);
    map.emitter.emit('ngw:select', result([]));
    nextMap.emitter.emit('ngw:select', result([]));

    expect(results).to.equal(1);
    expect(map.emitter.listenerCount('ngw:select')).to.equal(0);
    expect(map.canceled).to.deep.equal([['select']]);
    expect(nextMap.emitter.listenerCount('ngw:select')).to.equal(1);
  });

  it('balances subscriptions during StrictMode effect replay', async () => {
    let results = 0;
    await render({ onIdentify: () => results++ }, map, true);
    map.emitter.emit('ngw:select', result([]));

    expect(results).to.equal(1);
    expect(map.emitter.added).to.be.greaterThan(3);
    expect(map.emitter.listenerCount('ngw:preselect')).to.equal(1);
    expect(map.emitter.listenerCount('ngw:select')).to.equal(1);
    expect(map.emitter.listenerCount('ngw:selecterror')).to.equal(1);

    await unmount();

    expect(map.emitter.removed).to.equal(map.emitter.added);
    expect(map.emitter.listenerCount('ngw:select')).to.equal(0);
  });
});
