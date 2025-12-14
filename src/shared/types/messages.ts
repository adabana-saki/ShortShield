/**
 * Message passing types for extension communication
 * Secure message passing between background, content scripts, and UI
 */

import type {
  Settings,
  SettingsUpdate,
  WhitelistEntry,
  FocusDuration,
  FocusModeState,
  PomodoroState,
  TimeLimitsState,
  SiteTimeUsage,
  TimeTrackingState,
  StreakData,
  ChallengeData,
  ChallengeState,
  LockdownState,
} from './settings';
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
  'PING',
  // Focus mode messages
  'FOCUS_START',
  'FOCUS_CANCEL',
  'FOCUS_GET_STATE',
  'FOCUS_EXTEND',
  // Pomodoro messages
  'POMODORO_START',
  'POMODORO_PAUSE',
  'POMODORO_RESUME',
  'POMODORO_STOP',
  'POMODORO_SKIP',
  'POMODORO_GET_STATE',
  // Time limits messages
  'TIME_TRACK_ACTIVITY',
  'TIME_GET_USAGE',
  'TIME_RESET_USAGE',
  'TIME_CHECK_LIMIT',
  // Time tracking history messages
  'TIME_GET_HISTORY',
  'TIME_CLEAR_HISTORY',
  // Streak tracking messages
  'STREAK_GET_DATA',
  'STREAK_RESET',
  'STREAK_CHECK_DAY',
  // Challenge mode messages
  'CHALLENGE_REQUEST',
  'CHALLENGE_SUBMIT',
  'CHALLENGE_GET_STATE',
  // Lockdown mode messages
  'LOCKDOWN_SET_PIN',
  'LOCKDOWN_VERIFY_PIN',
  'LOCKDOWN_ACTIVATE',
  'LOCKDOWN_DEACTIVATE',
  'LOCKDOWN_GET_STATE',
  'LOCKDOWN_REQUEST_EMERGENCY_BYPASS',
  'LOCKDOWN_CHECK_EMERGENCY_BYPASS',
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
 * PING message for health check
 */
export interface PingMessage extends BaseMessage<'PING'> {
  readonly type: 'PING';
}

/**
 * FOCUS_START message to begin a focus session
 */
export interface FocusStartMessage extends BaseMessage<'FOCUS_START'> {
  readonly type: 'FOCUS_START';
  readonly payload: {
    readonly duration: FocusDuration;
  };
}

/**
 * FOCUS_CANCEL message to end a focus session early
 */
export interface FocusCancelMessage extends BaseMessage<'FOCUS_CANCEL'> {
  readonly type: 'FOCUS_CANCEL';
}

/**
 * FOCUS_GET_STATE message to retrieve current focus state
 */
export interface FocusGetStateMessage extends BaseMessage<'FOCUS_GET_STATE'> {
  readonly type: 'FOCUS_GET_STATE';
}

/**
 * FOCUS_EXTEND message to add more time to current session
 */
export interface FocusExtendMessage extends BaseMessage<'FOCUS_EXTEND'> {
  readonly type: 'FOCUS_EXTEND';
  readonly payload: {
    readonly additionalMinutes: number;
  };
}

/**
 * POMODORO_START message to begin a pomodoro session
 */
export interface PomodoroStartMessage extends BaseMessage<'POMODORO_START'> {
  readonly type: 'POMODORO_START';
  readonly payload: {
    readonly mode: 'work' | 'break' | 'longBreak';
  };
}

/**
 * POMODORO_PAUSE message to pause the timer
 */
export interface PomodoroPauseMessage extends BaseMessage<'POMODORO_PAUSE'> {
  readonly type: 'POMODORO_PAUSE';
}

/**
 * POMODORO_RESUME message to resume a paused timer
 */
export interface PomodoroResumeMessage extends BaseMessage<'POMODORO_RESUME'> {
  readonly type: 'POMODORO_RESUME';
}

/**
 * POMODORO_STOP message to stop and reset the timer
 */
export interface PomodoroStopMessage extends BaseMessage<'POMODORO_STOP'> {
  readonly type: 'POMODORO_STOP';
}

/**
 * POMODORO_SKIP message to skip to the next session
 */
export interface PomodoroSkipMessage extends BaseMessage<'POMODORO_SKIP'> {
  readonly type: 'POMODORO_SKIP';
}

/**
 * POMODORO_GET_STATE message to get the current timer state
 */
export interface PomodoroGetStateMessage extends BaseMessage<'POMODORO_GET_STATE'> {
  readonly type: 'POMODORO_GET_STATE';
}

/**
 * TIME_TRACK_ACTIVITY message to record time spent on a platform
 */
export interface TimeTrackActivityMessage extends BaseMessage<'TIME_TRACK_ACTIVITY'> {
  readonly type: 'TIME_TRACK_ACTIVITY';
  readonly payload: {
    readonly platform: Platform;
    readonly durationMs: number;
  };
}

