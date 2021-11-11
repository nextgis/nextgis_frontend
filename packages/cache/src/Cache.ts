import { objectDeepEqual, objectRemoveEmpty, full } from '@nextgis/utils';

type CacheValue<T> = T;
type CacheOptions<T> = Record<keyof T, T[keyof T]>;

interface CacheItem<T = any, O = any> {
  key: string;
  value: CacheValue<T>;
  options?: CacheOptions<O>;
}

export class Cache<
  T = any,
  O extends Record<string, any> = Record<string, any>,
> {
  private static instance: Cache<any, any>;
  private readonly cache: CacheItem<T, O>[] = [];

  constructor() {
    if (Cache.instance) {
      return Cache.instance;
    }

    Cache.instance = this;

    return this;
  }

  clean(): void {
    this.cache.length = 0;
  }

  all(): CacheItem<T, O>[] {
    return this.cache;
  }

  addFull(
    key: string,
    valueToSet: CacheValue<T> | (() => CacheValue<T>),
    options?: CacheOptions<O>,
  ): CacheValue<T> {
    return this.add(key, valueToSet, options, true);
  }

  add(
    key: string,
    valueToSet: CacheValue<T> | (() => CacheValue<T>),
    options?: CacheOptions<O>,
    onlyFull?: boolean,
  ): CacheValue<T> {
    const exist = this._find(key, options);
    if (!exist) {
      let value: CacheValue<T>;
      if (valueToSet instanceof Function) {
        value = valueToSet();
      } else {
        value = valueToSet;
      }
      const options_ =
        options && JSON.parse(JSON.stringify(objectRemoveEmpty(options)));

      const cacheItem = {
        key,
        value,
        options: options_,
      } as CacheItem<T, O>;
      if (onlyFull && !full(value)) {
        return value;
      }
      this.cache.push(cacheItem);
      if (value instanceof Promise) {
        value.catch((er) => {
          this.delete(key, options);
          throw er;
        });
        if (onlyFull) {
          value.then((x) => {
            if (!full(x)) {
              this.delete(key, options);
            }
            return x;
          });
        }
        return value;
      }
      return value;
    } else {
      return exist.value;
    }
  }

  match(key: string, options?: CacheOptions<O>): CacheValue<T> | undefined {
    const cacheRecord = this._find(key, options);

    if (cacheRecord) {
      return cacheRecord.value;
    }
  }

  matchAll(key?: string, options?: CacheOptions<O>): CacheValue<T>[] {
    if (key) {
      return this.cache
        .filter((x) => this._filter(x, key, options))
        .map((x) => x.value);
    }
    return this.cache.map((x) => x.value);
  }

  delete(item: CacheItem): void;
  delete(key: string, options?: CacheOptions<O>): void;
  delete(keyOrItem: string | CacheItem, options?: CacheOptions<O>): void {
    let exist: CacheItem[] = [];
    if (typeof keyOrItem === 'string') {
      exist = this.cache.filter((x) => this._filter(x, keyOrItem, options));
    } else {
      exist.push(keyOrItem);
    }
    for (const e of exist) {
      const index = this.cache.indexOf(e);
      this.cache.splice(index, 1);
    }
  }

  private _find(
    key: string,
    options?: CacheOptions<O>,
  ): CacheItem<T> | undefined {
    return this.cache.find((x) => this._filter(x, key, options));
  }

  private _filter(
    item: CacheItem,
    key: string,
    options?: CacheOptions<O>,
  ): boolean {
    if (item.key === key) {
      if (options) {
        return objectDeepEqual(item.options || {}, objectRemoveEmpty(options));
      }
      return true;
    }
    return false;
  }
}
