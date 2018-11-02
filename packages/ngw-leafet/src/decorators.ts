import NgwLeaflet from './ngw-leaflet';

/**
 * decorator to run action only after map is created
 */
export function onMapLoad() {
  return function (target: NgwLeaflet, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args) {
      const self: NgwLeaflet = this;
      if (self.isLoaded) {
        originalMethod.apply(this, args);
      } else {
        self.webMap.emitter.once('build-map', () => {
          originalMethod.apply(this, args);
        });
      }
    };
    return descriptor;
  };
}
