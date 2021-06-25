import { objectDeepEqual } from '@nextgis/utils';

type CacheValue<T> = T;
type CacheOptions<T> = Record<keyof T, T[keyof T]>;

interface CacheItem<T extends any = any, O = any> {
  key: string;
  value: CacheValue<T>;
  options?: CacheOptions<O>;
}

export class Cache<
  T extends any = any,
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

  add(
    key: string,
    valueToSet: CacheValue<T> | (() => CacheValue<T>),
    options?: CacheOptions<O>,
  ): CacheValue<T> {
    const exist = this._find(key, options);
    if (!exist) {
      let value: CacheValue<T>;
      if (valueToSet instanceof Function) {
        value = valueToSet();
      } else {
        value = valueToSet;
      }
      const cacheItem = {
        key,
        value,
        options,
      } as CacheItem<T, O>;

      this.cache.push(cacheItem);
      if (value instanceof Promise) {
        value.catch((er) => {
          this.delete(key, options);
          throw er;
        });
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

  matchAll(key: string, options?: CacheOptions<O>): CacheValue<T>[] {
    return this.cache
      .filter((x) => this._filter(x, key, options))
      .map((x) => x.value);
  }

  delete(key: string, options?: CacheOptions<O>): void {
    const exist = this.cache.filter((x) => this._filter(x, key, options));
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
        return objectDeepEqual(item.options || {}, options);
      }
      return true;
    }
    return false;
  }
}