/**
 * TIME_GET_USAGE message to get current usage data
 */
export interface TimeGetUsageMessage extends BaseMessage<'TIME_GET_USAGE'> {
  readonly type: 'TIME_GET_USAGE';
  readonly payload?: {
    readonly platform?: Platform;
  };
}

/**
 * TIME_RESET_USAGE message to reset usage data
 */
export interface TimeResetUsageMessage extends BaseMessage<'TIME_RESET_USAGE'> {
  readonly type: 'TIME_RESET_USAGE';
  readonly payload?: {
    readonly platform?: Platform; // If not provided, reset all
  };
}

/**
 * TIME_CHECK_LIMIT message to check if a platform's limit is reached
 */
export interface TimeCheckLimitMessage extends BaseMessage<'TIME_CHECK_LIMIT'> {
  readonly type: 'TIME_CHECK_LIMIT';
  readonly payload: {
    readonly platform: Platform;
  };
}

/**
 * TIME_GET_HISTORY message to get time tracking history
 */
export interface TimeGetHistoryMessage extends BaseMessage<'TIME_GET_HISTORY'> {
  readonly type: 'TIME_GET_HISTORY';
  readonly payload?: {
    readonly days?: number; // Number of days to retrieve (default: all within retention)
  };
}

/**
 * TIME_CLEAR_HISTORY message to clear time tracking history
 */
export interface TimeClearHistoryMessage extends BaseMessage<'TIME_CLEAR_HISTORY'> {
  readonly type: 'TIME_CLEAR_HISTORY';
}

/**
 * STREAK_GET_DATA message to get current streak data
 */
export interface StreakGetDataMessage extends BaseMessage<'STREAK_GET_DATA'> {
  readonly type: 'STREAK_GET_DATA';
}

/**
 * STREAK_RESET message to reset streak data
 */
export interface StreakResetMessage extends BaseMessage<'STREAK_RESET'> {
  readonly type: 'STREAK_RESET';
}

/**
 * STREAK_CHECK_DAY message to check and update today's streak status
 */
export interface StreakCheckDayMessage extends BaseMessage<'STREAK_CHECK_DAY'> {
  readonly type: 'STREAK_CHECK_DAY';
}

/**
 * CHALLENGE_REQUEST message to request a new challenge for bypass
 */
export interface ChallengeRequestMessage extends BaseMessage<'CHALLENGE_REQUEST'> {
  readonly type: 'CHALLENGE_REQUEST';
}

/**
 * CHALLENGE_SUBMIT message to submit a challenge answer
 */
export interface ChallengeSubmitMessage extends BaseMessage<'CHALLENGE_SUBMIT'> {
  readonly type: 'CHALLENGE_SUBMIT';
  readonly payload: {
    readonly answer: string;
  };
}

/**
 * CHALLENGE_GET_STATE message to get current challenge state
 */
export interface ChallengeGetStateMessage extends BaseMessage<'CHALLENGE_GET_STATE'> {
  readonly type: 'CHALLENGE_GET_STATE';
}

/**
 * LOCKDOWN_SET_PIN message to set or update the lockdown PIN
 */
export interface LockdownSetPinMessage extends BaseMessage<'LOCKDOWN_SET_PIN'> {
  readonly type: 'LOCKDOWN_SET_PIN';
  readonly payload: {
    readonly pin: string;
    readonly currentPin?: string; // Required if PIN already exists
  };
}

/**
 * LOCKDOWN_VERIFY_PIN message to verify a PIN
 */
export interface LockdownVerifyPinMessage extends BaseMessage<'LOCKDOWN_VERIFY_PIN'> {
  readonly type: 'LOCKDOWN_VERIFY_PIN';
  readonly payload: {
    readonly pin: string;
  };
}

/**
 * LOCKDOWN_ACTIVATE message to activate lockdown mode
 */
export interface LockdownActivateMessage extends BaseMessage<'LOCKDOWN_ACTIVATE'> {
  readonly type: 'LOCKDOWN_ACTIVATE';
  readonly payload: {
    readonly pin: string;
  };
}

/**
 * LOCKDOWN_DEACTIVATE message to deactivate lockdown mode
 */
export interface LockdownDeactivateMessage extends BaseMessage<'LOCKDOWN_DEACTIVATE'> {
  readonly type: 'LOCKDOWN_DEACTIVATE';
  readonly payload: {
    readonly pin: string;
  };
}

/**
 * LOCKDOWN_GET_STATE message to get current lockdown state
 */
export interface LockdownGetStateMessage extends BaseMessage<'LOCKDOWN_GET_STATE'> {
  readonly type: 'LOCKDOWN_GET_STATE';
}

/**
 * LOCKDOWN_REQUEST_EMERGENCY_BYPASS message to request emergency bypass
 */
