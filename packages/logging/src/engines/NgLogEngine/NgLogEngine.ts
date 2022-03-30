import NgwConnector from '@nextgis/ngw-connector';
import type {
  Log,
  NgLog,
  LogEngine,
  LogOptions,
  LogPostBulk,
  LogShortcutOptions,
  NgLogEngineOptions,
  NgLogEngineOperationId,
} from '../../interfaces';
import { generateOperationId } from './utils/generateOperationId';

export class NgLogEngine<D = null> implements LogEngine<D> {
  clientId: string;
  delay = 5 * 1000;
  nglogUrl = 'https://nglog.nextgis.com';
  ngwConnector = new NgwConnector({});
  enabled = true;
  stopOnConnectionError?: false;

  /**
   * Add `operationId` to each log. Use number to set random generated string length
   */
  operationId: NgLogEngineOperationId<D> = 8;

  private _logQueue: NgLog<D>[] = [];
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
    const operationId = this.operationId;
    const ngLog: NgLog<D> = {
      ...options,
      message,
      logLevel: options.logLevel || 'NOTSET',
      timestamp: new Date(),
    };
    if (operationId) {
      if (typeof operationId === 'function') {
        ngLog.operationId = operationId(ngLog);
      } else if (typeof operationId === 'number') {
        ngLog.operationId = generateOperationId(operationId);
      }
    }

    this._logQueue.push(ngLog);
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
          if (this.stopOnConnectionError) {
            this._stop();
          }
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
