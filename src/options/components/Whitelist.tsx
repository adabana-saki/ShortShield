/* eslint-disable @typescript-eslint/no-misused-promises */
/**
 * Whitelist management component
 * Allows users to add/remove whitelisted channels and videos
 */

import { useState, useCallback } from 'react';
import { useSettings } from '@/shared/hooks/useSettings';
import { useI18n } from '@/shared/hooks/useI18n';
import type { Platform, WhitelistEntry } from '@/shared/types';
import {
  validateChannelId,
  validateUrl,
  sanitizeInput,
} from '@/shared/utils/validation';
import { createLogger } from '@/shared/utils/logger';

const logger = createLogger('whitelist');

interface WhitelistItemProps {
  entry: WhitelistEntry;
  onRemove: (id: string) => void;
}

/**
 * Single whitelist item display
 */
function WhitelistItem({ entry, onRemove }: WhitelistItemProps) {
  const { t, formatDate } = useI18n();

  const platformLabels: Record<Platform, string> = {
    youtube: t('popupPlatformYouTube'),
    tiktok: t('popupPlatformTikTok'),
    instagram: t('popupPlatformInstagram'),
  };

  const typeLabels: Record<string, string> = {
    channel: t('whitelistTypeChannel'),
    url: t('whitelistTypeVideo'),
    domain: t('whitelistTypeVideo'),
  };

  return (
    <div className="whitelist-item">
      <div className="whitelist-item-info">
        <span className="whitelist-item-value">{entry.value}</span>
        <div className="whitelist-item-meta">
          <span className="whitelist-item-platform">
            {platformLabels[entry.platform]}
          </span>
          <span className="whitelist-item-type">{typeLabels[entry.type]}</span>
          <span className="whitelist-item-date">
            {formatDate(new Date(entry.createdAt))}
          </span>
        </div>
      </div>
      <button
        className="whitelist-item-remove"
        onClick={() => onRemove(entry.id)}
        aria-label={t('whitelistRemove')}
      >
        ×
      </button>
    </div>
  );
}

/**
 * Whitelist management component
 */
export function Whitelist() {
  const { t } = useI18n();
  const { settings, addToWhitelist, removeFromWhitelist } = useSettings();

  const [newEntry, setNewEntry] = useState('');
  const [entryType, setEntryType] = useState<'channel' | 'url'>('channel');
  const [platform, setPlatform] = useState<Platform>('youtube');
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = useCallback(async () => {
    setError(null);
    const sanitized = sanitizeInput(newEntry.trim());

    if (!sanitized) {
      setError(t('whitelistErrorEmpty'));
      return;
    }

    // Validate based on type
    if (entryType === 'channel') {
      const validation = validateChannelId(sanitized);
      if (!validation.isValid) {
        setError(validation.error ?? t('whitelistErrorInvalidChannel'));
        return;
      }
    } else if (entryType === 'url') {
      const validation = validateUrl(sanitized);
      if (!validation.isValid) {
        setError(validation.error ?? t('whitelistErrorInvalidUrl'));
        return;
      }
    }

    // Check for duplicates
    const exists = settings.whitelist.some(
      (entry) =>
        entry.value === sanitized &&
        entry.platform === platform &&
        entry.type === entryType
    );

    if (exists) {
      setError(t('whitelistErrorDuplicate'));
      return;
    }

    try {
      setIsAdding(true);
      await addToWhitelist({
        platform,
        type: entryType,
        value: sanitized,
      });
      setNewEntry('');
      logger.info('Added whitelist entry', { platform, type: entryType });
    } catch (err) {
      logger.error('Failed to add whitelist entry', { error: err });
      setError(t('whitelistErrorFailed'));
    } finally {
      setIsAdding(false);
    }
  }, [newEntry, entryType, platform, settings.whitelist, addToWhitelist, t]);

  const handleRemove = useCallback(
    async (id: string) => {
      try {
        await removeFromWhitelist(id);
        logger.info('Removed whitelist entry', { id });
      } catch (err) {
        logger.error('Failed to remove whitelist entry', { error: err });
      }
    },
    [removeFromWhitelist]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !isAdding) {
        void handleAdd();
      }
    },
    [handleAdd, isAdding]
  );

  // Filter whitelist by platform
  const filteredWhitelist = settings.whitelist.filter(
    (entry) => entry.platform === platform
  );

  return (
    <div className="whitelist-section">
      <h2>{t('whitelistTitle')}</h2>
      <p className="section-description">{t('whitelistDescription')}</p>

      {/* Add new entry form */}
      <div className="whitelist-form">
        <div className="whitelist-form-row">
          <select
            className="whitelist-select"
            value={platform}
            onChange={(e) => setPlatform(e.target.value as Platform)}
          >
            <option value="youtube">{t('popupPlatformYouTube')}</option>
            <option value="tiktok">{t('popupPlatformTikTok')}</option>
            <option value="instagram">{t('popupPlatformInstagram')}</option>
          </select>

          <select
            className="whitelist-select"
            value={entryType}
            onChange={(e) => setEntryType(e.target.value as 'channel' | 'url')}
          >
            <option value="channel">{t('whitelistTypeChannel')}</option>
            <option value="url">{t('whitelistTypeVideo')}</option>
          </select>
        </div>

        <div className="whitelist-form-row">
          <input
            type="text"
            className="whitelist-input"
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              entryType === 'channel'
                ? t('whitelistPlaceholderChannel')
                : t('whitelistPlaceholderUrl')
            }
            aria-label={entryType === 'channel' ? 'Channel ID' : 'URL'}
            disabled={isAdding}
          />
          <button
            className="whitelist-add-button"
            onClick={() => void handleAdd()}
            disabled={isAdding || !newEntry.trim()}
          >
            {isAdding ? t('whitelistAdding') : t('whitelistAdd')}
          </button>
        </div>

        {error !== null && error !== '' && (
          <p className="whitelist-error">{error}</p>
        )}
      </div>

      {/* Whitelist entries */}
      <div className="whitelist-list">
        {filteredWhitelist.length === 0 ? (
          <p className="whitelist-empty">{t('whitelistEmpty')}</p>
        ) : (
          filteredWhitelist.map((entry) => (
            <WhitelistItem
              key={entry.id}
              entry={entry}
              onRemove={handleRemove}
            />
          ))
        )}
      </div>
    </div>
  );
}
