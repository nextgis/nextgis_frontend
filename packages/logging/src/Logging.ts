import { isObject } from '@nextgis/utils';
import type {
  EachLog,
  LogEngine,
  LogOptions,
  LoggingOptions,
  LogShortcutOptions,
} from './interfaces';

export class Logging<D> implements LogEngine<D> {
  engines: LogEngine<D>[] = [];
  enabled = true;
  eachLog?: EachLog<D>;

  constructor(options: LoggingOptions) {
    this.engines = options.engines;
    this.enabled = options.enabled ?? this.enabled;
    this.eachLog = options.eachLog;
  }

  critical(message: string, options?: LogShortcutOptions<D>) {
    this.log(message, { ...options, logLevel: 'CRITICAL' });
  }
  error(message: string, options?: LogShortcutOptions<D>) {
    this.log(message, { ...options, logLevel: 'ERROR' });
  }
  warning(message: string, options?: LogShortcutOptions<D>) {
    this.log(message, { ...options, logLevel: 'WARNING' });
  }
  info(message: string, options?: LogShortcutOptions<D>) {
    this.log(message, { ...options, logLevel: 'INFO' });
  }
  debug(message: string, options?: LogShortcutOptions<D>) {
    this.log(message, { ...options, logLevel: 'DEBUG' });
  }
  log(message: string, options?: LogOptions<D>) {
    if (this.enabled) {
      let eachLog = this.eachLog;
      if (eachLog) {
        if (typeof eachLog === 'function') {
          eachLog = eachLog(message, options);
        }
        if (isObject(eachLog)) {
          const { message: message_, ...options_ } = eachLog;
          message = message_ || message;
          options = options_ || options;
        }
      }
      for (const e of this.engines) {
        e.log(message, options);
      }
    }
  }
}