export interface LockdownRequestEmergencyBypassMessage extends BaseMessage<'LOCKDOWN_REQUEST_EMERGENCY_BYPASS'> {
  readonly type: 'LOCKDOWN_REQUEST_EMERGENCY_BYPASS';
}

/**
 * LOCKDOWN_CHECK_EMERGENCY_BYPASS message to check if emergency bypass is ready
 */
export interface LockdownCheckEmergencyBypassMessage extends BaseMessage<'LOCKDOWN_CHECK_EMERGENCY_BYPASS'> {
  readonly type: 'LOCKDOWN_CHECK_EMERGENCY_BYPASS';
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
  | PingMessage
  | FocusStartMessage
  | FocusCancelMessage
  | FocusGetStateMessage
  | FocusExtendMessage
  | PomodoroStartMessage
  | PomodoroPauseMessage
  | PomodoroResumeMessage
  | PomodoroStopMessage
  | PomodoroSkipMessage
  | PomodoroGetStateMessage
  | TimeTrackActivityMessage
  | TimeGetUsageMessage
  | TimeResetUsageMessage
  | TimeCheckLimitMessage
  | TimeGetHistoryMessage
  | TimeClearHistoryMessage
  | StreakGetDataMessage
  | StreakResetMessage
  | StreakCheckDayMessage
  | ChallengeRequestMessage
  | ChallengeSubmitMessage
  | ChallengeGetStateMessage
  | LockdownSetPinMessage
  | LockdownVerifyPinMessage
  | LockdownActivateMessage
  | LockdownDeactivateMessage
  | LockdownGetStateMessage
  | LockdownRequestEmergencyBypassMessage
  | LockdownCheckEmergencyBypassMessage;

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
export type PingResponse = MessageResponse<{ readonly pong: true }>;
export type FocusStartResponse = MessageResponse<FocusModeState>;
export type FocusCancelResponse = MessageResponse<FocusModeState>;
export type FocusGetStateResponse = MessageResponse<FocusModeState>;
export type FocusExtendResponse = MessageResponse<FocusModeState>;
export type PomodoroStartResponse = MessageResponse<PomodoroState>;
export type PomodoroPauseResponse = MessageResponse<PomodoroState>;
export type PomodoroResumeResponse = MessageResponse<PomodoroState>;
export type PomodoroStopResponse = MessageResponse<PomodoroState>;
export type PomodoroSkipResponse = MessageResponse<PomodoroState>;
export type PomodoroGetStateResponse = MessageResponse<PomodoroState>;
export type TimeTrackActivityResponse = MessageResponse<SiteTimeUsage>;
export type TimeGetUsageResponse = MessageResponse<TimeLimitsState>;
export type TimeResetUsageResponse = MessageResponse<TimeLimitsState>;

/**
 * Time check limit result
 */
export interface TimeCheckLimitResult {
  readonly platform: Platform;
  readonly limitReached: boolean;
  readonly usedMs: number;
  readonly limitMs: number;
  readonly remainingMs: number;
  readonly percentUsed: number;
}

export type TimeCheckLimitResponse = MessageResponse<TimeCheckLimitResult>;
export type TimeGetHistoryResponse = MessageResponse<TimeTrackingState>;
export type TimeClearHistoryResponse = MessageResponse<TimeTrackingState>;
export type StreakGetDataResponse = MessageResponse<StreakData>;
export type StreakResetResponse = MessageResponse<StreakData>;
export type StreakCheckDayResponse = MessageResponse<StreakData>;

/**
 * Challenge submit result
 */
export interface ChallengeSubmitResult {
  readonly correct: boolean;
  readonly bypassGranted: boolean;
  readonly bypassDurationSeconds: number;
  readonly newState: ChallengeState;
}

export type ChallengeRequestResponse = MessageResponse<ChallengeData>;
export type ChallengeSubmitResponse = MessageResponse<ChallengeSubmitResult>;
export type ChallengeGetStateResponse = MessageResponse<ChallengeState>;

/**
 * Lockdown PIN verification result
 */
export interface LockdownVerifyPinResult {
  readonly valid: boolean;
}

/**
 * Emergency bypass check result
 */
export interface EmergencyBypassCheckResult {
  readonly requested: boolean;
  readonly ready: boolean;
  readonly remainingSeconds: number;
}

export type LockdownSetPinResponse = MessageResponse<void>;
export type LockdownVerifyPinResponse = MessageResponse<LockdownVerifyPinResult>;
export type LockdownActivateResponse = MessageResponse<LockdownState>;
export type LockdownDeactivateResponse = MessageResponse<LockdownState>;
export type LockdownGetStateResponse = MessageResponse<LockdownState>;
export type LockdownRequestEmergencyBypassResponse = MessageResponse<LockdownState>;
export type LockdownCheckEmergencyBypassResponse = MessageResponse<EmergencyBypassCheckResult>;

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
