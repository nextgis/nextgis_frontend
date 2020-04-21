import { rejects } from 'assert';
import { CancelError } from './CancelError';

/**
 * @module cancelable-promise
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
  private _cancelPromise?: Promise<T>;
  private _setCanceledCallback?: () => void;
  private _parentPromise?: CancelablePromise<T>;

  constructor(
    executor: (
      resolve: (value?: T | PromiseLike<T>) => void,
      reject: (reason?: any) => void
    ) => void
  ) {
    this._cancelPromise = new Promise<any>((resolve_, reject_) => {
      this._setCanceledCallback = () => resolve_(new CancelError());
    });
    this._promise = Promise.race([this._cancelPromise, new Promise(executor)]);
  }

  static resolve<T>(value: T | PromiseLike<T>): CancelablePromise<T> {
    return new CancelablePromise((resolve) => resolve(value));
  }

  static reject<T>(value: T | PromiseLike<T>): CancelablePromise<T> {
    return new CancelablePromise((resolve, reject) => reject(value));
  }

  static all<T>(values: (T | PromiseLike<T>)[]): CancelablePromise<T[]> {
    return new CancelablePromise((resolve, reject) => {
      Promise.all(values).then(resolve).catch(reject);
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
    const p = new CancelablePromise((resolve, reject) => {
      if (this._promise) {
        const reject_ = (r: any) => {
          if (onrejected) {
            handleCallback(resolve, reject, onrejected, r);
          } else {
            reject(r);
          }
        };
        this._promise.then((r) => {
          if (this._canceled) {
            reject_(r);
          } else {
            if (onfulfilled) {
              handleCallback(resolve, reject, onfulfilled, r);
            } else {
              resolve(r);
            }
          }
        }, reject_);
      }
    });
    p._parentPromise = this;
    return p as CancelablePromise<TResult1 | TResult2>;
  }

  catch<TResult = never>(
    onrejected?:
      | ((reason: Error) => TResult | PromiseLike<TResult>)
      | undefined
      | null
  ): CancelablePromise<T | TResult> {
    if (this._canceled && onrejected) {
      onrejected(new CancelError());
    }
    return this.then(undefined, onrejected);
  }

  finally(onfinally?: (() => void) | undefined | null): Promise<T> {
    if (this._promise) {
      return this._promise.finally(onfinally);
    }
    if (this._canceled) {
      return Promise.reject(new CancelError());
    }
    return Promise.reject<T>(onfinally);
  }

  cancel() {
    let parent = this._parentPromise;
    let hasParent = !!parent;
    this._canceled = true;
    while (hasParent) {
      if (parent && parent._parentPromise) {
        parent = parent._parentPromise;
        parent._canceled = true;
        hasParent = !!parent;
      } else {
        hasParent = false;
      }
    }
    if (parent) {
      parent.cancel();
    }
    if (this._setCanceledCallback) {
      this._setCanceledCallback();
    }
    this._destroy();

    return this;
  }

  private _destroy() {
    this._setCanceledCallback = undefined;
    this._cancelPromise = undefined;
    this._promise = undefined;
  }
}
