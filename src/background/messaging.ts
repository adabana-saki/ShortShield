/**
 * Secure message passing handler for extension communication
 * Security: Validates sender, message type whitelist, and payload validation
 */

import browser from 'webextension-polyfill';
import type {
  Message,
  MessageResponse,
  GetSettingsResponse,
  UpdateSettingsResponse,
  GetStatsResponse,
  LogBlockResponse,
  WhitelistAddResponse,
  WhitelistRemoveResponse,
  PingResponse,
  FocusStartResponse,
  FocusCancelResponse,
  FocusGetStateResponse,
  FocusExtendResponse,
  PomodoroStartResponse,
  PomodoroPauseResponse,
  PomodoroResumeResponse,
  PomodoroStopResponse,
  PomodoroSkipResponse,
  PomodoroGetStateResponse,
  TimeTrackActivityResponse,
  TimeGetUsageResponse,
  TimeResetUsageResponse,
  TimeCheckLimitResponse,
  TimeGetHistoryResponse,
  TimeClearHistoryResponse,
  StreakGetDataResponse,
  StreakResetResponse,
  StreakCheckDayResponse,
  ChallengeRequestResponse,
  ChallengeSubmitResponse,
  ChallengeGetStateResponse,
  LockdownSetPinResponse,
  LockdownVerifyPinResponse,
  LockdownActivateResponse,
  LockdownDeactivateResponse,
  LockdownGetStateResponse,
  LockdownRequestEmergencyBypassResponse,
  LockdownCheckEmergencyBypassResponse,
  WhitelistEntry,
  WhitelistId,
} from '@/shared/types';
import { isValidMessage, isMessageType } from '@/shared/types';
import { getSettings, updateSettings } from '@/shared/utils';
import { createLogger } from '@/shared/utils/logger';
import { validateWhitelistInput } from '@/shared/utils/validation';
import {
  getFocusState,
  startFocusMode,
  cancelFocusMode,
  extendFocusMode,
  getPomodoroState,
  startPomodoro,
  pausePomodoro,
  resumePomodoro,
  stopPomodoro,
  skipPomodoro,
  trackTimeActivity,
  getTimeLimitsState,
  resetTimeUsage,
  checkTimeLimit,
  getTimeTrackingHistory,
  clearTimeTrackingHistory,
  getStreakData,
  resetStreakData,
  checkStreakDay,
  getChallengeState,
  requestChallenge,
  submitChallengeAnswer,
  getLockdownState,
  setLockdownPin,
  verifyLockdownPin,
  activateLockdown,
  deactivateLockdown,
  requestEmergencyBypass,
  checkEmergencyBypass,
} from './timers';

const logger = createLogger('messaging');

/**
 * Validate that the message sender is from our extension
 */
function isValidSender(sender: browser.Runtime.MessageSender): boolean {
  // Must have an ID
  if (sender.id === undefined || sender.id === '') {
    return false;
  }

  // Must match our extension ID
  if (sender.id !== browser.runtime.id) {
    return false;
  }

  return true;
}

/**
 * Generate unique ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Handle GET_SETTINGS message
 */
async function handleGetSettings(): Promise<GetSettingsResponse> {
  try {
    const settings = await getSettings();
    return { success: true, data: settings };
  } catch (error) {
    logger.error('Failed to get settings', { error: String(error) });
    return { success: false, error: 'Failed to get settings' };
  }
}

/**
 * Handle UPDATE_SETTINGS message
 */
async function handleUpdateSettings(
  message: Extract<Message, { type: 'UPDATE_SETTINGS' }>
): Promise<UpdateSettingsResponse> {
  try {
    const settings = await updateSettings(message.payload);
    return { success: true, data: settings };
  } catch (error) {
    logger.error('Failed to update settings', { error: String(error) });
    return { success: false, error: 'Failed to update settings' };
  }
}

/**
 * Handle GET_STATS message
 */
async function handleGetStats(): Promise<GetStatsResponse> {
  try {
    const settings = await getSettings();
    return { success: true, data: settings.stats };
  } catch (error) {
    logger.error('Failed to get stats', { error: String(error) });
    return { success: false, error: 'Failed to get stats' };
  }
}

