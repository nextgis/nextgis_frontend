import NgwConnector from '@nextgis/ngw-connector';
import type {
  Log,
  LogEngine,
  LogOptions,
  LogPostBulk,
  LogShortcutOptions,
  NgLogEngineOptions,
} from '../interfaces';

export class NgLogEngine<D = null> implements LogEngine<D> {
  clientId: string;
  delay = 3 * 1000;
  nglogUrl = 'https://nglog.nextgis.com';
  ngwConnector = new NgwConnector({});
  enabled = true;

  private _logQueue: Log<D>[] = [];
  private _stopTimer?: () => void;

  constructor(options: NgLogEngineOptions) {
    this.clientId = options.clientId;
    this.enabled = options.enabled ?? this.enabled;
    Object.assign(this, options);

    this._start();
  }

  destroy() {
    this._stop();
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
    this._logQueue.push({
      ...options,
      message,
      logLevel: options.logLevel || 'NOTSET',
      timestamp: new Date(),
    });
  }

  private _sendLogs() {
    const logs: Log<D>[] = [...this._logQueue];
    this._logQueue = [];
    if (logs.length) {
      const data: LogPostBulk = logs;
      const url = this.nglogUrl + '/api/log/' + this.clientId;
      this.ngwConnector
        .makeQuery(url, null, {
          method: 'POST',
          data,
          headers: { 'content-type': 'application/json' },
        })
        .catch(() => {
          this._logQueue = [...logs, ...this._logQueue];
        });
    }
  }

  private _stop() {
    if (this._stopTimer) {
      this._stopTimer();
      this._stopTimer = undefined;
    }
  }
  private _start() {
    this._stop();
    if (this.enabled) {
      const interval = setInterval(() => this._sendLogs(), this.delay);
      this._stopTimer = () => {
        clearInterval(interval);
      };
    }
  }
}
