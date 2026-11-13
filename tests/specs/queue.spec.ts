import { afterEach, describe, expect, it, vi } from 'vitest';

import { Queue } from '../../packages/queue/src/Queue';

function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

describe('Queue', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('resolves waitAll immediately for an empty queue', async () => {
    await expect(new Queue().waitAll()).resolves.toBeUndefined();
  });

  it('runs queued tasks in order with the default concurrency', async () => {
    const queue = new Queue();
    const order: number[] = [];
    for (const number of [1, 2, 3]) {
      queue.add(async () => {
        order.push(number);
      });
    }
    await queue.waitAll();
    expect(order).toEqual([1, 2, 3]);
  });

  it('never starts more tasks than the configured concurrency', async () => {
    const queue = new Queue({ concurrency: 2 });
    const first = deferred();
    const second = deferred();
    const started: number[] = [];
    queue.add(() => {
      started.push(1);
      return first.promise;
    });
    queue.add(() => {
      started.push(2);
      return second.promise;
    });
    queue.add(async () => {
      started.push(3);
    });

    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(started).toEqual([1, 2]);

    first.resolve();
    await Promise.resolve();
    expect(started).toEqual([1, 2, 3]);

    second.resolve();
    await queue.waitAll();
  });

  it('allows increasing concurrency while a task is active', async () => {
    const queue = new Queue({ concurrency: 1 });
    const pending = deferred();
    const started = vi.fn();
    queue.add(() => {
      started();
      return pending.promise;
    });
    queue.add(async () => {
      started();
    });

    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(started).toHaveBeenCalledOnce();
    queue.setLimit(2);
    expect(started).toHaveBeenCalledTimes(2);

    pending.resolve();
    await queue.waitAll();
  });

  it('does not start paused tasks until resume', async () => {
    const queue = new Queue();
    const started = vi.fn();
    queue.pause();
    queue.add(async () => {
      started();
    });
    await Promise.resolve();
    expect(started).not.toHaveBeenCalled();
    queue.resume();
    await queue.waitAll();
    expect(started).toHaveBeenCalledOnce();
  });

  it('replaces a pending task with the same ID and aborts the old one', async () => {
    const queue = new Queue();
    const oldAbort = vi.fn();
    const started = vi.fn();
    queue.pause();
    queue.add(async () => started('old'), { id: 'layer', abort: oldAbort });
    queue.add(async () => started('new'), { id: 'layer' });
    expect(oldAbort).toHaveBeenCalledOnce();
    queue.resume();
    await queue.waitAll();
    expect(started).toHaveBeenCalledOnce();
    expect(started).toHaveBeenCalledWith('new');
  });

  it('removes a queued task by ID without executing it', async () => {
    const queue = new Queue();
    const started = vi.fn();
    const abort = vi.fn();
    queue.pause();
    queue.add(async () => started(), { id: 42, abort });
    queue.remove(42);
    queue.resume();
    await queue.waitAll();
    expect(abort).toHaveBeenCalledOnce();
    expect(started).not.toHaveBeenCalled();
  });

  it('clears pending tasks and resolves idle waiters', async () => {
    const queue = new Queue();
    const abort = vi.fn();
    queue.pause();
    queue.add(async () => undefined, { abort });
    const idle = queue.waitAll();
    queue.clearQueue();
    await expect(idle).resolves.toBeUndefined();
    expect(abort).toHaveBeenCalledOnce();
  });

  it('aborts active tasks and their AbortSignals', async () => {
    const queue = new Queue();
    const abort = vi.fn();
    let signal!: AbortSignal;
    const started = deferred();
    queue.add(({ signal: activeSignal }) => {
      signal = activeSignal;
      started.resolve();
      return new Promise<void>(() => undefined);
    }, abort);

    await started.promise;
    queue.abort();
    expect(signal.aborted).toBe(true);
    expect(abort).toHaveBeenCalledOnce();
    await expect(queue.waitAll()).resolves.toBeUndefined();
  });

  it('invokes both abort callbacks when a task returns a tuple', async () => {
    const queue = new Queue();
    const externalAbort = vi.fn();
    const tupleAbort = vi.fn();
    const started = deferred();
    queue.add(() => {
      started.resolve();
      return [new Promise<void>(() => undefined), tupleAbort] as [Promise<void>, () => void];
    }, externalAbort);

    await started.promise;
    queue.abort();
    expect(externalAbort).toHaveBeenCalledOnce();
    expect(tupleAbort).toHaveBeenCalledOnce();
  });

  it('aborts tasks when their timeout expires', async () => {
    vi.useFakeTimers();
    const queue = new Queue();
    let signal!: AbortSignal;
    queue.add(({ signal: activeSignal }) => {
      signal = activeSignal;
      return new Promise<void>(() => undefined);
    }, { timeout: 20 });

    await vi.advanceTimersByTimeAsync(0);
    expect(signal.aborted).toBe(false);
    await vi.advanceTimersByTimeAsync(20);
    expect(signal.aborted).toBe(true);
    expect((signal.reason as Error).name).toBe('TimeoutError');
    await expect(queue.waitAll()).resolves.toBeUndefined();
  });

  it('respects the configured delay before starting tasks', async () => {
    vi.useFakeTimers();
    const queue = new Queue({ delay: 25 });
    const started = vi.fn();
    queue.add(async () => started());
    await vi.advanceTimersByTimeAsync(24);
    expect(started).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    await queue.waitAll();
    expect(started).toHaveBeenCalledOnce();
  });

  it('continues processing after a rejected task', async () => {
    const queue = new Queue();
    const started = vi.fn();
    queue.add(async () => {
      throw new Error('rejected');
    });
    queue.add(async () => started());
    await queue.waitAll();
    expect(started).toHaveBeenCalledOnce();
  });

  it('continues processing after a synchronously thrown error', async () => {
    const queue = new Queue();
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const started = vi.fn();
    queue.add(() => {
      throw new Error('broken task');
    });
    queue.add(async () => started());
    await queue.waitAll();
    expect(error).toHaveBeenCalledWith(expect.any(Error));
    expect(started).toHaveBeenCalledOnce();
  });
});
