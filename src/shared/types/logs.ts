/**
 * Log types for application logging
 */

/**
 * Log severity levels
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * General application log entry
 */
export interface AppLogEntry {
  readonly id: string;
  readonly timestamp: number;
  readonly level: LogLevel;
  readonly namespace: string;
  readonly message: string;
  readonly context?: Readonly<Record<string, unknown>>;
}
