/**
 * React hook for i18n functionality
 */

import { useCallback, useMemo } from 'react';
import {
  t,
  formatNumber,
  formatDate,
  formatRelativeTime,
  getUILanguage,
} from '@/shared/utils/i18n';

/**
 * Hook for i18n functionality in React components
 */
export function useI18n() {
  const locale = useMemo(() => getUILanguage(), []);

  const translate = useCallback(
    (key: string, substitutions?: string | string[]) => {
      return t(key, substitutions);
    },
    []
  );

  const number = useCallback(
    (value: number) => formatNumber(value, locale),
    [locale]
  );

  const date = useCallback(
    (value: Date, options?: Intl.DateTimeFormatOptions) => {
      return formatDate(value, options, locale);
    },
    [locale]
  );

  const relativeTime = useCallback(
    (value: Date) => {
      return formatRelativeTime(value, locale);
    },
    [locale]
  );

  return {
    /** Translate a message key */
    t: translate,
    /** Current locale */
    locale,
    /** Format a number */
    formatNumber: number,
    /** Format a date */
    formatDate: date,
    /** Format relative time */
    formatRelativeTime: relativeTime,
  };
}
