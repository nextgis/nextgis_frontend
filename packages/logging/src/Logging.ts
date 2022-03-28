import type {
  LogEngine,
  LogOptions,
  LoggingOptions,
  LogShortcutOptions,
} from './interfaces';

export class Logging<D = null> implements LogEngine<D> {
  engines: LogEngine<D>[] = [];
  enabled = true;

  constructor(options: LoggingOptions) {
    this.engines = options.engines;
    this.enabled = options.enabled ?? this.enabled;
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
      for (const e of this.engines) {
        e.log(message, options);
      }
    }
  }
}
