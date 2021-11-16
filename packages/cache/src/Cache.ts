import { objectDeepEqual, objectRemoveEmpty, full } from '@nextgis/utils';

type CacheValue<T> = T;
type CacheMatchProps<T> = Record<keyof T, T[keyof T]>;

interface CacheItem<T = any, O = any> {
  key: string;
  value: CacheValue<T>;
  props?: CacheMatchProps<O>;
  /** @deprecated use {@link CacheItem.props} instead */
  options?: CacheMatchProps<O>;
}

export interface CacheOptions {
  /**
   * Cache Scope Separator
   * @defaultValue 'default'
   */
  namespace?: string;
}

/**
 * @example
 * ```javascript
 * const cache1 = new Cache();
 * cache1.add('foo', 'value');
 *
 * const cache2 = new Cache();
 * cache2.match('foo'); // value
 *
 * const cache3 = new Cache({ namespace: 'foo' });
 * cache3.match('foo'); // undefined
 * ```
 *
 * @example
 * ```javascript
 * let COUNTER = 0;
 * const createPromise = () => new Promise((res) => {
 *   COUNTER++
 *   setTimeout(() => res('Ok'), 300)
 * });
 *
 * const cache = new Cache();
 * for (let i = 0; i < 10; i++) {
 *   cache.add('foo', createPromise).then((data) => {
 *     console.log(data); // 'Ok'
 *   });
 * }
 * console.log(COUNTER); // 1
 * ```
 */
export class Cache<
  V = any,
  O extends Record<string, unknown> = Record<string, unknown>,
> {
  private static instance: Record<
    string,
    Cache<unknown, Record<string, unknown>>
  > = {};
  private readonly cache: CacheItem<V, O>[] = [];

  constructor(options: CacheOptions = {}) {
    const namespace = options.namespace ?? 'default';
    if (Cache.instance[namespace]) {
      return Cache.instance[namespace] as Cache<V, O>;
    }
    Cache.instance[namespace] = this;
    return this;
  }

  clean(): void {
    this.cache.length = 0;
  }

  all(): CacheItem<V, O>[] {
    return this.cache;
  }

  /**
   * Caching only a non-empty value.
   *
   * Useful for get or create strategy
   * @example
   * ```javascript
   * const cache = new Cache();
   * const getItemFunc = () => fetch(url).then((data) => {
   *  return data.json(); // undefined
   * });
   * const item = await cache.addFull('foo', getItemFunc);
   * if (!item) {
   *   await createItem(); // 'New item'
   * }
   *
   * // somewhere else in the code
   * const item = await cache.addFull('foo', getItemFunc).then((resp) => {
   *   console.log(resp); // 'New item'
   * })
   *
   * ```
   */
  addFull(
    key: string,
    valueToSet: CacheValue<V> | (() => CacheValue<V>),
    props?: CacheMatchProps<O>,
  ): CacheValue<V> {
    return this.add(key, valueToSet, props, true);
  }

  add(
    key: string,
    valueToSet: CacheValue<V> | (() => CacheValue<V>),
    props?: CacheMatchProps<O>,
    onlyFull?: boolean,
  ): CacheValue<V> {
    const exist = this._find(key, props);
    if (!exist) {
      let value: CacheValue<V>;
      if (valueToSet instanceof Function) {
        value = valueToSet();
      } else {
        value = valueToSet;
      }
      const props_ =
        props && JSON.parse(JSON.stringify(objectRemoveEmpty(props)));

      const cacheItem: CacheItem<V, O> = {
        key,
        value,
        props: props_,
        // TODO: remove backward compatibility use only props
        options: props_,
      };
      if (onlyFull && !full(value)) {
        return value;
      }
      this.cache.push(cacheItem);
      if (value instanceof Promise) {
        value.catch((er) => {
          this.delete(key, props);
          throw er;
        });
        if (onlyFull) {
          value.then((x) => {
            if (!full(x)) {
              this.delete(key, props);
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

  match(key: string, props?: CacheMatchProps<O>): CacheValue<V> | undefined {
    const cacheRecord = this._find(key, props);

    if (cacheRecord) {
      return cacheRecord.value;
    }
  }

  matchAll(key?: string, props?: CacheMatchProps<O>): CacheValue<V>[] {
    if (key) {
      return this.cache
        .filter((x) => this._filter(x, key, props))
        .map((x) => x.value);
    }
    return this.cache.map((x) => x.value);
  }

  delete(item: CacheItem): void;
  delete(key: string, props?: CacheMatchProps<O>): void;
  delete(keyOrItem: string | CacheItem, props?: CacheMatchProps<O>): void {
    let exist: CacheItem[] = [];
    if (typeof keyOrItem === 'string') {
      exist = this.cache.filter((x) => this._filter(x, keyOrItem, props));
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
    props?: CacheMatchProps<O>,
  ): CacheItem<V> | undefined {
    return this.cache.find((x) => this._filter(x, key, props));
  }

  private _filter(
    item: CacheItem,
    key: string,
    props?: CacheMatchProps<O>,
  ): boolean {
    if (item.key === key) {
      if (props) {
        // TODO: remove backward compatibility
        const itemProps = item.props || item.options;
        return objectDeepEqual(itemProps || {}, objectRemoveEmpty(props));
      }
      return true;
    }
    return false;
  }
}
