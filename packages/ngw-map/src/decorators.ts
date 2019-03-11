import { NgwMap } from './NgwMap';

/**
 * Decorator to run action only after map is created
 */
export function onMapLoad() {
  return onLoad('map:created');
}

export function onLoad(event: string) {
  return function (target: NgwMap, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (this: NgwMap, ...args: any[]) {

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
