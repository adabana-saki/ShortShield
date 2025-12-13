/**
 * Log entry types for tracking blocked content
 */

import type { Platform } from './settings';
import type { BlockingAction } from './rules';

/**
 * Log severity levels
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Log entry for a blocked content item
 */
export interface BlockLogEntry {
  readonly id: string;
  readonly timestamp: number;
  readonly platform: Platform;
  readonly url: string;
  readonly action: BlockingAction;
  readonly ruleId?: string;
  readonly elementInfo?: ElementInfo;
}

/**
 * Information about the blocked element
 */
export interface ElementInfo {
  readonly tagName: string;
  readonly className?: string;
  readonly id?: string;
  readonly selector?: string;
}

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

/**
 * Log storage container
 */
export interface LogStorage {
  readonly blockLogs: readonly BlockLogEntry[];
  readonly appLogs: readonly AppLogEntry[];
  readonly lastCleanup: number;
}

/**
 * Log filter options
 */
export interface LogFilter {
  readonly startDate?: number;
  readonly endDate?: number;
  readonly platform?: Platform;
  readonly action?: BlockingAction;
  readonly level?: LogLevel;
  readonly limit?: number;
}

/**
 * Type guard for BlockLogEntry
 */
export function isValidBlockLogEntry(value: unknown): value is BlockLogEntry {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const obj = value as Record<string, unknown>;
  const validPlatforms: Platform[] = ['youtube', 'tiktok', 'instagram'];
  const validActions: BlockingAction[] = ['hide', 'redirect', 'remove', 'blur'];

  return (
    typeof obj.id === 'string' &&
    typeof obj.timestamp === 'number' &&
    typeof obj.platform === 'string' &&
    validPlatforms.includes(obj.platform as Platform) &&
    typeof obj.url === 'string' &&
    typeof obj.action === 'string' &&
    validActions.includes(obj.action as BlockingAction)
  );
}
