/**
 * Block page customization component
 * Allows users to customize the appearance of block overlays
 */

import { useState, useCallback } from 'react';
import { useSettings } from '@/shared/hooks/useSettings';
import { useI18n } from '@/shared/hooks/useI18n';
import type { BlockPageTheme } from '@/shared/types';
import { sanitizeInput } from '@/shared/utils/validation';
import { createLogger } from '@/shared/utils/logger';

const logger = createLogger('block-page-customizer');

/**
 * Color preset options
 */
const COLOR_PRESETS = [
  { value: '#3b82f6', label: 'Blue' },
  { value: '#10b981', label: 'Green' },
  { value: '#f59e0b', label: 'Amber' },
  { value: '#ef4444', label: 'Red' },
  { value: '#8b5cf6', label: 'Purple' },
  { value: '#ec4899', label: 'Pink' },
  { value: '#6366f1', label: 'Indigo' },
  { value: '#14b8a6', label: 'Teal' },
] as const;

/**
 * Theme options
 */
const THEME_OPTIONS: { value: BlockPageTheme; labelKey: string }[] = [
  { value: 'system', labelKey: 'blockPageThemeSystem' },
  { value: 'light', labelKey: 'blockPageThemeLight' },
  { value: 'dark', labelKey: 'blockPageThemeDark' },
];

/**
 * Block page customization component
 */