/**
 * Handle LOG_BLOCK message - updates stats only
 */
async function handleLogBlock(
  message: Extract<Message, { type: 'LOG_BLOCK' }>
): Promise<LogBlockResponse> {
  try {
    // Update stats
    const settings = await getSettings();
    const today = new Date().toISOString().split('T')[0] ?? '';

    const isNewDay = settings.stats.lastResetDate !== today;

    await updateSettings({
      stats: {
        blockedToday: isNewDay ? 1 : settings.stats.blockedToday + 1,
        blockedTotal: settings.stats.blockedTotal + 1,
        lastResetDate: today,
        byPlatform: {
          ...settings.stats.byPlatform,
          [message.payload.platform]:
            (settings.stats.byPlatform[message.payload.platform] ?? 0) + 1,
        },
      },
    });

    return { success: true };
  } catch (error) {
    logger.error('Failed to log block', { error: String(error) });
    return { success: false, error: 'Failed to log block' };
  }
}

/**
 * Handle WHITELIST_ADD message
 */
async function handleWhitelistAdd(
  message: Extract<Message, { type: 'WHITELIST_ADD' }>
): Promise<WhitelistAddResponse> {
  try {
    // Validate input
    const validation = validateWhitelistInput({
      type: message.payload.type,
      value: message.payload.value,
      platform: message.payload.platform,
    });

    if (!validation.valid || !validation.sanitized) {
      return { success: false, error: validation.error ?? 'Invalid input' };
    }

    const settings = await getSettings();

    // Check for duplicates
    const exists = settings.whitelist.some(
      (entry) =>
        entry.type === validation.sanitized?.type &&
        entry.value === validation.sanitized?.value &&
        entry.platform === validation.sanitized?.platform
    );

    if (exists) {
      return { success: false, error: 'Entry already exists' };
    }

    const newEntry: WhitelistEntry = {
      id: generateId() as WhitelistId,
      type: validation.sanitized.type,
      value: validation.sanitized.value,
      platform: validation.sanitized.platform,
      createdAt: Date.now(),
      description: message.payload.description,
    };

    await updateSettings({
      whitelist: [...settings.whitelist, newEntry] as WhitelistEntry[],
    } as unknown as Parameters<typeof updateSettings>[0]);

    return { success: true, data: newEntry };
  } catch (error) {
    logger.error('Failed to add whitelist entry', { error: String(error) });
    return { success: false, error: 'Failed to add whitelist entry' };
  }
}

/**
 * Handle WHITELIST_REMOVE message
 */
async function handleWhitelistRemove(
  message: Extract<Message, { type: 'WHITELIST_REMOVE' }>
): Promise<WhitelistRemoveResponse> {
  try {
    const settings = await getSettings();
    const filtered = settings.whitelist.filter(
      (entry) => entry.id !== message.payload.id
    );

    if (filtered.length === settings.whitelist.length) {
      return { success: false, error: 'Entry not found' };
    }

    await updateSettings({
      whitelist: filtered,
    });

    return { success: true };
  } catch (error) {
    logger.error('Failed to remove whitelist entry', { error: String(error) });
    return { success: false, error: 'Failed to remove whitelist entry' };
  }
}

/**
 * Handle PING message
 */
function handlePing(): PingResponse {
  return { success: true, data: { pong: true } };
}

/**
 * Handle FOCUS_START message
 */
async function handleFocusStart(
  message: Extract<Message, { type: 'FOCUS_START' }>
): Promise<FocusStartResponse> {
  try {
    const state = await startFocusMode(message.payload.duration);
    return { success: true, data: state };
  } catch (error) {
    logger.error('Failed to start focus mode', { error: String(error) });
    return { success: false, error: String(error) };
  }
}

/**
 * Handle FOCUS_CANCEL message
 */
async function handleFocusCancel(): Promise<FocusCancelResponse> {
  try {
    const state = await cancelFocusMode();
    return { success: true, data: state };
  } catch (error) {
    logger.error('Failed to cancel focus mode', { error: String(error) });
    return { success: false, error: String(error) };
  }
}

/**
 * Handle FOCUS_GET_STATE message
 */
