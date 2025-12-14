/**
 * Options page main component
 */

import { useState } from 'react';
import { useSettings } from '@/shared/hooks/useSettings';
import { useI18n } from '@/shared/hooks/useI18n';
import type { Platform, PopupView } from '@/shared/types';
import {
  Whitelist,
  ExportImport,
  CustomDomains,
  Schedule,
  BlockPageCustomizer,
  FocusModeSettings,
  PomodoroSettings,
  TimeLimitsConfig,
  TimeReports,
  StreakSettings,
  ChallengeSettings,
  LockdownSettings,
} from './components';

type TabId =
  | 'platforms'
  | 'customDomains'
  | 'schedule'
  | 'whitelist'
  | 'focus'
  | 'streak'
  | 'reports'
  | 'appearance'
  | 'preferences'
  | 'backup';

export function App() {
  const { t, formatNumber } = useI18n();
  const { settings, isLoading, error, togglePlatform, updateSettings, refreshSettings } =
    useSettings();
  const [activeTab, setActiveTab] = useState<TabId>('platforms');

  const handleTogglePlatform = (platform: Platform) => {
    void togglePlatform(platform);
  };

  const handlePopupViewChange = (view: PopupView) => {
    void updateSettings({ preferences: { popupDefaultView: view } });
  };

  if (isLoading) {
    return (
      <div className="options-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error !== null && error !== '') {
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
    { id: 'customDomains', label: t('optionsTabCustomDomains') },
    { id: 'schedule', label: t('optionsTabSchedule') },
    { id: 'whitelist', label: t('optionsTabWhitelist') },
    { id: 'focus', label: t('optionsTabFocus') },
    { id: 'streak', label: t('optionsTabStreak') },
    { id: 'reports', label: t('optionsTabReports') },
    { id: 'appearance', label: t('optionsTabAppearance') },
    { id: 'preferences', label: t('optionsTabPreferences') },
    { id: 'backup', label: t('optionsTabBackup') },
  ];

  const popupViewOptions: { value: PopupView; label: string }[] = [
    { value: 'schedule', label: t('popupViewSchedule') },
    { value: 'platforms', label: t('popupViewPlatforms') },
    { value: 'stats', label: t('popupViewStats') },
    { value: 'focus', label: t('popupViewFocus') },
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
              <h2>{t('popupSectionShortVideo')}</h2>
              <p className="section-description">
                {t('optionsPlatformsDescription')}
              </p>

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
              <h2>{t('popupSectionFullSite')}</h2>
              <p className="section-description">
                {t('optionsFullSiteDescription')}
              </p>

              <div className="platform-list">
                <label className="platform-toggle">
                  <input
                    type="checkbox"
                    checked={settings.platforms.youtube_full}
                    onChange={() => handleTogglePlatform('youtube_full')}
                  />
                  <span>{t('popupPlatformYouTubeFull')}</span>
                </label>
              </div>
            </section>

            <section className="options-section">
              <h2>{t('popupSectionSNS')}</h2>

              <div className="platform-list">
                <label className="platform-toggle">
                  <input
                    type="checkbox"
                    checked={settings.platforms.twitter}
                    onChange={() => handleTogglePlatform('twitter')}
                  />
                  <span>{t('popupPlatformTwitter')}</span>
                </label>

                <label className="platform-toggle">
                  <input
                    type="checkbox"
                    checked={settings.platforms.facebook}
                    onChange={() => handleTogglePlatform('facebook')}
                  />
                  <span>{t('popupPlatformFacebook')}</span>
                </label>

                <label className="platform-toggle">
                  <input
                    type="checkbox"
                    checked={settings.platforms.linkedin}
                    onChange={() => handleTogglePlatform('linkedin')}
                  />
                  <span>{t('popupPlatformLinkedIn')}</span>
                </label>

                <label className="platform-toggle">
                  <input
                    type="checkbox"
                    checked={settings.platforms.threads}
                    onChange={() => handleTogglePlatform('threads')}
                  />
                  <span>{t('popupPlatformThreads')}</span>
                </label>

                <label className="platform-toggle">
                  <input
                    type="checkbox"
                    checked={settings.platforms.snapchat}
                    onChange={() => handleTogglePlatform('snapchat')}
                  />
                  <span>{t('popupPlatformSnapchat')}</span>
                </label>

                <label className="platform-toggle">
                  <input
                    type="checkbox"
                    checked={settings.platforms.reddit}
                    onChange={() => handleTogglePlatform('reddit')}
                  />
                  <span>{t('popupPlatformReddit')}</span>
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

        {/* Custom Domains Tab */}
        {activeTab === 'customDomains' && (
          <section className="options-section">
            <CustomDomains />
          </section>
        )}

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <section className="options-section">
            <Schedule />
          </section>
        )}

        {/* Whitelist Tab */}
        {activeTab === 'whitelist' && (
          <section className="options-section">
            <Whitelist />
          </section>
        )}

        {/* Focus Tab */}
        {activeTab === 'focus' && (
          <>
            <section className="options-section">
              <FocusModeSettings />
            </section>
            <section className="options-section">
              <PomodoroSettings />
            </section>
            <section className="options-section">
              <TimeLimitsConfig />
            </section>
            <section className="options-section">
              <LockdownSettings />
            </section>
          </>
        )}

        {/* Streak Tab */}
        {activeTab === 'streak' && (
          <section className="options-section">
            <StreakSettings />
          </section>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <section className="options-section">
            <TimeReports />
          </section>
        )}

        {/* Appearance Tab */}
        {activeTab === 'appearance' && (
          <>
            <section className="options-section">
              <BlockPageCustomizer />
            </section>
            <section className="options-section">
              <ChallengeSettings />
            </section>
          </>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <section className="options-section">
            <h2>{t('preferencesPopupView')}</h2>
            <p className="section-description">
              {t('preferencesPopupViewDescription')}
            </p>

            <div className="preference-options">
              {popupViewOptions.map((option) => (
                <label key={option.value} className="preference-radio">
                  <input
                    type="radio"
                    name="popupDefaultView"
                    value={option.value}
                    checked={settings.preferences.popupDefaultView === option.value}
                    onChange={() => handlePopupViewChange(option.value)}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
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
