/**
 * Central export for all shared types
 */

// Settings types
export type {
  ChannelId,
  VideoId,
  WhitelistId,
  Platform,
  PlatformSettings,
  WhitelistType,
  WhitelistEntry,
  BlockingStats,
  UserPreferences,
  Settings,
  SettingsUpdate,
} from './settings';

export { isValidSettings, isValidWhitelistEntry } from './settings';

// Rules types
export type {
  DetectionMethod,
  BlockingAction,
  UrlRule,
  SelectorRule,
  AttributeRule,
  BlockingRule,
  PlatformRules,
  CustomRule,
} from './rules';

export { isValidBlockingRule } from './rules';

// Log types
export type {
  LogLevel,
  BlockLogEntry,
  ElementInfo,
  AppLogEntry,
  LogStorage,
  LogFilter,
} from './logs';

export { isValidBlockLogEntry } from './logs';

// Message types
export type {
  MessageType,
  Message,
  GetSettingsMessage,
  UpdateSettingsMessage,
  GetStatsMessage,
  LogBlockMessage,
  WhitelistAddMessage,
  WhitelistRemoveMessage,
  GetLogsMessage,
  ClearLogsMessage,
  PingMessage,
  MessageResponse,
  GetSettingsResponse,
  UpdateSettingsResponse,
  GetStatsResponse,
  LogBlockResponse,
  WhitelistAddResponse,
  WhitelistRemoveResponse,
  GetLogsResponse,
  ClearLogsResponse,
  PingResponse,
} from './messages';

export {
  MESSAGE_TYPES,
  isValidMessage,
  isMessageType,
  createMessage,
} from './messages';
