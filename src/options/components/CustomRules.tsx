/**
 * Custom rules management component
 * Allows users to add custom CSS selectors for blocking
 */

import { useState, useCallback } from 'react';
import { useI18n } from '@/shared/hooks/useI18n';
import type { Platform } from '@/shared/types';
import { sanitizeInput, validateCssSelector } from '@/shared/utils/validation';
import { createLogger } from '@/shared/utils/logger';

const logger = createLogger('custom-rules');

/**
 * Custom rule entry
 */
interface CustomRule {
  id: string;
  platform: Platform;
  selector: string;
  description: string;
  enabled: boolean;
  createdAt: number;
}

interface CustomRuleItemProps {
  rule: CustomRule;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}

/**
 * Single custom rule display
 */
function CustomRuleItem({ rule, onToggle, onRemove }: CustomRuleItemProps) {
  const { t, formatDate } = useI18n();

  const platformLabels: Record<Platform, string> = {
    youtube: t('popupPlatformYouTube'),
    youtube_full: t('popupPlatformYouTubeFull'),
    tiktok: t('popupPlatformTikTok'),
    instagram: t('popupPlatformInstagram'),
    twitter: t('popupPlatformTwitter'),
    facebook: t('popupPlatformFacebook'),
    linkedin: t('popupPlatformLinkedIn'),
    threads: t('popupPlatformThreads'),
    snapchat: t('popupPlatformSnapchat'),
    reddit: t('popupPlatformReddit'),
  };

  return (
    <div className={`custom-rule-item ${rule.enabled ? '' : 'disabled'}`}>
      <div className="custom-rule-info">
        <div className="custom-rule-header">
          <span className="custom-rule-platform">
            {platformLabels[rule.platform]}
          </span>
          <label className="custom-rule-toggle">
            <input
              type="checkbox"
              checked={rule.enabled}
              onChange={() => onToggle(rule.id)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
        <code className="custom-rule-selector">{rule.selector}</code>
        {rule.description && (
          <p className="custom-rule-description">{rule.description}</p>
        )}
        <span className="custom-rule-date">
          {formatDate(new Date(rule.createdAt))}
        </span>
      </div>
      <button
        className="custom-rule-remove"
        onClick={() => onRemove(rule.id)}
        aria-label={t('customRulesRemove')}
      >
        ×
      </button>
    </div>
  );
}

/**
 * Custom rules management component
 */
export function CustomRules() {
  const { t } = useI18n();

  // Local state for custom rules (would be stored in settings in production)
  const [rules, setRules] = useState<CustomRule[]>([]);
  const [newSelector, setNewSelector] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [platform, setPlatform] = useState<Platform>('youtube');
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = useCallback(() => {
    setError(null);

    const sanitizedSelector = sanitizeInput(newSelector.trim());
    const sanitizedDescription = sanitizeInput(newDescription.trim());

    if (!sanitizedSelector) {
      setError(t('customRulesErrorEmpty'));
      return;
    }

    // Validate CSS selector
    const validation = validateCssSelector(sanitizedSelector);
    if (!validation.isValid) {
      setError(validation.error ?? t('customRulesErrorInvalidSelector'));
      return;
    }

    // Check for duplicates
    const exists = rules.some(
      (rule) =>
        rule.selector === sanitizedSelector && rule.platform === platform
    );

    if (exists) {
      setError(t('customRulesErrorDuplicate'));
      return;
    }

    try {
      setIsAdding(true);

      const newRule: CustomRule = {
        id: `rule_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        platform,
        selector: sanitizedSelector,
        description: sanitizedDescription,
        enabled: true,
        createdAt: Date.now(),
      };

      setRules((prev) => [...prev, newRule]);
      setNewSelector('');
      setNewDescription('');

      logger.info('Custom rule added', {
        platform,
        selector: sanitizedSelector,
      });
    } catch (err) {
      logger.error('Failed to add custom rule', { error: err });
      setError(t('customRulesErrorFailed'));
    } finally {
      setIsAdding(false);
    }
  }, [newSelector, newDescription, platform, rules, t]);

  const handleToggle = useCallback((id: string) => {
    setRules((prev) =>
      prev.map((rule) =>
        rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
      )
    );
  }, []);

  const handleRemove = useCallback((id: string) => {
    setRules((prev) => prev.filter((rule) => rule.id !== id));
    logger.info('Custom rule removed', { id });
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !isAdding && newSelector.trim()) {
        void handleAdd();
      }
    },
    [handleAdd, isAdding, newSelector]
  );

  // Filter rules by platform
  const filteredRules = rules.filter((rule) => rule.platform === platform);

  return (
    <div className="custom-rules-section">
      <h2>{t('customRulesTitle')}</h2>
      <p className="section-description">{t('customRulesDescription')}</p>

      {/* Warning about advanced feature */}
      <div className="custom-rules-warning">
        <p>{t('customRulesWarning')}</p>
      </div>

      {/* Add new rule form */}
      <div className="custom-rules-form">
        <div className="custom-rules-form-row">
          <select
            className="custom-rules-select"
            value={platform}
            onChange={(e) => setPlatform(e.target.value as Platform)}
          >
            <option value="youtube">{t('popupPlatformYouTube')}</option>
            <option value="tiktok">{t('popupPlatformTikTok')}</option>
            <option value="instagram">{t('popupPlatformInstagram')}</option>
          </select>
        </div>

        <div className="custom-rules-form-row">
          <input
            type="text"
            className="custom-rules-input"
            value={newSelector}
            onChange={(e) => setNewSelector(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('customRulesPlaceholderSelector')}
            disabled={isAdding}
          />
        </div>

        <div className="custom-rules-form-row">
          <input
            type="text"
            className="custom-rules-input"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder={t('customRulesPlaceholderDescription')}
            disabled={isAdding}
          />
        </div>

        <button
          className="custom-rules-add-button"
          onClick={() => void handleAdd()}
          disabled={isAdding || !newSelector.trim()}
        >
          {isAdding ? t('customRulesAdding') : t('customRulesAdd')}
        </button>

        {error !== null && error !== '' && (
          <p className="custom-rules-error">{error}</p>
        )}
      </div>

      {/* Rules list */}
      <div className="custom-rules-list">
        {filteredRules.length === 0 ? (
          <p className="custom-rules-empty">{t('customRulesEmpty')}</p>
        ) : (
          filteredRules.map((rule) => (
            <CustomRuleItem
              key={rule.id}
              rule={rule}
              onToggle={handleToggle}
              onRemove={handleRemove}
            />
          ))
        )}
      </div>

      {/* Selector examples */}
      <div className="custom-rules-examples">
        <h3>{t('customRulesExamplesTitle')}</h3>
        <ul>
          <li>
            <code>[data-testid=&quot;video-card&quot;]</code> -{' '}
            {t('customRulesExampleAttr')}
          </li>
          <li>
            <code>.video-container</code> - {t('customRulesExampleClass')}
          </li>
          <li>
            <code>a[href*=&quot;/shorts/&quot;]</code> -{' '}
            {t('customRulesExampleLink')}
          </li>
        </ul>
      </div>
    </div>
  );
}
