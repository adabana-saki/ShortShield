/* eslint-disable security/detect-object-injection */
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

const PLATFORMS: PlatformConfig[] = [
  { key: 'youtube', labelKey: 'popupPlatformYouTube', icon: '📺' },
  { key: 'tiktok', labelKey: 'popupPlatformTikTok', icon: '🎵' },
  { key: 'instagram', labelKey: 'popupPlatformInstagram', icon: '📷' },
];

export function QuickSettings({
  platforms,
  enabled,
  onTogglePlatform,
}: QuickSettingsProps) {
  const { t } = useI18n();

  return (
    <div className="platforms-container">
      <div className="platforms-title">{t('optionsPlatformsTitle')}</div>
      <div className="space-y-1">
        {PLATFORMS.map(({ key, labelKey, icon }) => (
          <div key={key} className="platform-item">
            <span className="platform-name">
              <span className="platform-icon">{icon}</span>
              {t(labelKey)}
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={platforms[key]}
              disabled={!enabled}
              onClick={() => onTogglePlatform(key)}
              className={`platform-toggle ${platforms[key] ? 'platform-toggle-enabled' : 'platform-toggle-disabled'} ${!enabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span
                aria-hidden="true"
                className={`platform-toggle-knob ${platforms[key] ? 'platform-toggle-knob-enabled' : 'platform-toggle-knob-disabled'}`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
