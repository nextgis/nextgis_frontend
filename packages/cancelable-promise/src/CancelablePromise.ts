import { CancelError } from './CancelError';
import { PromiseControl, PromiseControlOptions } from './PromiseControl';
import { TimeoutError } from './TimeoutError';

type Reject = (reason?: any) => void;
type Resolve = (value?: any) => void;
export type OnCancelFunction = (cancelHandler: () => void) => void;

const handleCallback = <T = never>(
  resolve: Resolve,
  reject: Reject,
  callback: Resolve,
  r: T,
) => {
  try {
    resolve(callback(r));
  } catch (e) {
    reject(e);
  }
};

let ID = 0;

/**
 * Promise that can be canceled
 *
 * @example
 * Catch `CancelError`
 * ```javascript
 * import CancelablePromise from "@nextgis/cancelable-promise";
 *
 * const promise = new CancelablePromise((resolve, reject) => {
 *  setTimeout(() => resolve(), 100);
 * }).catch((er) => {
 *  if (er.name === "CancelError") {
 *    // handle cancel error
 *  }
 *  throw er;
 * });
 *
 * promise.cancel();
 * ```
 * @example
 * Handle `onCancel` callback
 * ```javascript
 * import CancelablePromise from "@nextgis/cancelable-promise";
 *
 * const promise = new CancelablePromise((resolve, reject, onCancel) => {
 *   const xhr = new XMLHttpRequest();
 *   xhr.open("GET", url, true);
 *   xhr.onload = () => {
 *     resolve(xhr.responseText);
 *   };
 *   xhr.onerror = (er) => {
 *     reject(er);
 *   };
 *
 *   onCancel(() => {
 *     xhr.abort();
 *   });
 *
 *   xhr.send();
 * });
 *
 * promise.cancel();
 * ```
 * @public
 */
export class CancelablePromise<T = any> implements Promise<T> {
  static CancelError = CancelError;
  static TimeoutError = TimeoutError;
  static PromiseControl = PromiseControl;

  readonly [Symbol.toStringTag]: string;
  readonly id = ID++;
  private _isCanceled = false;
  private _isPending = true;
  private _promise?: Promise<T>;
  private _cancelPromise?: Promise<T>;
  private _cancelHandlers: (() => void)[] = [];
  private _setCanceledCallback?: (er?: any) => void;
  private _parentPromise?: CancelablePromise;
  private _children: CancelablePromise[] = [];

  constructor(
    executor: (
      resolve: (value?: T | PromiseLike<T>) => void,
      reject: (reason?: any) => void,
      onCancel: OnCancelFunction,
    ) => void,
    timeout?: number,
  ) {
    this._cancelPromise = new Promise<any>((resolve_, reject_) => {
      this._setCanceledCallback = (er) => resolve_(er || new CancelError());
    });
    const promises = [
      this._cancelPromise,
      new Promise<T>((resolve, reject) => {
        const onResolve = (value?: T | PromiseLike<T>) => {
          if (value instanceof CancelablePromise) {
            this.attach(value);
          } else {
            this._isPending = false;
          }
          // TODO: fix types, `undefined` not allowed since 19.12.2020
          resolve(value as T | PromiseLike<T>);
        };

        const onReject = (error: any) => {
          this._isPending = false;
          reject(error);
        };

        const onCancel: OnCancelFunction = (handler) => {
          if (!this._isPending) {
            throw new Error(
              'The `onCancel` handler was attached after the promise settled.',
            );
          }

          this._cancelHandlers.push(handler);
        };

        return executor(onResolve, onReject, onCancel);
      }),
    ];
    if (timeout) {
      promises.push(
        new Promise((resolve, reject) => {
          setTimeout(() => {
            if (this._isPending) {
              try {
                this.cancel();
              } finally {
                reject(new TimeoutError());
              }
            }
          }, timeout);
        }),
      );
    }
    this._promise = Promise.race(promises);
  }

  static createControl(opt?: PromiseControlOptions): PromiseControl {
    return new PromiseControl(opt);
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
    }).catch((er) => {
      if (er instanceof this.CancelError) {
        for (const v of values) {
          if ('cancel' in v) {
            (v as CancelablePromise).cancel();
          }
        }
      }
      throw er;
    });
  }

  attach(p: CancelablePromise): void {
    if (this._isCanceled) {
      p.cancel();
    } else {
      this._children.push(p);
    }
  }

  then<TResult1 = T, TResult2 = never>(
    onfulfilled?:
      | ((value: T) => TResult1 | PromiseLike<TResult1>)
      | undefined
      | null,
    onrejected?:
      | ((reason: any) => TResult2 | PromiseLike<TResult2>)
      | undefined
      | null,
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
          if (this._isCanceled) {
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
    this._children.push(p);
    return p as CancelablePromise<TResult1 | TResult2>;
  }

  catch<TResult = never>(
    onrejected?:
      | ((reason: Error) => TResult | PromiseLike<TResult>)
      | undefined
      | null,
  ): CancelablePromise<T | TResult> {
    if (this._isCanceled && onrejected) {
      onrejected(new CancelError());
    }
    return this.then(undefined, onrejected);
  }

  finally(onfinally?: (() => void) | undefined | null): Promise<T> {
    if (this._promise) {
      return this._promise.finally(onfinally);
    }
    if (this._isCanceled) {
      return Promise.reject(new CancelError());
    }
    return Promise.reject<T>(onfinally);
  }

  cancel(): this {
    // No reason to run cancel action if promise is already complete
    if (this._isCanceled || !this._isPending) {
      return this;
    }
    this._isCanceled = true;
    const parent = this._getTopParent();
    if (parent) {
      parent.cancel();
    }

    if (this._children) {
      this._children.forEach((x) => x.cancel());
    }

    if (this._isPending) {
      if (this._cancelHandlers.length) {
        try {
          for (const handler of this._cancelHandlers) {
            handler();
          }
        } catch (error) {
          // this._setCanceledCallback(error);
        }
      }
      if (this._setCanceledCallback) {
        this._setCanceledCallback();
      }
    }
    this._destroy();

    return this;
  }

  private _getTopParent() {
    let parent = this._parentPromise;
    let hasParent = !!parent;
    while (hasParent) {
      if (parent && parent._parentPromise) {
        parent = parent._parentPromise;
        hasParent = !!parent;
      } else {
        hasParent = false;
      }
    }
    return parent;
  }

  private _destroy() {
    this._setCanceledCallback = undefined;
    this._cancelPromise = undefined;
    this._promise = undefined;
  }
}

Object.setPrototypeOf(CancelablePromise.prototype, Promise.prototype);
