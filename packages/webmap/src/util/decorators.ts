import { WebMap } from '../WebMap';
import { WebMapEvents } from '../interfaces/Events';

export function onLoad<E extends WebMapEvents = WebMapEvents>(event: keyof E) {
  return function(
    _target: WebMap,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function(
      this: WebMap<unknown, unknown, unknown, E>,
      ...args: unknown[]
    ) {
      return new Promise((resolve, reject) => {
        const _resolve = (): void => {
          const origin = originalMethod.apply(this, args);
          origin && origin.then
            ? origin.then(resolve).catch(reject)
            : resolve(origin);
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