async function handleFocusGetState(): Promise<FocusGetStateResponse> {
  try {
    const state = await getFocusState();
    return { success: true, data: state };
  } catch (error) {
    logger.error('Failed to get focus state', { error: String(error) });
    return { success: false, error: String(error) };
  }
}

/**
 * Handle FOCUS_EXTEND message
 */
async function handleFocusExtend(
  message: Extract<Message, { type: 'FOCUS_EXTEND' }>
): Promise<FocusExtendResponse> {
  try {
    const state = await extendFocusMode(message.payload.additionalMinutes);
    return { success: true, data: state };
  } catch (error) {
    logger.error('Failed to extend focus mode', { error: String(error) });
    return { success: false, error: String(error) };
  }
}

/**
 * Handle POMODORO_START message
 */
async function handlePomodoroStart(
  message: Extract<Message, { type: 'POMODORO_START' }>
): Promise<PomodoroStartResponse> {
  try {
    const state = await startPomodoro(message.payload.mode);
    return { success: true, data: state };
  } catch (error) {
    logger.error('Failed to start pomodoro', { error: String(error) });
    return { success: false, error: String(error) };
  }
}

/**
 * Handle POMODORO_PAUSE message
 */
async function handlePomodoroPause(): Promise<PomodoroPauseResponse> {
  try {
    const state = await pausePomodoro();
    return { success: true, data: state };
  } catch (error) {
    logger.error('Failed to pause pomodoro', { error: String(error) });
    return { success: false, error: String(error) };
  }
}

/**
 * Handle POMODORO_RESUME message
 */
async function handlePomodoroResume(): Promise<PomodoroResumeResponse> {
  try {
    const state = await resumePomodoro();
    return { success: true, data: state };
  } catch (error) {
    logger.error('Failed to resume pomodoro', { error: String(error) });
    return { success: false, error: String(error) };
  }
}

/**
 * Handle POMODORO_STOP message
 */
async function handlePomodoroStop(): Promise<PomodoroStopResponse> {
  try {
    const state = await stopPomodoro();
    return { success: true, data: state };
  } catch (error) {
    logger.error('Failed to stop pomodoro', { error: String(error) });
    return { success: false, error: String(error) };
  }
}

/**
 * Handle POMODORO_SKIP message
 */
async function handlePomodoroSkip(): Promise<PomodoroSkipResponse> {
  try {
    const state = await skipPomodoro();
    return { success: true, data: state };
  } catch (error) {
    logger.error('Failed to skip pomodoro', { error: String(error) });
    return { success: false, error: String(error) };
  }
}

/**
 * Handle POMODORO_GET_STATE message
 */
async function handlePomodoroGetState(): Promise<PomodoroGetStateResponse> {
  try {
    const state = await getPomodoroState();
    return { success: true, data: state };
  } catch (error) {
    logger.error('Failed to get pomodoro state', { error: String(error) });
    return { success: false, error: String(error) };
  }
}

/**
 * Handle TIME_TRACK_ACTIVITY message
 */
async function handleTimeTrackActivity(
  message: Extract<Message, { type: 'TIME_TRACK_ACTIVITY' }>
): Promise<TimeTrackActivityResponse> {
  try {
    const usage = await trackTimeActivity(
      message.payload.platform,
      message.payload.durationMs
    );
    return { success: true, data: usage };
  } catch (error) {
    logger.error('Failed to track time activity', { error: String(error) });
    return { success: false, error: String(error) };
  }
}

/**
 * Handle TIME_GET_USAGE message
 */
async function handleTimeGetUsage(): Promise<TimeGetUsageResponse> {
  try {
    const state = await getTimeLimitsState();
    return { success: true, data: state };
  } catch (error) {
    logger.error('Failed to get time usage', { error: String(error) });
    return { success: false, error: String(error) };
  }
}

/**
 * Handle TIME_RESET_USAGE message
 */
async function handleTimeResetUsage(
  message: Extract<Message, { type: 'TIME_RESET_USAGE' }>
): Promise<TimeResetUsageResponse> {
  try {
    const state = await resetTimeUsage(message.payload?.platform);
    return { success: true, data: state };
  } catch (error) {
    logger.error('Failed to reset time usage', { error: String(error) });
    return { success: false, error: String(error) };
  }
}

