import NgwUploader, { EmitterStatus, AvailableStatus } from './ngw-uploader';
import { template } from './utils';

/**
 * decorator to emit events on start end and error for async methods
 * @param options
 */
export function evented(options?: { status: AvailableStatus; template?: string }) {
  return function (target: NgwUploader, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args) {
      let message = status || propertyKey;
      if (options && options.template && typeof args[0] === 'object') {
        message = template(options.template, args[0]);
      }

      const eventBegin: EmitterStatus = {
        status: options.status,
        state: 'begin',
        message: message + ' start',
        data: args[0]
      };
      this.emitter.emit('status:change', eventBegin);

      return originalMethod.apply(this, args).then((resp) => {
        const eventEnd: EmitterStatus = {
          status: options.status,
          state: 'end',
          message: message + ' finish',
          data: resp
        };
        this.emitter.emit('status:change', eventEnd);
        return resp;
      }).catch((er) => {
        const eventError: EmitterStatus = {
          status: options.status,
          state: 'error',
          message: message + ' error',
          data: er
        };
        this.emitter.emit('status:change', eventError);
        throw er;
      });
    };
    return descriptor;
  };
}

/**
 * decorator to run action only after application is load
 */
export function onLoad() {
  return function (target: NgwUploader, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args) {
      const self: NgwUploader = this;
      return new Promise((resolve, reject) => {
        if (self.isLoaded) {
          originalMethod.apply(this, args).then(resolve).catch(reject);
        } else {
          self.emitter.once('loaded', () => {
            originalMethod.apply(this, args).then(resolve).catch(reject);
          });
        }
      });
    };
    return descriptor;
  };
}