export function BlockPageCustomizer() {
  const { t } = useI18n();
  const { settings, updateSettings } = useSettings();

  const [newQuote, setNewQuote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { blockPage } = settings;

  const handleTitleChange = useCallback(
    async (title: string) => {
      setError(null);
      try {
        setIsUpdating(true);
        await updateSettings({
          blockPage: { title: sanitizeInput(title) },
        });
      } catch (err) {
        logger.error('Failed to update title', { error: err });
        setError(t('blockPageErrorUpdate'));
      } finally {
        setIsUpdating(false);
      }
    },
    [updateSettings, t]
  );

  const handleMessageChange = useCallback(
    async (message: string) => {
      setError(null);
      try {
        setIsUpdating(true);
        await updateSettings({
          blockPage: { message: sanitizeInput(message) },
        });
      } catch (err) {
        logger.error('Failed to update message', { error: err });
        setError(t('blockPageErrorUpdate'));
      } finally {
        setIsUpdating(false);
      }
    },
    [updateSettings, t]
  );

  const handleThemeChange = useCallback(
    async (theme: BlockPageTheme) => {
      setError(null);
      try {
        setIsUpdating(true);
        await updateSettings({ blockPage: { theme } });
      } catch (err) {
        logger.error('Failed to update theme', { error: err });
        setError(t('blockPageErrorUpdate'));
      } finally {
        setIsUpdating(false);
      }
    },
    [updateSettings, t]
  );

  const handleColorChange = useCallback(
    async (primaryColor: string) => {
      setError(null);
      try {
        setIsUpdating(true);
        await updateSettings({ blockPage: { primaryColor } });
      } catch (err) {
        logger.error('Failed to update color', { error: err });
        setError(t('blockPageErrorUpdate'));
      } finally {
        setIsUpdating(false);
      }
    },
    [updateSettings, t]
  );

  const handleToggleQuotes = useCallback(
    async (showMotivationalQuote: boolean) => {
      setError(null);
      try {
        setIsUpdating(true);
        await updateSettings({ blockPage: { showMotivationalQuote } });
      } catch (err) {
        logger.error('Failed to toggle quotes', { error: err });
        setError(t('blockPageErrorUpdate'));
      } finally {
        setIsUpdating(false);
      }
    },
    [updateSettings, t]
  );

  const handleToggleBypass = useCallback(
    async (showBypassButton: boolean) => {
      setError(null);
      try {
        setIsUpdating(true);
        await updateSettings({ blockPage: { showBypassButton } });
      } catch (err) {
        logger.error('Failed to toggle bypass', { error: err });
        setError(t('blockPageErrorUpdate'));
      } finally {
        setIsUpdating(false);
      }
    },
    [updateSettings, t]
  );

  const handleAddQuote = useCallback(async () => {
    const sanitized = sanitizeInput(newQuote.trim());
    if (!sanitized) {
      setError(t('blockPageErrorEmptyQuote'));
      return;
    }

    if (blockPage.customQuotes.includes(sanitized)) {
      setError(t('blockPageErrorDuplicateQuote'));
      return;
    }

    setError(null);
    try {
      setIsUpdating(true);
      await updateSettings({
        blockPage: {
          customQuotes: [...blockPage.customQuotes, sanitized],
        },
      });
      setNewQuote('');
      logger.info('Added custom quote');
    } catch (err) {
      logger.error('Failed to add quote', { error: err });
      setError(t('blockPageErrorUpdate'));
    } finally {
      setIsUpdating(false);
    }
  }, [newQuote, blockPage.customQuotes, updateSettings, t]);

  const handleRemoveQuote = useCallback(
    async (index: number) => {
      setError(null);
      try {
        setIsUpdating(true);
        const newQuotes = blockPage.customQuotes.filter((_, i) => i !== index);
        await updateSettings({
          blockPage: { customQuotes: newQuotes },
        });
        logger.info('Removed custom quote');
      } catch (err) {
        logger.error('Failed to remove quote', { error: err });
        setError(t('blockPageErrorUpdate'));
      } finally {
        setIsUpdating(false);
      }
    },
    [blockPage.customQuotes, updateSettings, t]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !isUpdating && newQuote.trim()) {
        void handleAddQuote();
      }
    },
    [handleAddQuote, isUpdating, newQuote]
  );

  return (
    <div className="block-page-customizer">
      <h2>{t('blockPageTitle')}</h2>
      <p className="section-description">{t('blockPageDescription')}</p>

      {error !== null && error !== '' && (
        <p className="block-page-error">{error}</p>
      )}

      {/* Theme Selection */}
      <div className="block-page-section">
        <h3>{t('blockPageThemeTitle')}</h3>
        <div className="theme-options">
          {THEME_OPTIONS.map((option) => (
            <label key={option.value} className="theme-option">
              <input
                type="radio"
                name="blockPageTheme"
                value={option.value}
                checked={blockPage.theme === option.value}
                onChange={() => void handleThemeChange(option.value)}
                disabled={isUpdating}
              />
              <span>{t(option.labelKey)}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Color Selection */}
      <div className="block-page-section">
        <h3>{t('blockPageColorTitle')}</h3>
        <div className="color-options">
          {COLOR_PRESETS.map((color) => (
            <button
              key={color.value}
              className={`color-option ${blockPage.primaryColor === color.value ? 'selected' : ''}`}
              style={{ backgroundColor: color.value }}
              onClick={() => void handleColorChange(color.value)}
              disabled={isUpdating}
              aria-label={color.label}
              title={color.label}
            />
          ))}
          <input
            type="color"
            className="color-picker"
            value={blockPage.primaryColor}
            onChange={(e) => void handleColorChange(e.target.value)}
            disabled={isUpdating}
            title={t('blockPageCustomColor')}
          />
        </div>
      </div>

      {/* Custom Title */}
      <div className="block-page-section">
        <h3>{t('blockPageCustomTitle')}</h3>
        <input
          type="text"
          className="block-page-input"
          value={blockPage.title}
          onChange={(e) => void handleTitleChange(e.target.value)}
          placeholder={t('blockPageTitlePlaceholder')}
          disabled={isUpdating}
          maxLength={100}
        />
      </div>

      {/* Custom Message */}
      <div className="block-page-section">
        <h3>{t('blockPageCustomMessage')}</h3>
        <textarea
          className="block-page-textarea"
          value={blockPage.message}
          onChange={(e) => void handleMessageChange(e.target.value)}
          placeholder={t('blockPageMessagePlaceholder')}
          disabled={isUpdating}
          maxLength={500}
          rows={3}
        />
      </div>

      {/* Motivational Quotes Toggle */}
      <div className="block-page-section">
        <label className="block-page-toggle">
          <input
            type="checkbox"
            checked={blockPage.showMotivationalQuote}
            onChange={(e) => void handleToggleQuotes(e.target.checked)}
            disabled={isUpdating}
          />
          <span>{t('blockPageShowQuotes')}</span>
        </label>
        <p className="toggle-description">{t('blockPageShowQuotesDescription')}</p>
      </div>

      {/* Custom Quotes */}
      {blockPage.showMotivationalQuote && (
        <div className="block-page-section">
          <h3>{t('blockPageCustomQuotes')}</h3>
          <p className="subsection-description">{t('blockPageCustomQuotesDescription')}</p>

          <div className="quote-form">
            <input
              type="text"
              className="quote-input"
              value={newQuote}
              onChange={(e) => setNewQuote(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('blockPageQuotePlaceholder')}
              disabled={isUpdating}
              maxLength={200}
            />
            <button
              className="quote-add-button"
              onClick={() => void handleAddQuote()}
              disabled={isUpdating || !newQuote.trim()}
            >
              {t('blockPageAddQuote')}
            </button>
          </div>

          <div className="quote-list">
            {blockPage.customQuotes.length === 0 ? (
              <p className="quote-empty">{t('blockPageNoCustomQuotes')}</p>
            ) : (
              blockPage.customQuotes.map((quote, index) => (
                <div key={index} className="quote-item">
                  <span className="quote-text">{quote}</span>
                  <button
                    className="quote-remove"
                    onClick={() => void handleRemoveQuote(index)}
                    disabled={isUpdating}
                    aria-label={t('blockPageRemoveQuote')}
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Bypass Button Toggle */}
      <div className="block-page-section">
        <label className="block-page-toggle">
          <input
            type="checkbox"
            checked={blockPage.showBypassButton}
            onChange={(e) => void handleToggleBypass(e.target.checked)}
            disabled={isUpdating}
          />
          <span>{t('blockPageShowBypass')}</span>
        </label>
        <p className="toggle-description">{t('blockPageShowBypassDescription')}</p>
      </div>

      {/* Preview */}
      <div className="block-page-section">
        <h3>{t('blockPagePreview')}</h3>
        <div
          className={`block-page-preview ${blockPage.theme === 'dark' ? 'dark' : blockPage.theme === 'light' ? 'light' : ''}`}
          style={{ '--preview-color': blockPage.primaryColor } as React.CSSProperties}
        >
          <div className="preview-content">
            <div className="preview-icon" style={{ color: blockPage.primaryColor }}>
              🛡️
            </div>
            <h4 className="preview-title">
              {blockPage.title || t('blockPageDefaultTitle')}
            </h4>
            <p className="preview-message">
              {blockPage.message || t('blockPageDefaultMessage')}
            </p>
            {blockPage.showMotivationalQuote && (
              <p className="preview-quote">
                "{blockPage.customQuotes[0] || t('blockPageDefaultQuote')}"
              </p>
            )}
            {blockPage.showBypassButton && (
              <button
                className="preview-bypass-button"
                style={{ borderColor: blockPage.primaryColor, color: blockPage.primaryColor }}
              >
                {t('blockPageBypassButton')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
