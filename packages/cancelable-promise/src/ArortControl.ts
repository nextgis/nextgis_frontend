import CancelablePromise from '.';

export class AbortControl {
  private _promises: CancelablePromise[] = [];

  add<T extends CancelablePromise = CancelablePromise>(
    promise: T
  ): CancelablePromise<T> {
    this._promises.push(promise);
    return promise;
  }

  abort(): void {
    this._promises.forEach((x) => {
      if (x.cancel) {
        x.cancel();
      }
    });
    this._promises = [];
  }
}
