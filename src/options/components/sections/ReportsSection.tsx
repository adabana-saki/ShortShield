/**
 * Reports section - Time tracking and analytics
 */

import { useI18n } from '@/shared/hooks/useI18n';
import { SectionHeader } from '../common/SectionHeader';
import { TimeReports } from '../TimeReports';

export function ReportsSection() {
  const { t } = useI18n();

  return (
    <div className="settings-section">
      <SectionHeader
        title={t('sidebarReports')}
        description={t('reportsDescription')}
        icon={
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
        }
      />
      <TimeReports />
    </div>
  );
}
