/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument */
/**
 * Log viewer component
 * Displays blocking history and allows filtering/clearing
 */

import { useState, useCallback, useEffect } from 'react';
import { useI18n } from '@/shared/hooks/useI18n';
import type { Platform, LogEntry } from '@/shared/types';
import { sendMessage } from '@/shared/utils/storage';
import { createLogger } from '@/shared/utils/logger';

const logger = createLogger('log-viewer');

/** Number of logs to display per page */
const LOGS_PER_PAGE = 50;

interface LogItemProps {
  log: LogEntry;
}

/**
 * Single log entry display
 */
function LogItem({ log }: LogItemProps) {
  const { formatDate } = useI18n();

  const platformIcons: Record<Platform, string> = {
    youtube: '▶️',
    tiktok: '🎵',
    instagram: '📷',
  };

  const actionLabels: Record<string, string> = {
    hide: 'Hidden',
    blur: 'Blurred',
    redirect: 'Redirected',
    remove: 'Removed',
  };

  return (
    <div className="log-item">
      <span className="log-icon">{platformIcons[log.platform]}</span>
      <div className="log-info">
        <div className="log-main">
          <span className="log-platform">{log.platform}</span>
          <span className="log-action">
            {actionLabels[log.action] ?? log.action}
          </span>
        </div>
        {log.url && (
          <a
            href={log.url}
            target="_blank"
            rel="noopener noreferrer"
            className="log-url"
          >
            {log.url.length > 60 ? `${log.url.slice(0, 60)}...` : log.url}
          </a>
        )}
        <span className="log-timestamp">
          {formatDate(new Date(log.timestamp))}
        </span>
      </div>
    </div>
  );
}

/**
 * Log viewer component
 */
export function LogViewer() {
  const { t } = useI18n();

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClearing, setIsClearing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [platformFilter, setPlatformFilter] = useState<Platform | 'all'>('all');
  const [page, setPage] = useState(0);

  /**
   * Load logs from storage
   */
  const loadLogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await sendMessage({ type: 'GET_LOGS' });

      if (response.success && Array.isArray(response.data)) {
        setLogs(response.data as LogEntry[]);
      } else {
        setError(t('logsLoadError'));
      }
    } catch (err) {
      logger.error('Failed to load logs', { error: err });
      setError(t('logsLoadError'));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  /**
   * Clear all logs
   */
  const handleClearLogs = useCallback(async () => {
    if (!confirm(t('logsClearConfirm'))) {
      return;
    }

    setIsClearing(true);
    setError(null);

    try {
      const response = await sendMessage({ type: 'CLEAR_LOGS' });

      if (response.success) {
        setLogs([]);
        setPage(0);
        logger.info('Logs cleared successfully');
      } else {
        setError(t('logsClearError'));
      }
    } catch (err) {
      logger.error('Failed to clear logs', { error: err });
      setError(t('logsClearError'));
    } finally {
      setIsClearing(false);
    }
  }, [t]);

  // Load logs on mount
  useEffect(() => {
    void loadLogs();
  }, [loadLogs]);

  // Filter logs by platform
  const filteredLogs =
    platformFilter === 'all'
      ? logs
      : logs.filter((log) => log.platform === platformFilter);

  // Paginate logs
  const startIndex = page * LOGS_PER_PAGE;
  const paginatedLogs = filteredLogs.slice(
    startIndex,
    startIndex + LOGS_PER_PAGE
  );
  const totalPages = Math.ceil(filteredLogs.length / LOGS_PER_PAGE);

  return (
    <div className="log-viewer-section">
      <div className="log-viewer-header">
        <h2>{t('logsTitle')}</h2>
        <div className="log-viewer-actions">
          <button
            className="log-refresh-button"
            onClick={() => void loadLogs()}
            disabled={isLoading}
          >
            {t('logsRefresh')}
          </button>
          <button
            className="log-clear-button"
            onClick={() => void handleClearLogs()}
            disabled={isClearing || logs.length === 0}
          >
            {isClearing ? t('logsClearing') : t('logsClear')}
          </button>
        </div>
      </div>

      <p className="section-description">{t('logsDescription')}</p>

      {/* Filters */}
      <div className="log-filters">
        <label>
          {t('logsFilterPlatform')}:
          <select
            value={platformFilter}
            onChange={(e) => {
              setPlatformFilter(e.target.value as Platform | 'all');
              setPage(0);
            }}
          >
            <option value="all">{t('logsFilterAll')}</option>
            <option value="youtube">{t('popupPlatformYouTube')}</option>
            <option value="tiktok">{t('popupPlatformTikTok')}</option>
            <option value="instagram">{t('popupPlatformInstagram')}</option>
          </select>
        </label>
        <span className="log-count">
          {t('logsCount', { count: String(filteredLogs.length) })}
        </span>
      </div>

      {/* Error message */}
      {error && <p className="log-viewer-error">{error}</p>}

      {/* Loading state */}
      {isLoading ? (
        <div className="log-viewer-loading">{t('logsLoading')}</div>
      ) : filteredLogs.length === 0 ? (
        <div className="log-viewer-empty">{t('logsEmpty')}</div>
      ) : (
        <>
          {/* Log list */}
          <div className="log-list">
            {paginatedLogs.map((log) => (
              <LogItem key={log.id} log={log} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="log-pagination">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                {t('logsPrevious')}
              </button>
              <span>
                {t('logsPage', {
                  current: String(page + 1),
                  total: String(totalPages),
                })}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
              >
                {t('logsNext')}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
