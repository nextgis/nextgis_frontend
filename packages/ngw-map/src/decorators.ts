import NgwMap from './index';

/**
 * decorator to run action only after map is created
 */
export function onMapLoad() {
  return onLoad('map:created');
}

export function onLoad(event: string) {
  return function (target: NgwMap, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const self: NgwMap = this;

      return new Promise((resolve, reject) => {
        const _resolve = () => {
          const origin = originalMethod.apply(this, args);
          origin && origin.then ? origin.then(resolve).catch(reject) : resolve(origin);
        };
        const isLoaded = self._eventsStatus[event] !== undefined ? self._eventsStatus[event] : false;
        if (isLoaded) {
          _resolve();
        } else {
          self.emitter.once(event, () => {
            _resolve();
          });
        }
      });
    };
    return descriptor;
  };
}
