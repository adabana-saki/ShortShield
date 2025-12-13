/**
 * Statistics display component
 */

import { useI18n } from '@/shared/hooks/useI18n';
import type { BlockingStats } from '@/shared/types';

interface StatsProps {
  stats: BlockingStats;
}

export function Stats({ stats }: StatsProps) {
  const { t, formatNumber } = useI18n();

  return (
    <div className="stats-container">
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-value">{formatNumber(stats.blockedToday)}</div>
          <div className="stat-label">{t('popupStatsToday')}</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{formatNumber(stats.blockedTotal)}</div>
          <div className="stat-label">{t('popupStatsTotal')}</div>
        </div>
      </div>
    </div>
  );
}