/**
 * Handle TIME_CHECK_LIMIT message
 */
async function handleTimeCheckLimit(
  message: Extract<Message, { type: 'TIME_CHECK_LIMIT' }>
): Promise<TimeCheckLimitResponse> {
  try {
    const result = await checkTimeLimit(message.payload.platform);
    return { success: true, data: result };
  } catch (error) {
    logger.error('Failed to check time limit', { error: String(error) });
    return { success: false, error: String(error) };
  }
}

/**
 * Handle TIME_GET_HISTORY message
 */
async function handleTimeGetHistory(
  message: Extract<Message, { type: 'TIME_GET_HISTORY' }>
): Promise<TimeGetHistoryResponse> {
  try {
    const state = await getTimeTrackingHistory(message.payload?.days);
    return { success: true, data: state };
  } catch (error) {
    logger.error('Failed to get time history', { error: String(error) });
    return { success: false, error: String(error) };
  }
}

/**
 * Handle TIME_CLEAR_HISTORY message
 */
async function handleTimeClearHistory(): Promise<TimeClearHistoryResponse> {
  try {
    const state = await clearTimeTrackingHistory();
    return { success: true, data: state };
  } catch (error) {
    logger.error('Failed to clear time history', { error: String(error) });
    return { success: false, error: String(error) };
  }
}

/**
 * Handle STREAK_GET_DATA message
 */
async function handleStreakGetData(): Promise<StreakGetDataResponse> {
  try {
    const data = await getStreakData();
    return { success: true, data };
  } catch (error) {
    logger.error('Failed to get streak data', { error: String(error) });
    return { success: false, error: String(error) };
  }
}

/**
 * Handle STREAK_RESET message
 */
async function handleStreakReset(): Promise<StreakResetResponse> {
  try {
    const data = await resetStreakData();
    return { success: true, data };
  } catch (error) {
    logger.error('Failed to reset streak', { error: String(error) });
    return { success: false, error: String(error) };
  }
}

/**
 * Handle STREAK_CHECK_DAY message
 */
async function handleStreakCheckDay(): Promise<StreakCheckDayResponse> {
  try {
    const data = await checkStreakDay();
    return { success: true, data };
  } catch (error) {
    logger.error('Failed to check streak day', { error: String(error) });
    return { success: false, error: String(error) };
  }
}

/**
 * Handle CHALLENGE_REQUEST message
 */
async function handleChallengeRequest(): Promise<ChallengeRequestResponse> {
  try {
    const challenge = await requestChallenge();
    return { success: true, data: challenge };
  } catch (error) {
    logger.error('Failed to request challenge', { error: String(error) });
    return { success: false, error: String(error) };
  }
}

/**
 * Handle CHALLENGE_SUBMIT message
 */
async function handleChallengeSubmit(
  message: Extract<Message, { type: 'CHALLENGE_SUBMIT' }>
): Promise<ChallengeSubmitResponse> {
  try {
    const result = await submitChallengeAnswer(message.payload.answer);
    return { success: true, data: result };
  } catch (error) {
    logger.error('Failed to submit challenge', { error: String(error) });
    return { success: false, error: String(error) };
  }
}

/**
 * Handle CHALLENGE_GET_STATE message
 */
async function handleChallengeGetState(): Promise<ChallengeGetStateResponse> {
  try {
    const state = await getChallengeState();
    return { success: true, data: state };
  } catch (error) {
    logger.error('Failed to get challenge state', { error: String(error) });
    return { success: false, error: String(error) };
  }
}

/**
 * Handle LOCKDOWN_SET_PIN message
 */
async function handleLockdownSetPin(
  message: Extract<Message, { type: 'LOCKDOWN_SET_PIN' }>
): Promise<LockdownSetPinResponse> {
  try {
    await setLockdownPin(message.payload.pin, message.payload.currentPin);
    return { success: true };
  } catch (error) {
    logger.error('Failed to set lockdown PIN', { error: String(error) });
    return { success: false, error: String(error) };
  }
}

/**
 * Handle LOCKDOWN_VERIFY_PIN message
 */
