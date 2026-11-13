import { describe, expect, it, vi } from 'vitest';

import CancelablePromise from '../../packages/cancelable-promise/src';
import { PromiseControl } from '../../packages/cancelable-promise/src/PromiseControl';
import { TimeoutError } from '../../packages/cancelable-promise/src/TimeoutError';

function pending() {
  let resolve!: (value: number) => void;
  const promise = new CancelablePromise<number>((done) => {
    resolve = (value) => done(value);
  });
  return { promise, resolve };
}

describe('PromiseControl', () => {
  it('starts on the first pending promise and stops after settlement', async () => {
    const onStart = vi.fn();
    const onStop = vi.fn();
    const control = new PromiseControl({ onStart, onStop });
    const { promise, resolve } = pending();

    expect(control.isLoaded).toBe(false);
    expect(control.add(promise, 'loading')).toBe(promise);
    expect(control.get('loading')).toBe(promise);
    expect(control.isLoaded).toBe(true);
    expect(onStart).toHaveBeenCalledOnce();

    resolve(12);
    await expect(promise).resolves.toBe(12);
    expect(control.get('loading')).toBeUndefined();
    expect(control.isLoaded).toBe(false);
    expect(onStop).toHaveBeenCalledOnce();
  });

  it('does not stop until the last registered promise settles', async () => {
    const onStart = vi.fn();
    const onStop = vi.fn();
    const control = new PromiseControl({ onStart, onStop });
    const first = pending();
    const second = pending();
    control.add(first.promise, 'first');
    control.add(second.promise, 'second');
    expect(onStart).toHaveBeenCalledOnce();

    first.resolve(1);
    await first.promise;
    expect(control.isLoaded).toBe(true);
    expect(onStop).not.toHaveBeenCalled();

    second.resolve(2);
    await second.promise;
    expect(control.isLoaded).toBe(false);
    expect(onStop).toHaveBeenCalledOnce();
  });

  it('deduplicates promises registered with the same key', async () => {
    const control = new PromiseControl();
    const first = pending();
    const second = pending();
    expect(control.add(first.promise, 'shared')).toBe(first.promise);
    expect(control.add(second.promise, 'shared')).toBe(first.promise);
    expect(control.get('shared')).toBe(first.promise);

    first.resolve(1);
    second.resolve(2);
    await first.promise;
    await second.promise;
    expect(control.get('shared')).toBeUndefined();
  });

  it('ignores removals for unknown keys', () => {
    const onStop = vi.fn();
    const control = new PromiseControl({ onStop });
    control.remove('missing');
    expect(onStop).not.toHaveBeenCalled();
  });

  it('removes tracked promises explicitly', () => {
    const onStop = vi.fn();
    const control = new PromiseControl({ onStop });
    const { promise, resolve } = pending();
    control.add(promise, 'key');
    control.remove('key');
    expect(control.isLoaded).toBe(false);
    expect(onStop).toHaveBeenCalledOnce();
    resolve(0);
  });

  it('cancels all tracked promises and reports that loading stopped', () => {
    const onStop = vi.fn();
    const cancelFirst = vi.fn();
    const cancelSecond = vi.fn();
    const control = new PromiseControl({ onStop });
    control.add(new CancelablePromise<void>((_resolve, _reject, onCancel) => {
      onCancel(cancelFirst);
    }), 'first');
    control.add(new CancelablePromise<void>((_resolve, _reject, onCancel) => {
      onCancel(cancelSecond);
    }), 'second');

    control.abort();
    expect(cancelFirst).toHaveBeenCalledOnce();
    expect(cancelSecond).toHaveBeenCalledOnce();
    expect(control.isLoaded).toBe(false);
    expect(onStop).toHaveBeenCalledOnce();
    control.abort();
    expect(onStop).toHaveBeenCalledOnce();
  });

  it('waitFunc reuses a named in-flight call', async () => {
    const control = new PromiseControl();
    const job = pending();
    const run = vi.fn(() => job.promise);

    const first = control.waitFunc<number>(run, 'job');
    const second = control.waitFunc<number>(run, 'job');
    expect(first).toBe(second);
    expect(run).toHaveBeenCalledOnce();

    job.resolve(42);
    await expect(first).resolves.toBe(42);
    expect(control.get('job')).toBeUndefined();
  });

  it('WaitForMe wraps a method and deduplicates calls until completion', async () => {
    const control = new PromiseControl();
    const job = pending();
    const service = { run: vi.fn(() => job.promise) };
    const descriptor = Object.getOwnPropertyDescriptor(service, 'run')!;
    control.WaitForMe()(service, 'run', descriptor);
    Object.defineProperty(service, 'run', descriptor);

    const first = service.run();
    expect(service.run()).toBe(first);
    job.resolve(42);
    await expect(first).resolves.toBe(42);
  });

  it('creates decorators through the deprecated alias', () => {
    const control = new PromiseControl();
    expect(control.WaitForMe()).toBeTypeOf('function');
  });

  it('exposes the TimeoutError type', () => {
    const error = new TimeoutError();
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('TimeoutError');
  });
});
