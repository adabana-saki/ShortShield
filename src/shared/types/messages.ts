/**
 * Message passing types for extension communication
 * Secure message passing between background, content scripts, and UI
 */

import type { Settings, SettingsUpdate, WhitelistEntry } from './settings';
import type { BlockLogEntry } from './logs';
import type { Platform } from './settings';

/**
 * All allowed message types (whitelist approach for security)
 */
export const MESSAGE_TYPES = [
  'GET_SETTINGS',
  'UPDATE_SETTINGS',
  'GET_STATS',
  'LOG_BLOCK',
  'WHITELIST_ADD',
  'WHITELIST_REMOVE',
  'GET_LOGS',
  'CLEAR_LOGS',
  'PING',
] as const;

export type MessageType = (typeof MESSAGE_TYPES)[number];

/**
 * Base message structure
 */
interface BaseMessage<T extends MessageType> {
  readonly type: T;
  readonly timestamp: number;
}

/**
 * GET_SETTINGS message
 */
export interface GetSettingsMessage extends BaseMessage<'GET_SETTINGS'> {
  readonly type: 'GET_SETTINGS';
}

/**
 * UPDATE_SETTINGS message
 */
export interface UpdateSettingsMessage extends BaseMessage<'UPDATE_SETTINGS'> {
  readonly type: 'UPDATE_SETTINGS';
  readonly payload: SettingsUpdate;
}

/**
 * GET_STATS message
 */
export interface GetStatsMessage extends BaseMessage<'GET_STATS'> {
  readonly type: 'GET_STATS';
}

/**
 * LOG_BLOCK message
 */
export interface LogBlockMessage extends BaseMessage<'LOG_BLOCK'> {
  readonly type: 'LOG_BLOCK';
  readonly payload: {
    readonly platform: Platform;
    readonly url: string;
    readonly action: string;
    readonly elementInfo?: {
      readonly tagName: string;
      readonly className?: string;
    };
  };
}

/**
 * WHITELIST_ADD message
 */
export interface WhitelistAddMessage extends BaseMessage<'WHITELIST_ADD'> {
  readonly type: 'WHITELIST_ADD';
  readonly payload: Omit<WhitelistEntry, 'id' | 'createdAt'>;
}

/**
 * WHITELIST_REMOVE message
 */
export interface WhitelistRemoveMessage extends BaseMessage<'WHITELIST_REMOVE'> {
  readonly type: 'WHITELIST_REMOVE';
  readonly payload: {
    readonly id: string;
  };
}

/**
 * GET_LOGS message
 */
export interface GetLogsMessage extends BaseMessage<'GET_LOGS'> {
  readonly type: 'GET_LOGS';
  readonly payload?: {
    readonly limit?: number;
    readonly platform?: Platform;
  };
}

/**
 * CLEAR_LOGS message
 */
export interface ClearLogsMessage extends BaseMessage<'CLEAR_LOGS'> {
  readonly type: 'CLEAR_LOGS';
}

/**
 * PING message for health check
 */
export interface PingMessage extends BaseMessage<'PING'> {
  readonly type: 'PING';
}

/**
 * Union type for all messages
 */
export type Message =
  | GetSettingsMessage
  | UpdateSettingsMessage
  | GetStatsMessage
  | LogBlockMessage
  | WhitelistAddMessage
  | WhitelistRemoveMessage
  | GetLogsMessage
  | ClearLogsMessage
  | PingMessage;

/**
 * Response structure
 */
export interface MessageResponse<T = unknown> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: string;
}

/**
 * Specific response types
 */
export type GetSettingsResponse = MessageResponse<Settings>;
export type UpdateSettingsResponse = MessageResponse<Settings>;
export type GetStatsResponse = MessageResponse<Settings['stats']>;
export type LogBlockResponse = MessageResponse<void>;
export type WhitelistAddResponse = MessageResponse<WhitelistEntry>;
export type WhitelistRemoveResponse = MessageResponse<void>;
export type GetLogsResponse = MessageResponse<readonly BlockLogEntry[]>;
export type ClearLogsResponse = MessageResponse<void>;
export type PingResponse = MessageResponse<{ readonly pong: true }>;

/**
 * Type guard for Message validation
 */
export function isValidMessage(value: unknown): value is Message {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const obj = value as Record<string, unknown>;

  return (
    typeof obj.type === 'string' &&
    MESSAGE_TYPES.includes(obj.type as MessageType) &&
    typeof obj.timestamp === 'number'
  );
}

/**
 * Type guard for specific message type
 */
export function isMessageType<T extends MessageType>(
  message: Message,
  type: T
): message is Extract<Message, { type: T }> {
  return message.type === type;
}

/**
 * Create a message with timestamp
 */
export function createMessage<T extends Message>(
  message: Omit<T, 'timestamp'>
): T {
  return {
    ...message,
    timestamp: Date.now(),
  } as T;
}