async function handleLockdownVerifyPin(
  message: Extract<Message, { type: 'LOCKDOWN_VERIFY_PIN' }>
): Promise<LockdownVerifyPinResponse> {
  try {
    const result = await verifyLockdownPin(message.payload.pin);
    return { success: true, data: result };
  } catch (error) {
    logger.error('Failed to verify lockdown PIN', { error: String(error) });
    return { success: false, error: String(error) };
  }
}

/**
 * Handle LOCKDOWN_ACTIVATE message
 */
async function handleLockdownActivate(
  message: Extract<Message, { type: 'LOCKDOWN_ACTIVATE' }>
): Promise<LockdownActivateResponse> {
  try {
    const state = await activateLockdown(message.payload.pin);
    return { success: true, data: state };
  } catch (error) {
    logger.error('Failed to activate lockdown', { error: String(error) });
    return { success: false, error: String(error) };
  }
}

/**
 * Handle LOCKDOWN_DEACTIVATE message
 */
async function handleLockdownDeactivate(
  message: Extract<Message, { type: 'LOCKDOWN_DEACTIVATE' }>
): Promise<LockdownDeactivateResponse> {
  try {
    const state = await deactivateLockdown(message.payload.pin);
    return { success: true, data: state };
  } catch (error) {
    logger.error('Failed to deactivate lockdown', { error: String(error) });
    return { success: false, error: String(error) };
  }
}

/**
 * Handle LOCKDOWN_GET_STATE message
 */
async function handleLockdownGetState(): Promise<LockdownGetStateResponse> {
  try {
    const state = await getLockdownState();
    return { success: true, data: state };
  } catch (error) {
    logger.error('Failed to get lockdown state', { error: String(error) });
    return { success: false, error: String(error) };
  }
}

/**
 * Handle LOCKDOWN_REQUEST_EMERGENCY_BYPASS message
 */
async function handleLockdownRequestEmergencyBypass(): Promise<LockdownRequestEmergencyBypassResponse> {
  try {
    const state = await requestEmergencyBypass();
    return { success: true, data: state };
  } catch (error) {
    logger.error('Failed to request emergency bypass', { error: String(error) });
    return { success: false, error: String(error) };
  }
}

/**
 * Handle LOCKDOWN_CHECK_EMERGENCY_BYPASS message
 */
async function handleLockdownCheckEmergencyBypass(): Promise<LockdownCheckEmergencyBypassResponse> {
  try {
    const result = await checkEmergencyBypass();
    return { success: true, data: result };
  } catch (error) {
    logger.error('Failed to check emergency bypass', { error: String(error) });
    return { success: false, error: String(error) };
  }
}

/**
 * Main message handler
 */
