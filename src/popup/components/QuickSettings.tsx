/**
 * Platform quick toggle settings
 */

import { useI18n } from '@/shared/hooks/useI18n';
import type { PlatformSettings, Platform } from '@/shared/types';

interface QuickSettingsProps {
  platforms: PlatformSettings;
  enabled: boolean;
  onTogglePlatform: (platform: Platform) => void;
}

interface PlatformConfig {
  key: Platform;
  labelKey: string;
  icon: string;
}

/**
 * Short video platforms configuration
 */
const SHORT_VIDEO_PLATFORMS: PlatformConfig[] = [
  { key: 'youtube', labelKey: 'popupPlatformYouTube', icon: '📺' },
  { key: 'tiktok', labelKey: 'popupPlatformTikTok', icon: '🎵' },
  { key: 'instagram', labelKey: 'popupPlatformInstagram', icon: '📷' },
];

/**
 * Full site blocking platforms
 */
const FULL_SITE_PLATFORMS: PlatformConfig[] = [
  { key: 'youtube_full', labelKey: 'popupPlatformYouTubeFull', icon: '🚫' },
];

/**
 * SNS platforms configuration
 */
const SNS_PLATFORMS: PlatformConfig[] = [
  { key: 'twitter', labelKey: 'popupPlatformTwitter', icon: '🐦' },
  { key: 'facebook', labelKey: 'popupPlatformFacebook', icon: '👤' },
  { key: 'linkedin', labelKey: 'popupPlatformLinkedIn', icon: '💼' },
  { key: 'threads', labelKey: 'popupPlatformThreads', icon: '🧵' },
  { key: 'snapchat', labelKey: 'popupPlatformSnapchat', icon: '👻' },
  { key: 'reddit', labelKey: 'popupPlatformReddit', icon: '🤖' },
];

interface PlatformToggleProps {
  config: PlatformConfig;
  isEnabled: boolean;
  globalEnabled: boolean;
  onToggle: () => void;
  t: (key: string) => string;
}

function PlatformToggle({
  config,
  isEnabled,
  globalEnabled,
  onToggle,
  t,
}: PlatformToggleProps) {
  return (
    <div className="platform-item">
      <span className="platform-name">
        <span className="platform-icon">{config.icon}</span>
        {t(config.labelKey)}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={isEnabled}
        disabled={!globalEnabled}
        onClick={onToggle}
        className={`platform-toggle ${isEnabled ? 'platform-toggle-enabled' : 'platform-toggle-disabled'} ${!globalEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span
          aria-hidden="true"
          className={`platform-toggle-knob ${isEnabled ? 'platform-toggle-knob-enabled' : 'platform-toggle-knob-disabled'}`}
        />
      </button>
    </div>
  );
}

export function QuickSettings({
  platforms,
  enabled,
  onTogglePlatform,
}: QuickSettingsProps) {
  const { t } = useI18n();

  return (
    <div className="platforms-container">
      {/* Short Video Platforms Section */}
      <div className="platforms-section">
        <div className="platforms-title">{t('popupSectionShortVideo')}</div>
        <div className="space-y-1">
          {SHORT_VIDEO_PLATFORMS.map((config) => (
            <PlatformToggle
              key={config.key}
              config={config}
              isEnabled={platforms[config.key]}
              globalEnabled={enabled}
              onToggle={() => onTogglePlatform(config.key)}
              t={t}
            />
          ))}
        </div>
      </div>

      {/* Full Site Blocking Section */}
      <div className="platforms-section">
        <div className="platforms-title">{t('popupSectionFullSite')}</div>
        <div className="space-y-1">
          {FULL_SITE_PLATFORMS.map((config) => (
            <PlatformToggle
              key={config.key}
              config={config}
              isEnabled={platforms[config.key]}
              globalEnabled={enabled}
              onToggle={() => onTogglePlatform(config.key)}
              t={t}
            />
          ))}
        </div>
      </div>

      {/* SNS Platforms Section */}
      <div className="platforms-section">
        <div className="platforms-title">{t('popupSectionSNS')}</div>
        <div className="space-y-1">
          {SNS_PLATFORMS.map((config) => (
            <PlatformToggle
              key={config.key}
              config={config}
              isEnabled={platforms[config.key]}
              globalEnabled={enabled}
              onToggle={() => onTogglePlatform(config.key)}
              t={t}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
