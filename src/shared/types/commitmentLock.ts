/**
 * Commitment Lock types for preventing easy unlock of blocking rules
 * Implements a friction system inspired by Freedom App's Locked Mode
 */

/**
 * Commitment Lock levels
 * Level 1: Moderate - Free (30s wait + intention)
 * Level 2: Strong - Free (challenges + escalating cooldown)
 * Level 3: Maximum - Premium (time lock + weekly limit)
 */
export type CommitmentLockLevel = 1 | 2 | 3;

/**
 * Commitment Lock settings stored in user preferences
 */
export interface CommitmentLockSettings {
  /** Whether Commitment Lock is enabled */
  readonly enabled: boolean;
  /** Current friction level (1-3) */
  readonly level: CommitmentLockLevel;

  // Level 1+ settings
  /** Wait time before unlock can proceed (30-300 seconds) */
  readonly confirmationWaitSeconds: number;
  /** Cooldown period after successful unlock (5-60 minutes) */
  readonly cooldownAfterUnlockMinutes: number;
  /** Whether to require typed intention statement */
  readonly requireIntentionStatement: boolean;
  /** Minimum character length for intention (10-100) */
  readonly intentionMinLength: number;

  // Level 2+ settings
  /** Number of challenges to solve consecutively (1-5) */
  readonly challengeCount: number;
  /** Whether all challenges must be solved consecutively without error */
  readonly challengesMustBeConsecutive: boolean;
  /** Whether cooldown increases with failed attempts */
  readonly escalatingCooldown: boolean;
  /** Number of daily attempts before showing warning */
  readonly dailyAttemptWarningThreshold: number;

  // Level 3 (Premium) settings
  /** Whether time-based lock is enabled */
  readonly timeLockEnabled: boolean;
  /** Duration of time lock in hours (1-168, i.e., up to 1 week) */
  readonly timeLockHours: number;
  /** Maximum unlocks allowed per week (1-3) */
  readonly weeklyUnlockLimit: number;
  /** Whether unlock is restricted to certain hours */
  readonly scheduleRestriction: boolean;
  /** Allowed hours for unlock (only if scheduleRestriction is true) */
  readonly allowedUnlockHours?: {
    readonly start: number; // 0-23
    readonly end: number; // 0-23
  };
  /** Nuclear option: completely disable unlock ability */
  readonly nuclearModeEnabled: boolean;
}

/**
 * Runtime state for Commitment Lock (stored separately from settings)
 */
export interface CommitmentLockState {
  /** Timestamp of last successful unlock */
  readonly lastUnlockAt: number | null;
  /** Timestamp of last unlock attempt */
  readonly lastAttemptAt: number | null;
  /** Number of unlock attempts today */
  readonly todayAttempts: number;
  /** Number of successful unlocks today */
  readonly todaySuccesses: number;
  /** Number of unlock attempts this week */
  readonly weekAttempts: number;
  /** Number of successful unlocks this week */
  readonly weekSuccesses: number;
  /** Remaining weekly unlocks (for Level 3) */
  readonly weeklyUnlocksRemaining: number;
  /** Timestamp when current cooldown ends */
  readonly currentCooldownEndsAt: number | null;
  /** Timestamp when time lock ends (for Level 3) */
  readonly timeLockEndsAt: number | null;
  /** Number of consecutive failed attempts */
  readonly consecutiveFailures: number;
  /** Date string for daily reset tracking (YYYY-MM-DD) */
  readonly lastDailyResetDate: string;
  /** Date string for weekly reset tracking (YYYY-MM-DD, Monday of the week) */
  readonly lastWeeklyResetDate: string;
  /** Current challenge progress (if in progress) */
  readonly inProgressChallenge: {
    readonly startedAt: number;
    readonly correctAnswers: number;
    readonly totalQuestions: number;
    readonly currentQuestionIndex: number;
  } | null;
}

/**
 * Individual unlock attempt record for history
 */
export interface UnlockAttempt {
  /** Timestamp of attempt */
  readonly timestamp: number;
  /** Whether unlock was successful */
  readonly success: boolean;
  /** Friction level at time of attempt */
  readonly frictionLevel: CommitmentLockLevel;
  /** Number of challenges passed */
  readonly challengesPassed: number;
  /** Number of challenges failed */
  readonly challengesFailed: number;
  /** User's intention statement (if provided) */
  readonly intentionStatement?: string;
  /** Time taken from start to completion (ms) */
  readonly timeToComplete?: number;
  /** Reason for failure (if failed) */
  readonly failureReason?: UnlockFailureReason;
}

