import type {
  ConsoleEngineOptions,
  LogEngine,
  LogOptions,
  LogShortcutOptions,
} from '../interfaces';

export class ConsoleEngine<D = null> implements LogEngine<D> {
  enabled = true;

  constructor(options: ConsoleEngineOptions = {}) {
    this.enabled = options.enabled ?? this.enabled;
    Object.assign(this, options);
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
  log(message: string, options: LogOptions<D> = {}) {
    if (this.enabled) {
      const level = options.logLevel ?? 'NOTSET';
      if (level === 'NOTSET' || level === 'INFO' || level === 'DEBUG') {
        console.log(message);
      } else if (level === 'WARNING') {
        console.warn(message);
      } else if (level === 'CRITICAL' || level === 'ERROR') {
        console.error(message);
      }
    }
  }
}
