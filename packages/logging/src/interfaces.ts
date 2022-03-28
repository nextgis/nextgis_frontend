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

export interface Log<D = unknown> {
  message: string;
  timestamp: Date;
  logLevel: LogLevel;
  operationId?: number;
  data?: D;
}

export type LogShortcutOptions<D = unknown> = Pick<
  Log<D>,
  'operationId' | 'data'
>;
export type LogOptions<D = unknown> = LogShortcutOptions<D> & {
  logLevel?: LogLevel;
};

export interface NgLogEngineOptions {
  clientId: string;
  /** Delay before sending collected logs */
  delay?: number;
  nglogUrl?: string;
  enabled?: boolean;
}

export type LogPostBulk = Log[];

export interface ConsoleEngineOptions {
  enabled?: boolean;
}