async function handleMessage(
  message: Message,
  _sender: browser.Runtime.MessageSender
): Promise<MessageResponse> {
  logger.debug('Handling message', { type: message.type });

  switch (message.type) {
    case 'GET_SETTINGS':
      return handleGetSettings();

    case 'UPDATE_SETTINGS':
      if (isMessageType(message, 'UPDATE_SETTINGS')) {
        return handleUpdateSettings(message);
      }
      break;

    case 'GET_STATS':
      return handleGetStats();

    case 'LOG_BLOCK':
      if (isMessageType(message, 'LOG_BLOCK')) {
        return handleLogBlock(message);
      }
      break;

    case 'WHITELIST_ADD':
      if (isMessageType(message, 'WHITELIST_ADD')) {
        return handleWhitelistAdd(message);
      }
      break;

    case 'WHITELIST_REMOVE':
      if (isMessageType(message, 'WHITELIST_REMOVE')) {
        return handleWhitelistRemove(message);
      }
      break;

    case 'PING':
      return handlePing();

    case 'FOCUS_START':
      if (isMessageType(message, 'FOCUS_START')) {
        return handleFocusStart(message);
      }
      break;

    case 'FOCUS_CANCEL':
      return handleFocusCancel();

    case 'FOCUS_GET_STATE':
      return handleFocusGetState();

    case 'FOCUS_EXTEND':
      if (isMessageType(message, 'FOCUS_EXTEND')) {
        return handleFocusExtend(message);
      }
      break;

    case 'POMODORO_START':
      if (isMessageType(message, 'POMODORO_START')) {
        return handlePomodoroStart(message);
      }
      break;

    case 'POMODORO_PAUSE':
      return handlePomodoroPause();

    case 'POMODORO_RESUME':
      return handlePomodoroResume();

    case 'POMODORO_STOP':
      return handlePomodoroStop();

    case 'POMODORO_SKIP':
      return handlePomodoroSkip();

    case 'POMODORO_GET_STATE':
      return handlePomodoroGetState();

    case 'TIME_TRACK_ACTIVITY':
      if (isMessageType(message, 'TIME_TRACK_ACTIVITY')) {
        return handleTimeTrackActivity(message);
      }
      break;

    case 'TIME_GET_USAGE':
      return handleTimeGetUsage();

    case 'TIME_RESET_USAGE':
      if (isMessageType(message, 'TIME_RESET_USAGE')) {
        return handleTimeResetUsage(message);
      }
      break;

    case 'TIME_CHECK_LIMIT':
      if (isMessageType(message, 'TIME_CHECK_LIMIT')) {
        return handleTimeCheckLimit(message);
      }
      break;

    case 'TIME_GET_HISTORY':
      if (isMessageType(message, 'TIME_GET_HISTORY')) {
        return handleTimeGetHistory(message);
      }
      break;

    case 'TIME_CLEAR_HISTORY':
      return handleTimeClearHistory();

    case 'STREAK_GET_DATA':
      return handleStreakGetData();

    case 'STREAK_RESET':
      return handleStreakReset();

    case 'STREAK_CHECK_DAY':
      return handleStreakCheckDay();

    case 'CHALLENGE_REQUEST':
      return handleChallengeRequest();

    case 'CHALLENGE_SUBMIT':
      if (isMessageType(message, 'CHALLENGE_SUBMIT')) {
        return handleChallengeSubmit(message);
      }
      break;

    case 'CHALLENGE_GET_STATE':
      return handleChallengeGetState();

    case 'LOCKDOWN_SET_PIN':
      if (isMessageType(message, 'LOCKDOWN_SET_PIN')) {
        return handleLockdownSetPin(message);
      }
      break;

    case 'LOCKDOWN_VERIFY_PIN':
      if (isMessageType(message, 'LOCKDOWN_VERIFY_PIN')) {
        return handleLockdownVerifyPin(message);
      }
      break;

    case 'LOCKDOWN_ACTIVATE':
      if (isMessageType(message, 'LOCKDOWN_ACTIVATE')) {
        return handleLockdownActivate(message);
      }
      break;

    case 'LOCKDOWN_DEACTIVATE':
      if (isMessageType(message, 'LOCKDOWN_DEACTIVATE')) {
        return handleLockdownDeactivate(message);
      }
      break;

    case 'LOCKDOWN_GET_STATE':
      return handleLockdownGetState();

    case 'LOCKDOWN_REQUEST_EMERGENCY_BYPASS':
      return handleLockdownRequestEmergencyBypass();

    case 'LOCKDOWN_CHECK_EMERGENCY_BYPASS':
      return handleLockdownCheckEmergencyBypass();
  }

  return { success: false, error: 'Unknown message type' };
}

/**
 * Set up the message listener
 */
export function setupMessageListener(): void {
  browser.runtime.onMessage.addListener(
    (
      rawMessage: unknown,
      sender: browser.Runtime.MessageSender
    ): Promise<MessageResponse> | undefined => {
      // Validate sender
      if (!isValidSender(sender)) {
        logger.warn('Message from invalid sender', {
          senderId: sender.id,
          url: sender.url,
        });
        return Promise.resolve({
          success: false,
          error: 'Invalid sender',
        });
      }

      // Validate message structure
      if (!isValidMessage(rawMessage)) {
        logger.warn('Invalid message format', {
          message: typeof rawMessage,
        });
        return Promise.resolve({
          success: false,
          error: 'Invalid message format',
        });
      }

      // Handle the message
      return handleMessage(rawMessage, sender);
    }
  );

  logger.info('Message listener set up');
}
