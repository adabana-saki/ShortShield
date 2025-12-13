/**
 * Options page main component
 */

import { useState } from 'react';
import { useSettings } from '@/shared/hooks/useSettings';
import { useI18n } from '@/shared/hooks/useI18n';
import type { Platform } from '@/shared/types';
import { Whitelist, ExportImport, LogViewer } from './components';

type TabId = 'platforms' | 'whitelist' | 'logs' | 'backup';

export function App() {
  const { t, formatNumber } = useI18n();
  const { settings, isLoading, error, togglePlatform, refreshSettings } =
    useSettings();
  const [activeTab, setActiveTab] = useState<TabId>('platforms');

  const handleTogglePlatform = (platform: Platform) => {
    void togglePlatform(platform);
  };

  if (isLoading) {
    return (
      <div className="options-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="options-container">
        <div className="error">
          <p>{error}</p>
          <button onClick={() => void refreshSettings()}>Retry</button>
        </div>
      </div>
    );
  }

  const tabs: { id: TabId; label: string }[] = [
    { id: 'platforms', label: t('optionsTabPlatforms') },
    { id: 'whitelist', label: t('optionsTabWhitelist') },
    { id: 'logs', label: t('optionsTabLogs') },
    { id: 'backup', label: t('optionsTabBackup') },
  ];

  return (
    <div className="options-container">
      <header className="options-header">
        <h1>{t('optionsTitle')}</h1>
      </header>

      {/* Tab navigation */}
      <nav className="options-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`options-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="options-content">
        {/* Platforms Tab */}
        {activeTab === 'platforms' && (
          <>
            <section className="options-section">
              <h2>{t('optionsPlatformsTitle')}</h2>
              <p className="section-description">{t('optionsPlatformsDescription')}</p>

              <div className="platform-list">
                <label className="platform-toggle">
                  <input
                    type="checkbox"
                    checked={settings.platforms.youtube}
                    onChange={() => handleTogglePlatform('youtube')}
                  />
                  <span>{t('popupPlatformYouTube')}</span>
                </label>

                <label className="platform-toggle">
                  <input
                    type="checkbox"
                    checked={settings.platforms.tiktok}
                    onChange={() => handleTogglePlatform('tiktok')}
                  />
                  <span>{t('popupPlatformTikTok')}</span>
                </label>

                <label className="platform-toggle">
                  <input
                    type="checkbox"
                    checked={settings.platforms.instagram}
                    onChange={() => handleTogglePlatform('instagram')}
                  />
                  <span>{t('popupPlatformInstagram')}</span>
                </label>
              </div>
            </section>

            <section className="options-section">
              <h2>{t('optionsStatsTitle')}</h2>
              <div className="stats-display">
                <div className="stat">
                  <span className="stat-value">
                    {formatNumber(settings.stats.blockedToday)}
                  </span>
                  <span className="stat-label">{t('popupStatsToday')}</span>
                </div>
                <div className="stat">
                  <span className="stat-value">
                    {formatNumber(settings.stats.blockedTotal)}
                  </span>
                  <span className="stat-label">{t('popupStatsTotal')}</span>
                </div>
              </div>
            </section>
          </>
        )}

        {/* Whitelist Tab */}
        {activeTab === 'whitelist' && (
          <section className="options-section">
            <Whitelist />
          </section>
        )}

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <section className="options-section">
            <LogViewer />
          </section>
        )}

        {/* Backup Tab */}
        {activeTab === 'backup' && (
          <section className="options-section">
            <ExportImport />
          </section>
        )}
      </main>

      <footer className="options-footer">
        <p>ShortShield v0.1.0</p>
      </footer>
    </div>
  );
}
