import { WebMap } from '../WebMap';

export function onLoad(event: string) {
  return function (target: WebMap, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const self: WebMap = this;

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
            self._eventsStatus[event] = true;
            _resolve();
          });
        }
      });
    };
    return descriptor;
  };
}
