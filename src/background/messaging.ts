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
  GetLogsResponse,
  ClearLogsResponse,
  PingResponse,
  WhitelistEntry,
  WhitelistId,
  BlockLogEntry,
} from '@/shared/types';
import { isValidMessage, isMessageType } from '@/shared/types';
import {
  getSettings,
  updateSettings,
  getBlockLogs,
  addBlockLog,
  clearBlockLogs,
} from '@/shared/utils';
import { createLogger } from '@/shared/utils/logger';
import { validateWhitelistInput } from '@/shared/utils/validation';

const logger = createLogger('messaging');

/**
 * Validate that the message sender is from our extension
 */
function isValidSender(sender: browser.Runtime.MessageSender): boolean {
  // Must have an ID
  if (!sender.id) {
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
 * Handle LOG_BLOCK message
 */
async function handleLogBlock(
  message: Extract<Message, { type: 'LOG_BLOCK' }>
): Promise<LogBlockResponse> {
  try {
    const entry: BlockLogEntry = {
      id: generateId(),
      timestamp: Date.now(),
      platform: message.payload.platform,
      url: message.payload.url,
      action: message.payload.action as BlockLogEntry['action'],
      elementInfo: message.payload.elementInfo
        ? {
            tagName: message.payload.elementInfo.tagName,
            className: message.payload.elementInfo.className,
          }
        : undefined,
    };

    await addBlockLog(entry);

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
 * Handle GET_LOGS message
 */
async function handleGetLogs(
  message: Extract<Message, { type: 'GET_LOGS' }>
): Promise<GetLogsResponse> {
  try {
    let logs = await getBlockLogs();

    // Filter by platform if specified
    if (message.payload?.platform) {
      logs = logs.filter((log) => log.platform === message.payload?.platform);
    }

    // Apply limit if specified
    if (message.payload?.limit) {
      logs = logs.slice(-message.payload.limit);
    }

    return { success: true, data: logs };
  } catch (error) {
    logger.error('Failed to get logs', { error: String(error) });
    return { success: false, error: 'Failed to get logs' };
  }
}

/**
 * Handle CLEAR_LOGS message
 */
async function handleClearLogs(): Promise<ClearLogsResponse> {
  try {
    await clearBlockLogs();
    return { success: true };
  } catch (error) {
    logger.error('Failed to clear logs', { error: String(error) });
    return { success: false, error: 'Failed to clear logs' };
  }
}

/**
 * Handle PING message
 */
function handlePing(): PingResponse {
  return { success: true, data: { pong: true } };
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

    case 'GET_LOGS':
      if (isMessageType(message, 'GET_LOGS')) {
        return handleGetLogs(message);
      }
      break;

    case 'CLEAR_LOGS':
      return handleClearLogs();

    case 'PING':
      return handlePing();
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
