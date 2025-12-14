/**
 * Main popup application component
 */

import { useState, useEffect, useCallback } from 'react';
import browser from 'webextension-polyfill';
import { useSettings } from '@/shared/hooks/useSettings';
import { useI18n } from '@/shared/hooks/useI18n';
import { Toggle } from './components/Toggle';
import { Stats } from './components/Stats';
import { QuickSettings } from './components/QuickSettings';
import { ScheduleWidget } from './components/ScheduleWidget';
import { FocusButton } from './components/FocusButton';
import { FocusCountdown } from './components/FocusCountdown';
import { PomodoroTimer } from './components/PomodoroTimer';
import { PomodoroControls } from './components/PomodoroControls';
import type { Platform, PopupView, FocusModeState, PomodoroState, TimeLimitsState, StreakData, MessageResponse } from '@/shared/types';
import { createMessage } from '@/shared/types/messages';
import { DEFAULT_FOCUS_STATE, DEFAULT_POMODORO_STATE, DEFAULT_TIME_LIMITS_STATE, DEFAULT_STREAK_DATA } from '@/shared/constants';

export function App() {
  const { t } = useI18n();
  const {
    settings,
    isLoading,
    error,
    toggleEnabled,
    togglePlatform,
    refreshSettings,
  } = useSettings();

  // Use user's preferred default view
  const [activeView, setActiveView] = useState<PopupView | null>(null);

  // Focus mode state
  const [focusState, setFocusState] = useState<FocusModeState>(DEFAULT_FOCUS_STATE);

  // Pomodoro state
  const [pomodoroState, setPomodoroState] = useState<PomodoroState>(DEFAULT_POMODORO_STATE);

  // Time limits state
  const [timeLimitsState, setTimeLimitsState] = useState<TimeLimitsState>(DEFAULT_TIME_LIMITS_STATE);

  // Streak data state
  const [streakData, setStreakData] = useState<StreakData>(DEFAULT_STREAK_DATA);

  // Get the actual view to display (use preference if not set)
  const currentView = activeView ?? settings.preferences.popupDefaultView;

  // Fetch focus and pomodoro state on mount
  useEffect(() => {
    const fetchFocusState = async () => {
      try {
        const message = createMessage({
          type: 'FOCUS_GET_STATE' as const,
        });
        const response = (await browser.runtime.sendMessage(message));
        if (response.success && response.data) {
          setFocusState(response.data);
        }
      } catch {
        // Ignore errors, use default state
      }
    };

    const fetchPomodoroState = async () => {
      try {
        const message = createMessage({
          type: 'POMODORO_GET_STATE' as const,
        });
        const response = (await browser.runtime.sendMessage(message));
        if (response.success && response.data) {
          setPomodoroState(response.data);
        }
      } catch {
        // Ignore errors, use default state
      }
    };

    const fetchTimeLimitsState = async () => {
      try {
        const message = createMessage({
          type: 'TIME_GET_USAGE' as const,
        });
        const response = (await browser.runtime.sendMessage(message));
        if (response.success && response.data) {
          setTimeLimitsState(response.data);
        }
      } catch {
        // Ignore errors, use default state
      }
    };

    const fetchStreakData = async () => {
      try {
        const message = createMessage({
          type: 'STREAK_GET_DATA' as const,
        });
        const response = (await browser.runtime.sendMessage(message));
        if (response.success && response.data) {
          setStreakData(response.data);
        }
      } catch {
        // Ignore errors, use default state
      }
    };

    void fetchFocusState();
    void fetchPomodoroState();
    void fetchTimeLimitsState();
    void fetchStreakData();

    // Poll for updates every second when timers are active
    const interval = setInterval(() => {
      void fetchFocusState();
      void fetchPomodoroState();
      void fetchTimeLimitsState();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleFocusStateChange = useCallback((newState: FocusModeState) => {
    setFocusState(newState);
  }, []);

  const handlePomodoroStateChange = useCallback((newState: PomodoroState) => {
    setPomodoroState(newState);
  }, []);

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
  if (error !== null && error !== '') {
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

  const views: { id: PopupView; label: string }[] = [
    { id: 'focus', label: t('popupViewFocus') },
    { id: 'schedule', label: t('popupViewSchedule') },
    { id: 'platforms', label: t('popupViewPlatforms') },
    { id: 'stats', label: t('popupViewStats') },
  ];

  return (
    <div className="popup-container">
      {/* Header */}
      <header className="popup-header">
        <h1 className="popup-title">{t('popupTitle')}</h1>
        <span
          className={`status-badge ${settings.enabled ? 'status-badge-enabled' : 'status-badge-disabled'}`}
        >
          {settings.enabled
            ? t('popupStatusEnabled')
            : t('popupStatusDisabled')}
        </span>
      </header>

      {/* Main toggle */}
      <Toggle enabled={settings.enabled} onToggle={handleToggleEnabled} />

      {/* View tabs */}
      <div className="popup-tabs">
        {views.map((view) => (
          <button
            key={view.id}
            type="button"
            className={`popup-tab ${currentView === view.id ? 'active' : ''}`}
            onClick={() => setActiveView(view.id)}
          >
            {view.label}
          </button>
        ))}
      </div>

      {/* Scrollable content */}
      <div className="popup-content">
        {/* Focus View */}
        {currentView === 'focus' && (
          <div className="focus-view">
            {/* Focus Mode Section */}
            <div className="focus-section">
              <h3 className="focus-section-title">{t('focusModeTitle')}</h3>
              {focusState.isActive ? (
                <FocusCountdown
                  focusState={focusState}
                  onStateChange={handleFocusStateChange}
                />
              ) : null}
              <FocusButton
                focusState={focusState}
                onStateChange={handleFocusStateChange}
                disabled={!settings.focusMode.enabled}
              />
            </div>

            {/* Pomodoro Section */}
            <div className="pomodoro-section">
              <h3 className="pomodoro-section-title">{t('pomodoroTitle')}</h3>
              <PomodoroTimer
                pomodoroState={pomodoroState}
                onStateChange={handlePomodoroStateChange}
              />
              <PomodoroControls
                pomodoroState={pomodoroState}
                onStateChange={handlePomodoroStateChange}
                disabled={!settings.pomodoro.enabled}
              />
            </div>
          </div>
        )}

        {/* Schedule View */}
        {currentView === 'schedule' && <ScheduleWidget />}

        {/* Platforms View */}
        {currentView === 'platforms' && (
          <QuickSettings
            platforms={settings.platforms}
            enabled={settings.enabled}
            onTogglePlatform={handleTogglePlatform}
          />
        )}

        {/* Stats View */}
        {currentView === 'stats' && (
          <Stats
            stats={settings.stats}
            timeLimitsState={timeLimitsState}
            streakData={streakData}
            settings={settings}
          />
        )}
      </div>

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
