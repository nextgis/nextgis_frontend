import { WebMap } from '../WebMap';

export function onLoad(event: string) {
  return function (target: WebMap, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (this: WebMap, ...args: any[]) {

      return new Promise((resolve, reject) => {
        const _resolve = () => {
          const origin = originalMethod.apply(this, args);
          origin && origin.then ? origin.then(resolve).catch(reject) : resolve(origin);
        };
        const isLoaded = this.getEventStatus(event);
        if (isLoaded) {
          _resolve();
        } else {
          this.emitter.once(event, () => {
            _resolve();
          });
        }
      });
    };
    return descriptor;
  };
}
