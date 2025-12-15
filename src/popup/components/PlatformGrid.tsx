/**
 * Compact platform toggles grid for popup
 */

import { useState } from 'react';
import { useI18n } from '@/shared/hooks/useI18n';
import type { PlatformSettings, Platform } from '@/shared/types';

interface PlatformGridProps {
  platforms: PlatformSettings;
  enabled: boolean;
  onTogglePlatform: (platform: Platform) => void;
}

const SHORT_VIDEO_PLATFORMS: { key: Platform; labelKey: string }[] = [
  { key: 'youtube', labelKey: 'popupPlatformYouTube' },
  { key: 'tiktok', labelKey: 'popupPlatformTikTok' },
  { key: 'instagram', labelKey: 'popupPlatformInstagram' },
];

const SNS_PLATFORMS: { key: Platform; labelKey: string }[] = [
  { key: 'twitter', labelKey: 'popupPlatformTwitter' },
  { key: 'facebook', labelKey: 'popupPlatformFacebook' },
  { key: 'discord', labelKey: 'popupPlatformDiscord' },
  { key: 'reddit', labelKey: 'popupPlatformReddit' },
  { key: 'twitch', labelKey: 'popupPlatformTwitch' },
  { key: 'linkedin', labelKey: 'popupPlatformLinkedIn' },
  { key: 'threads', labelKey: 'popupPlatformThreads' },
  { key: 'pinterest', labelKey: 'popupPlatformPinterest' },
  { key: 'snapchat', labelKey: 'popupPlatformSnapchat' },
];

export function PlatformGrid({
  platforms,
  enabled,
  onTogglePlatform,
}: PlatformGridProps) {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState(false);

  const activeCount = Object.values(platforms).filter(Boolean).length;

  return (
    <div className="platform-grid-container">
      <button
        type="button"
        className="platform-grid-header"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="platform-grid-title">
          {t('popupSectionPlatforms')}
          <span className="platform-grid-count">{activeCount}</span>
        </span>
        <span className={`platform-grid-chevron ${expanded ? 'expanded' : ''}`}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="6,9 12,15 18,9" />
          </svg>
        </span>
      </button>

      {expanded && (
        <div className="platform-grid-content">
          {/* Short Video Platforms */}
          <div className="platform-grid-section">
            <span className="platform-grid-section-title">
              {t('popupSectionShortVideo')}
            </span>
            <div className="platform-grid">
              {SHORT_VIDEO_PLATFORMS.map((p) => (
                <label
                  key={p.key}
                  className={`platform-grid-item ${!enabled ? 'disabled' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={platforms[p.key]}
                    onChange={() => onTogglePlatform(p.key)}
                    disabled={!enabled}
                  />
                  <span className="platform-grid-name">{t(p.labelKey)}</span>
                </label>
              ))}
            </div>
          </div>

          {/* SNS Platforms */}
          <div className="platform-grid-section">
            <span className="platform-grid-section-title">
              {t('popupSectionSNS')}
            </span>
            <div className="platform-grid">
              {SNS_PLATFORMS.map((p) => (
                <label
                  key={p.key}
                  className={`platform-grid-item ${!enabled ? 'disabled' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={platforms[p.key]}
                    onChange={() => onTogglePlatform(p.key)}
                    disabled={!enabled}
                  />
                  <span className="platform-grid-name">{t(p.labelKey)}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {!expanded && (
        <div className="platform-grid-summary">
          {SHORT_VIDEO_PLATFORMS.filter((p) => platforms[p.key]).map((p) => (
            <span key={p.key} className="platform-chip active">
              {t(p.labelKey)}
            </span>
          ))}
          {SNS_PLATFORMS.filter((p) => platforms[p.key])
            .slice(0, 3)
            .map((p) => (
              <span key={p.key} className="platform-chip active">
                {t(p.labelKey)}
              </span>
            ))}
          {SNS_PLATFORMS.filter((p) => platforms[p.key]).length > 3 && (
            <span className="platform-chip more">
              +{SNS_PLATFORMS.filter((p) => platforms[p.key]).length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
