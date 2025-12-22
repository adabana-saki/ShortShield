/**
 * Pricing card component for subscription plans
 */

import { useI18n } from '@/shared/hooks/useI18n';

interface PricingCardProps {
  plan: 'monthly' | 'yearly';
  amount: number;
  originalAmount?: number;
  interval: string;
  savings?: number;
  selected: boolean;
  onSelect: () => void;
  recommended?: boolean;
}

export function PricingCard({
  plan,
  amount,
  originalAmount,
  interval,
  savings,
  selected,
  onSelect,
  recommended,
}: PricingCardProps) {
  const { locale } = useI18n();
  const isJapanese = locale === 'ja';

  const planLabel =
    plan === 'monthly'
      ? isJapanese
        ? '月額プラン'
        : 'Monthly'
      : isJapanese
        ? '年額プラン'
        : 'Yearly';

  const intervalLabel =
    interval === 'month'
      ? isJapanese
        ? '/月'
        : '/mo'
      : isJapanese
        ? '/年'
        : '/yr';

  return (
    <button
      type="button"
      className={`pricing-card ${selected ? 'selected' : ''} ${recommended === true ? 'recommended' : ''}`}
      onClick={onSelect}
    >
      {recommended === true && (
        <span className="pricing-badge">
          {isJapanese ? 'おすすめ' : 'Best Value'}
        </span>
      )}

      <div className="pricing-plan-name">{planLabel}</div>

      <div className="pricing-amount">
        <span className="pricing-currency">¥</span>
        <span className="pricing-value">{amount.toLocaleString()}</span>
        <span className="pricing-interval">{intervalLabel}</span>
      </div>

      {originalAmount !== undefined && originalAmount > 0 && (
        <div className="pricing-original">
          <span className="pricing-strike">
            ¥{originalAmount.toLocaleString()}
          </span>
        </div>
      )}

      {savings !== undefined && savings > 0 && (
        <div className="pricing-savings">
          {isJapanese
            ? `¥${savings.toLocaleString()}お得`
            : `Save ¥${savings.toLocaleString()}`}
        </div>
      )}

      <div className="pricing-tax">{isJapanese ? '税込' : 'tax included'}</div>

      <div className={`pricing-radio ${selected ? 'checked' : ''}`}>
        <div className="pricing-radio-inner" />
      </div>
    </button>
  );
}
