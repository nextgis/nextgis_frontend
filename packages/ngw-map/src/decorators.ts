import NgwMap from './ngw-map';

/**
 * decorator to run action only after map is created
 */
export function onMapLoad() {
  return function (target: NgwMap, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args) {
      const self: NgwMap = this;
      return new Promise((resolve, reject) => {
        if (self.isLoaded) {
          originalMethod.apply(this, args).then(resolve).catch(reject);
        } else {
          self.webMap.emitter.once('map:created', () => {
            originalMethod.apply(this, args).then(resolve).catch(reject);
          });
        }
      });
    };
    return descriptor;
  };
}
