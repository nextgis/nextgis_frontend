import { describe, expect, it, vi } from 'vitest';
import CancelablePromise from '../../packages/cancelable-promise/src';

const getPromise = (delay = 0) =>
  new CancelablePromise((resolve) => {
    setTimeout(() => resolve(), delay);
  });

const getCatchPromise = () =>
  new CancelablePromise((resolve, reject) => {
    setTimeout(() => reject());
  });

// Vitest waits for returned promises, not Mocha-style `done` callbacks.
function waitForCancel(run: (onCanceled: (error: Error) => void) => void) {
  return new Promise<void>((resolve, reject) => {
    run((error) => {
      if (error?.name === 'CancelError') {
        resolve();
      } else {
        reject(error ?? new Error('Expected CancelError'));
      }
    });
  });
}

describe('CancelablePromise', () => {
  it('then', async () => {
    const spy = vi.fn();
    await getPromise().then(spy);
    expect(spy).toHaveBeenCalled();
  });

  it('catch', async () => {
    const spy = vi.fn();
    await getCatchPromise().catch(spy);
    expect(spy).toHaveBeenCalledOnce();
  });

  it('catch canceled', async () => {
    await waitForCancel((onCanceled) => {
      getCatchPromise().catch(onCanceled).cancel();
    });
  });

  it('finally', async () => {
    const spy = vi.fn();
    await getPromise()
      .then(() => {
        spy();
      })
      .catch(() => {
        spy();
      })
      .finally(() => {
        spy();
      });
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('finally after catch', async () => {
    const spy = vi.fn();
    await getCatchPromise()
      .then(() => {
        spy();
      })
      .catch(() => {
        spy();
      })
      .finally(() => {
        spy();
      });
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('canceled', async () => {
    await waitForCancel((onCanceled) => {
      const promise = getPromise().catch(onCanceled);
      promise.cancel();
    });
  });

  it('canceled after then', async () => {
    const thenSpy = vi.fn();
    await waitForCancel((onCanceled) => {
      const promise = getPromise().then(thenSpy).catch(onCanceled);
      promise.cancel();
    });
    expect(thenSpy).not.toHaveBeenCalled();
  });

  it('catch after cancel', () => {
    const promise = getPromise()
      .then(() => true)
      .then(() => true);
    promise.cancel();

    const spy = vi.fn();
    promise.catch(spy);
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(expect.any(CancelablePromise.CancelError));
  });

  it('throw CancelError immediately', async () => {
    const start = performance.now();
    await waitForCancel((onCanceled) => {
      getPromise(300).catch(onCanceled).cancel();
    });
    expect(performance.now() - start).to.be.lessThan(100);
  });

  it('canceled after chain', async () => {
    const spy = vi.fn();
    const thenSpy = vi.fn();

    await new Promise<void>((resolve, reject) => {
      const onCanceled = (error: Error) => {
        if (error?.name !== 'CancelError') {
          reject(error);
          return;
        }
        spy();
        if (spy.mock.calls.length === 2) {
          resolve();
        }
      };
      const promise = getPromise().catch(onCanceled);
      const promise2 = promise.then(thenSpy).catch(onCanceled);
      promise2.cancel();
    });
    expect(spy).toHaveBeenCalledTimes(2);
    expect(thenSpy).not.toHaveBeenCalled();
  });

  it('attach cancelable promise', async () => {
    await waitForCancel((onCanceled) => {
      const promise = new CancelablePromise((resolve) => {
        resolve(getPromise().catch(onCanceled));
      });
      promise.cancel();
    });
  });

  it('handle onCancel', () => {
    const spy = vi.fn();
    const promise = new CancelablePromise((_resolve, _reject, onCancel) => {
      onCancel(spy);
    });
    promise.cancel();
    expect(spy).toHaveBeenCalledOnce();
  });
});
