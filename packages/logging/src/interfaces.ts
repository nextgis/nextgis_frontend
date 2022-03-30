export interface LogEngine<D = unknown> {
  enabled: boolean;
  critical: ShortcutLogFunc<D>;
  error: ShortcutLogFunc<D>;
  warning: ShortcutLogFunc<D>;
  info: ShortcutLogFunc<D>;
  debug: ShortcutLogFunc<D>;
  log: LogFunc<D>;
}

type ShortcutLogFunc<D = unknown> = (
  message: string,
  options?: LogShortcutOptions<D>,
) => void;
type LogFunc<D = unknown> = (message: string, options?: LogOptions<D>) => void;

export interface LoggingOptions {
  engines: LogEngine[];
  enabled?: boolean;
}

export type LogLevel =
  | 'CRITICAL'
  | 'ERROR'
  | 'WARNING'
  | 'INFO'
  | 'DEBUG'
  | 'NOTSET';

export interface Log<D = any> {
  message: string;
  timestamp: Date;
  logLevel: LogLevel;
  data?: D;
}

export type LogShortcutOptions<D = any> = Pick<Log<D>, 'data'>;

export interface NgLog<D = any> extends Log<D> {
  operationId?: string;
}

export type LogOptions<D = any> = LogShortcutOptions<D> & {
  logLevel?: LogLevel;
};

export type NgLogEngineOperationId<D = any> =
  | null
  | number
  | ((log: Log<D>) => string);

export interface NgLogEngineOptions {
  clientId: string;
  /** Delay before sending collected logs */
  delay?: number;
  nglogUrl?: string;
  enabled?: boolean;
  /**
   * Add `operationId` to each log. Use number to set random generated string length
   */
  operationId?: NgLogEngineOperationId;
  stopOnConnectionError?: boolean;
}

export type LogPostBulk = Log[];

export interface ConsoleEngineOptions {
  enabled?: boolean;
}
