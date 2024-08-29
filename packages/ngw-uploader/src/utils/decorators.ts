import { template } from './template';

import type { NgwUploader } from '../NgwUploader';
import type { AvailableStatus, EmitterStatus } from '../interfaces';
import type { CreatedResource } from '@nextgis/ngw-connector';

/**
 * decorator to emit events on start end and error for async methods
 */
export function evented(options?: {
  status: AvailableStatus;
  template?: string;
}) {
  return function actualDecorator(
    originalMethod: any,
    context: ClassMethodDecoratorContext,
  ) {
    function replacementMethod(this: NgwUploader, ...args: any[]) {
      let message = context.name as string;
      if (options) {
        if (options.template && typeof args[0] === 'object') {
          message = template(options.template, args[0]);
        }

        const eventBegin: EmitterStatus = {
          status: options.status,
          state: 'begin',
          message: `${message} start`,
          data: args[0],
        };
        this.emitter.emit('status:change', eventBegin);

        return originalMethod
          .apply(this, args)
          .then((resp: any) => {
            const eventEnd: EmitterStatus = {
              status: options.status,
              state: 'end',
              message: `${message} finish`,
              data: resp,
            };
            this.emitter.emit('status:change', eventEnd);
            return resp;
          })
          .catch((err: any) => {
            const eventError: EmitterStatus = {
              status: options.status,
              state: 'error',
              message: `${message} error`,
              data: err,
            };
            this.emitter.emit('status:change', eventError);
            throw err;
          });
      }
    }

    return replacementMethod;
  };
}

export function onLoad(originalMethod: any) {
  function replacementMethod(
    this: NgwUploader,
    ...args: any[]
  ): Promise<CreatedResource> {
    return new Promise((resolve, reject) => {
      if (this.isLoaded) {
        originalMethod.apply(this, args).then(resolve).catch(reject);
      } else {
        this.emitter.once('loaded', () => {
          originalMethod.apply(this, args).then(resolve).catch(reject);
        });
      }
    });
  }

  return replacementMethod;
}
