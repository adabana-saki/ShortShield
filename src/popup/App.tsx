/**
 * Main popup application component
 */

import browser from 'webextension-polyfill';
import { useSettings } from '@/shared/hooks/useSettings';
import { useI18n } from '@/shared/hooks/useI18n';
import { Toggle } from './components/Toggle';
import { Stats } from './components/Stats';
import { QuickSettings } from './components/QuickSettings';
import type { Platform } from '@/shared/types';

export function App() {
  const { t } = useI18n();
  const { settings, isLoading, error, toggleEnabled, togglePlatform, refreshSettings } =
    useSettings();

  /**
   * Handle platform toggle
   */
  const handleTogglePlatform = (platform: Platform) => {
    void togglePlatform(platform);
  };

  /**
   * Handle main toggle
   */
  const handleToggleEnabled = () => {
    void toggleEnabled();
  };

  /**
   * Open options page
   */
  const openOptions = () => {
    void browser.runtime.openOptionsPage();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="popup-container">
        <div className="loading-container">
          <div className="loading-spinner" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="popup-container">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button
            type="button"
            className="retry-button"
            onClick={() => void refreshSettings()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="popup-container">
      {/* Header */}
      <header className="popup-header">
        <h1 className="popup-title">{t('popupTitle')}</h1>
        <span
          className={`status-badge ${settings.enabled ? 'status-badge-enabled' : 'status-badge-disabled'}`}
        >
          {settings.enabled ? t('popupStatusEnabled') : t('popupStatusDisabled')}
        </span>
      </header>

      {/* Main toggle */}
      <Toggle enabled={settings.enabled} onToggle={handleToggleEnabled} />

      {/* Stats */}
      {settings.preferences.showStats && <Stats stats={settings.stats} />}

      {/* Platform toggles */}
      <QuickSettings
        platforms={settings.platforms}
        enabled={settings.enabled}
        onTogglePlatform={handleTogglePlatform}
      />

      {/* Footer with settings link */}
      <footer className="popup-footer">
        <button type="button" className="settings-link" onClick={openOptions}>
          <svg
            className="settings-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          {t('popupOpenOptions')}
        </button>
      </footer>
    </div>
  );
}
