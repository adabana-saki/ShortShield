/**
 * Compact stats row for popup
 */

import { useI18n } from '@/shared/hooks/useI18n';
import type { BlockingStats, StreakData } from '@/shared/types';

interface CompactStatsProps {
  stats: BlockingStats;
  streakData: StreakData;
  streakEnabled: boolean;
}

export function CompactStats({ stats, streakData, streakEnabled }: CompactStatsProps) {
  const { t, formatNumber } = useI18n();

  return (
    <div className="compact-stats">
      {streakEnabled && streakData.currentStreak > 0 && (
        <div className="compact-stat streak">
          <span className="compact-stat-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </span>
          <span className="compact-stat-value">{streakData.currentStreak}</span>
          <span className="compact-stat-label">{t('streakDays')}</span>
        </div>
      )}
      <div className="compact-stat">
        <span className="compact-stat-value">{formatNumber(stats.blockedToday)}</span>
        <span className="compact-stat-label">{t('popupStatsToday')}</span>
      </div>
      <div className="compact-stat">
        <span className="compact-stat-value">{formatNumber(stats.blockedTotal)}</span>
        <span className="compact-stat-label">{t('popupStatsTotal')}</span>
      </div>
    </div>
  );
}
