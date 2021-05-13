// based on https://github.com/bvaughn/debounce-decorator

export function debounce<T extends (...args: any[]) => void>(
  cb: T,
  wait = 10,
): T & { clear: () => void } {
  let timeoutId: any;

  function wrapper(this: any, ...args: any[]) {
    wrapper.clear();

    timeoutId = setTimeout(() => {
      timeoutId = null;
      cb.apply(this, args);
    }, wait);
  }

  wrapper.clear = function () {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return wrapper as T & { clear: () => void };
}

export function DebounceDecorator(wait = 10) {
  return function (
    target: unknown,
    key: string,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    return {
      configurable: true,
      enumerable: descriptor.enumerable,
      get: function getter() {
        // Attach this function to the instance (not the class)
        Object.defineProperty(this, key, {
          configurable: true,
          enumerable: descriptor.enumerable,
          value: debounce(descriptor.value, wait),
        });
        // @ts-ignore
        return this[key];
      },
    };
  };
}