/**
 * Reasons why an unlock attempt might fail
 */
export type UnlockFailureReason =
  | 'cooldown_active'
  | 'time_lock_active'
  | 'weekly_limit_reached'
  | 'challenge_failed'
  | 'challenge_timeout'
  | 'intention_too_short'
  | 'nuclear_mode'
  | 'outside_allowed_hours'
  | 'cancelled_by_user';

/**
 * History of unlock attempts for statistics
 */
export interface UnlockHistory {
  /** Array of unlock attempts */
  readonly attempts: readonly UnlockAttempt[];
  /** Date of last history cleanup */
  readonly lastCleanupDate: string;
  /** Maximum attempts to store */
  readonly maxAttempts: number;
}

/**
 * Result of checking if unlock is allowed
 */
export interface UnlockCheckResult {
  /** Whether unlock is currently allowed */
  readonly allowed: boolean;
  /** Reason if not allowed */
  readonly reason?: UnlockFailureReason;
  /** Seconds until unlock is allowed (if in cooldown/timelock) */
  readonly waitSeconds?: number;
  /** Additional message for user */
  readonly message?: string;
}

/**
 * Progress through the unlock flow
 */
export type UnlockFlowStep =
  | 'initial' // Starting point
  | 'waiting' // Waiting for confirmation period
  | 'intention' // Entering intention statement
  | 'challenges' // Solving challenges
  | 'final_confirm' // Final confirmation
  | 'completed' // Successfully unlocked
  | 'failed'; // Failed to unlock

/**
 * Current state of unlock flow
 */
export interface UnlockFlowState {
  /** Current step in the flow */
  readonly step: UnlockFlowStep;
  /** Timestamp when flow started */
  readonly startedAt: number;
  /** Seconds remaining in wait period */
  readonly waitSecondsRemaining: number;
  /** User's intention text */
  readonly intentionText: string;
  /** Challenge progress */
  readonly challengeProgress: {
    readonly current: number;
    readonly total: number;
    readonly correctCount: number;
  };
  /** Error message if any */
  readonly error?: string;
}

/**
 * Premium subscription state
 */
export interface PremiumState {
  /** Whether user has premium */
  readonly isPremium: boolean;
  /** Type of subscription */
  readonly subscriptionType: 'none' | 'monthly' | 'yearly' | 'lifetime';
  /** Expiration timestamp (null for lifetime) */
  readonly expiresAt: number | null;
  /** List of enabled premium features */
  readonly features: readonly string[];
}

/**
 * Premium feature identifiers
 */
export type PremiumFeature =
  | 'commitment_lock_level_3'
  | 'time_lock'
  | 'weekly_limit'
  | 'schedule_restriction'
  | 'nuclear_mode'
  | 'detailed_statistics'
  | 'cloud_backup';

/**
 * Statistics for Commitment Lock
 */
export interface CommitmentLockStats {
  /** Total unlock attempts all time */
  readonly totalAttempts: number;
  /** Total successful unlocks all time */
  readonly totalSuccesses: number;
  /** Success rate percentage */
  readonly successRate: number;
  /** Average time to complete unlock (ms) */
  readonly averageTimeToUnlock: number;
  /** Most common failure reason */
  readonly mostCommonFailure: UnlockFailureReason | null;
  /** Current streak of days without unlock */
  readonly noUnlockStreak: number;
  /** Longest streak of days without unlock */
  readonly longestNoUnlockStreak: number;
}

/**
 * Type guard for CommitmentLockSettings validation
 */
export function isValidCommitmentLockSettings(
  value: unknown
): value is CommitmentLockSettings {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const obj = value as Record<string, unknown>;

  return (
    typeof obj.enabled === 'boolean' &&
    typeof obj.level === 'number' &&
    obj.level >= 1 &&
    obj.level <= 3 &&
    typeof obj.confirmationWaitSeconds === 'number' &&
    typeof obj.cooldownAfterUnlockMinutes === 'number'
  );
}

/**
 * Type guard for CommitmentLockState validation
 */
export function isValidCommitmentLockState(
  value: unknown
): value is CommitmentLockState {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const obj = value as Record<string, unknown>;

  return (
    (obj.lastUnlockAt === null || typeof obj.lastUnlockAt === 'number') &&
    typeof obj.todayAttempts === 'number' &&
    typeof obj.consecutiveFailures === 'number'
  );
}
