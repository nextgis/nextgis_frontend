import CancelablePromise from '.';

export interface PromiseControlOptions {
  onStart?: () => void;
  onStop?: () => void;
}

type Key = CancelablePromise | string | number | symbol;

export class PromiseControl {
  private _promises: Map<Key, CancelablePromise> = new Map();

  constructor(private options: PromiseControlOptions = {}) {}

  get isLoaded(): boolean {
    return this._promises.size > 0;
  }

  remove(promise: Key): void {
    if (this._promises.has(promise)) {
      this._promises.delete(promise);
      this._onStop();
    }
  }

  get(promise: Key): CancelablePromise | undefined {
    return this._promises.get(promise);
  }

  add<T extends CancelablePromise = CancelablePromise>(
    promise: T,
    name?: string | number | symbol,
  ): CancelablePromise<T> {
    const key = name ? name : promise;
    const exist = this._promises.get(key);
    if (this.options.onStart && !this.isLoaded) {
      this.options.onStart();
    }
    if (exist) {
      return exist;
    }
    this._promises.set(key, promise);
    promise.finally(() => {
      this.remove(key);
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
      this._promises.clear();
      this._onStop();
    }
  }

  waitFunc<T>(func: () => any, name = ''): CancelablePromise<T> {
    name = name || func.name;
    const exist = this.get(name);
    if (exist) {
      return exist;
    }
    return this.add(func(), name);
  }

  WaitForMe(name: string | symbol = ''): MethodDecorator {
    const get = this.get.bind(this);
    const add = this.add.bind(this);
    return function (
      target: unknown,
      key: string | symbol,
      descriptor: PropertyDescriptor,
    ): PropertyDescriptor {
      const originalMethod = descriptor.value;
      name = name || key;
      descriptor.value = function (...args: any[]) {
        const exist = get(name);
        if (exist) {
          return exist;
        }
        const result = add(originalMethod.apply(this, args), name);
        return result;
      };

      return descriptor;
    };
  }

  /** @deprecated use {@link PromiseControl.WaitForMe } instead */
  GetOrCreateDecorator(name: string | symbol = ''): MethodDecorator {
    return this.WaitForMe(name);
  }

  private _onStop(): void {
    if (this.options.onStop && !this.isLoaded) {
      this.options.onStop();
    }
  }
}
