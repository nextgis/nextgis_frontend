import { template } from './template';

import type { NgwUploader } from '../NgwUploader';
import type { EmitterStatus, AvailableStatus } from '../interfaces';

/**
 * decorator to emit events on start end and error for async methods
 */
export function evented(options?: {
  status: AvailableStatus;
  template?: string;
}) {
  return function (
    target: NgwUploader,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;

    descriptor.value = function (this: NgwUploader, ...args: any[]) {
      let message = status || propertyKey;
      if (options) {
        if (options.template && typeof args[0] === 'object') {
          message = template(options.template, args[0]);
        }

        const eventBegin: EmitterStatus = {
          status: options.status,
          state: 'begin',
          message: message + ' start',
          data: args[0],
        };
        this.emitter.emit('status:change', eventBegin);

        return originalMethod
          .apply(this, args)
          .then((resp: any) => {
            const eventEnd: EmitterStatus = {
              status: options.status,
              state: 'end',
              message: message + ' finish',
              data: resp,
            };
            this.emitter.emit('status:change', eventEnd);
            return resp;
          })
          .catch((er: any) => {
            const eventError: EmitterStatus = {
              status: options.status,
              state: 'error',
              message: message + ' error',
              data: er,
            };
            this.emitter.emit('status:change', eventError);
            throw er;
          });
      }
    };
    return descriptor;
  };
}

/**
 * decorator to run action only after application is load
 */
export function onLoad() {
  return function (
    target: NgwUploader,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;

    descriptor.value = function (this: NgwUploader, ...args: any[]) {
      return new Promise((resolve, reject) => {
        if (this.isLoaded) {
          originalMethod.apply(this, args).then(resolve).catch(reject);
        } else {
          this.emitter.once('loaded', () => {
            originalMethod.apply(this, args).then(resolve).catch(reject);
          });
        }
      });
    };
    return descriptor;
  };
}
