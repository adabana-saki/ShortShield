/**
 * Schedule utility functions for time-based blocking
 */

import type { ScheduleConfig, TimeRange, DayOfWeek } from '@/shared/types';

/**
 * Convert hours and minutes to minutes since midnight
 */
function toMinutes(hour: number, minute: number): number {
  return hour * 60 + minute;
}

/**
 * Check if a time is within a time range
 */
function isTimeInRange(currentMinutes: number, range: TimeRange): boolean {
  const startMinutes = toMinutes(range.startHour, range.startMinute);
  const endMinutes = toMinutes(range.endHour, range.endMinute);

  // Handle overnight ranges (e.g., 22:00 - 06:00)
  if (endMinutes < startMinutes) {
    return currentMinutes >= startMinutes || currentMinutes < endMinutes;
  }

  return currentMinutes >= startMinutes && currentMinutes < endMinutes;
}

/**
 * Check if blocking should be active based on schedule
 * Returns true if blocking should be active (within scheduled time)
 */
export function isScheduleActive(
  schedule: ScheduleConfig,
  now: Date = new Date()
): boolean {
  // If schedule is disabled, don't affect blocking
  if (!schedule.enabled) {
    return true; // Return true so it doesn't block when schedule is off
  }

  const currentDay = now.getDay() as DayOfWeek;
  const currentMinutes = toMinutes(now.getHours(), now.getMinutes());

  // Check if current day is an active day
  if (!schedule.activeDays.includes(currentDay)) {
    return false; // Not an active day, don't block
  }

  // Check if current time is within any of the time ranges
  for (const range of schedule.timeRanges) {
    if (isTimeInRange(currentMinutes, range)) {
      return true; // Within a blocking time range
    }
  }

  return false; // Not within any time range
}

/**
 * Format time for display (HH:MM)
 */
export function formatTime(hour: number, minute: number): string {
  const h = hour.toString().padStart(2, '0');
  const m = minute.toString().padStart(2, '0');
  return `${h}:${m}`;
}

/**
 * Parse time string (HH:MM) to hour and minute
 */
export function parseTime(
  timeStr: string
): { hour: number; minute: number } | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(timeStr);
  if (match === null) {
    return null;
  }

  const hour = parseInt(match[1] ?? '0', 10);
  const minute = parseInt(match[2] ?? '0', 10);

  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    return null;
  }

  return { hour, minute };
}

/**
 * Get day name for a day of week
 */
export function getDayName(day: DayOfWeek, locale: string = 'en'): string {
  const date = new Date(2024, 0, day === 0 ? 7 : day); // Jan 2024, Mon=1...Sun=7
  return date.toLocaleDateString(locale, { weekday: 'short' });
}

/**
 * Validate a time range
 */
export function isValidTimeRange(range: TimeRange): boolean {
  return (
    range.startHour >= 0 &&
    range.startHour <= 23 &&
    range.startMinute >= 0 &&
    range.startMinute <= 59 &&
    range.endHour >= 0 &&
    range.endHour <= 23 &&
    range.endMinute >= 0 &&
    range.endMinute <= 59
  );
}
