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

export type EachLog<D = any> =
  | Log<D>
  | ((message: string, options?: LogOptions<D>) => Log<D>);

export interface LoggingOptions<D = any> {
  engines: LogEngine[];
  enabled?: boolean;
  eachLog?: EachLog;
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
  operationId?: string;
  duration?: number;
  data?: D;
}

export type LogShortcutOptions<D = any> = Pick<
  Log<D>,
  'data' | 'operationId' | 'duration'
>;

export interface NgLog<D = any> extends Log<D> {
  sessionId?: string;
}

export type LogOptions<D = any> = LogShortcutOptions<D> & {
  logLevel?: LogLevel;
};

export type NgLogEngineSessionId<D = any> =
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
   * Add `sessionId` to each log. Use number to set random generated string length
   */
  sessionId?: NgLogEngineSessionId;
  stopOnConnectionError?: boolean;
}

export type LogPostBulk = Log[];

export interface ConsoleEngineOptions {
  enabled?: boolean;
}
