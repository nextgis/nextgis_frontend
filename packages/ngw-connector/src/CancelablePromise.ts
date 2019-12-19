/**
 * @module ngw-connector
 */
type Reject = (reason?: any) => void;
type Resolve = (value?: any) => void;

const handleCallback = <T = never>(
  resolve: Resolve,
  reject: Reject,
  callback: Resolve,
  r: T
) => {
  try {
    resolve(callback(r));
  } catch (e) {
    reject(e);
  }
};

export class CancelablePromise<T> implements Promise<T> {
  readonly [Symbol.toStringTag]: string;

  private _canceled = false;

  private _promise?: Promise<T>;

  constructor(
    executor: (
      resolve: (value?: T | PromiseLike<T>) => void,
      reject: (reason?: any) => void
    ) => void,
    private onCancel?: (...args: any[]) => void
  ) {
    this._promise = new Promise(executor);
  }

  static resolve<T>(value: T | PromiseLike<T>): CancelablePromise<T> {
    return new CancelablePromise(resolve => resolve(value));
  }

  static reject<T>(value: T | PromiseLike<T>): CancelablePromise<T> {
    return new CancelablePromise((resolve, reject) => reject(value));
  }

  static all<T>(values: (T | PromiseLike<T>)[]): CancelablePromise<T[]> {
    return new CancelablePromise((resolve, reject) => {
      Promise.all(values)
        .then(resolve)
        .catch(reject);
    });
  }

  then<TResult1 = T, TResult2 = never>(
    onfulfilled?:
      | ((value: T) => TResult1 | PromiseLike<TResult1>)
      | undefined
      | null,
    onrejected?:
      | ((reason: any) => TResult2 | PromiseLike<TResult2>)
      | undefined
      | null
  ): CancelablePromise<TResult1 | TResult2> {
    const p = new CancelablePromise(
      (resolve, reject) => {
        if (this._promise) {
          this._promise.then(
            r => {
              if (this._canceled) {
                p.cancel();
              }
              if (onfulfilled && !this._canceled) {
                handleCallback(resolve, reject, onfulfilled, r);
              } else {
                resolve(r);
              }
            },
            r => {
              if (this._canceled) {
                p.cancel();
              }
              if (onrejected && !this._canceled) {
                handleCallback(resolve, reject, onrejected, r);
              } else {
                reject(r);
              }
            }
          );
        }
      },
      () => {
        this.cancel();
      }
    );
    return p as CancelablePromise<TResult1 | TResult2>;
  }

  catch<TResult = never>(
    onrejected?:
      | ((reason: any) => TResult | PromiseLike<TResult>)
      | undefined
      | null
  ): CancelablePromise<T | TResult> {
    return this.then(undefined, onrejected);
  }

  cancel(errorCallback?: (...args: any[]) => void) {
    this._canceled = true;
    if (errorCallback && this._promise) {
      this._promise.catch(errorCallback);
    }
    if (this.onCancel) {
      this.onCancel();
    }
    this._destroy();
    return this;
  }

  finally(onfinally?: (() => void) | undefined | null): Promise<T> {
    if (this._promise) {
      return this._promise.finally(onfinally);
    }
    return Promise.reject<T>(onfinally);
  }

  private _destroy() {
    this.onCancel = undefined;
    this._promise = undefined;
  }
}
