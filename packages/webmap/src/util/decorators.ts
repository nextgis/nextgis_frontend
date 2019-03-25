import { WebMap } from '../WebMap';
import { WebMapEvents } from '../interfaces/Events';

export function onLoad<E extends WebMapEvents = WebMapEvents>(event: keyof E) {
  return function (target: WebMap, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (this: WebMap<any, any, any, E>, ...args: any[]) {

      return new Promise((resolve, reject) => {
        const _resolve = () => {
          const origin = originalMethod.apply(this, args);
          origin && origin.then ? origin.then(resolve).catch(reject) : resolve(origin);
        };
        const isLoaded = this.getEventStatus(event);
        if (isLoaded) {
          _resolve();
        } else {
          this.emitter.once(event as keyof WebMapEvents, () => {
            _resolve();
          });
        }
      });
    };
    return descriptor;
  };
}
