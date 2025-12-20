/**
 * Legal information and seller details for compliance
 * Update these values with your actual business information
 */

/**
 * Seller information for Japanese Commercial Transaction Law (特定商取引法)
 * Required for selling digital products in Japan
 */
export const SELLER_INFO = {
  /** Business name (屋号) or company name */
  businessName: 'ADA LAB',
  /** Representative name (代表者名) */
  representative: 'Adabana Saki',
  /** Business address (所在地) - disclosed upon request per 特定商取引法 */
  address: '',
  /** Contact email address */
  email: 'info.adalabtech@gmail.com',
  /** Contact phone (optional but recommended) */
  phone: '',
  /** Business registration number (if applicable) */
  registrationNumber: '',
} as const;

/**
 * Pricing information
 * All prices are in JPY and include tax
 */
export const PRICING = {
  monthly: {
    amount: 300,
    currency: 'JPY',
    interval: 'month' as const,
    sku: 'premium_monthly',
  },
  yearly: {
    amount: 3000,
    currency: 'JPY',
    interval: 'year' as const,
    sku: 'premium_yearly',
    savings: 600, // 2 months free
  },
} as const;

/**
 * Refund policy settings
 */
export const REFUND_POLICY = {
  /** Refund window in hours (Chrome Web Store default is 48 hours) */
  refundWindowHours: 48,
  /** Whether refunds are automatic or require review */
  automaticRefunds: true,
  /** EU cooling-off period in days */
  euCoolingOffDays: 14,
} as const;

/**
 * Subscription terms
 */
export const SUBSCRIPTION_TERMS = {
  /** Days before renewal to send notification */
  renewalNotificationDays: 7,
  /** Auto-renewal enabled by default */
  autoRenewalDefault: true,
  /** Trial period in days (0 = no trial) */
  trialDays: 0,
} as const;

/**
 * Legal document URLs (can be external links or internal routes)
 */
export const LEGAL_URLS = {
  termsOfService: '/legal/terms',
  privacyPolicy: '/legal/privacy',
  commercialTransaction: '/legal/transaction',
  chromeWebStorePolicy:
    'https://support.google.com/chrome_webstore/answer/1060570',
  googlePaymentsPolicy: 'https://support.google.com/googleplay/answer/2479637',
} as const;

/**
 * Data collection disclosure for privacy policy
 */
export const DATA_COLLECTION = {
  /** Types of data collected */
  collectedData: [
    'blocking_statistics', // Number of blocks, platforms blocked
    'usage_patterns', // Feature usage for improvement
    'subscription_status', // Premium subscription state
    'user_preferences', // Settings and configurations
  ],
  /** Data NOT collected */
  notCollectedData: [
    'browsing_history',
    'personal_identifiers',
    'location_data',
    'payment_details', // Handled by Google
  ],
  /** Data retention period */
  retentionPeriod: 'Until account deletion or 2 years of inactivity',
  /** Third parties data is shared with */
  thirdParties: [
    {
      name: 'Google',
      purpose: 'Payment processing via Chrome Web Store',
      dataShared: ['subscription_status'],
    },
  ],
} as const;

/**
 * Contact information for support
 */
export const SUPPORT_INFO = {
  email: SELLER_INFO.email,
  responseTimeHours: 48,
  languages: ['ja', 'en'],
} as const;
