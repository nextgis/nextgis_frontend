import CancelablePromise from '.';

export interface PromiseControlOptions {
  onStart?: () => void;
  onStop?: () => void;
}

export class PromiseControl {
  private _promises: CancelablePromise[] = [];

  get isLoaded(): boolean {
    return this._promises.length > 0;
  }

  constructor(private options: PromiseControlOptions = {}) {}

  remove(promise: CancelablePromise): void {
    const index = this._promises.indexOf(promise);
    if (index !== -1) {
      this._promises.splice(index, 1);
      this._onStop();
    }
  }

  add<T extends CancelablePromise = CancelablePromise>(
    promise: T
  ): CancelablePromise<T> {
    if (this.options.onStart && !this.isLoaded) {
      this.options.onStart();
    }
    this._promises.push(promise);
    promise.finally(() => {
      this.remove(promise);
    });
    return promise;
  }

  abort(): void {
    if (this.isLoaded) {
      this._promises.forEach((x) => {
        if (x.cancel) {
          x.cancel();
        }
      });
      this._promises = [];
      this._onStop();
    }
  }

  private _onStop() {
    if (this.options.onStop && !this.isLoaded) {
      this.options.onStop();
    }
  }
}
