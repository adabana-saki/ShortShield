/**
 * Premium purchase flow with legal compliance
 * Includes auto-renewal warnings and terms agreement
 */

import { useState, useCallback } from 'react';
import { useI18n } from '@/shared/hooks/useI18n';
import { PRICING, REFUND_POLICY, LEGAL_URLS } from '@/shared/constants/legal';
import { PricingCard } from './PricingCard';

type PurchaseStep = 'select' | 'confirm' | 'processing' | 'success' | 'error';

interface PurchaseFlowProps {
  onClose?: () => void;
  onPurchaseComplete?: () => void;
}

export function PurchaseFlow({
  onClose,
  onPurchaseComplete,
}: PurchaseFlowProps) {
  const { locale } = useI18n();
  const isJapanese = locale === 'ja';

  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>(
    'yearly'
  );
  const [step, setStep] = useState<PurchaseStep>('select');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToAutoRenewal, setAgreedToAutoRenewal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedPricing =
    selectedPlan === 'monthly' ? PRICING.monthly : PRICING.yearly;
  const monthlyEquivalent =
    selectedPlan === 'yearly'
      ? Math.round(PRICING.yearly.amount / 12)
      : PRICING.monthly.amount;

  const canProceed = agreedToTerms && agreedToAutoRenewal;

  const handleProceedToConfirm = useCallback(() => {
    if (canProceed) {
      setStep('confirm');
    }
  }, [canProceed]);

  const handlePurchase = useCallback(async () => {
    setStep('processing');
    setError(null);

    try {
      // TODO: Integrate with Chrome Web Store payments API
      // google.payments.inapp.buy({
      //   sku: selectedPricing.sku,
      //   success: () => { ... },
      //   failure: () => { ... }
      // });

      // Simulate API call for now
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setStep('success');
      onPurchaseComplete?.();
    } catch {
      setError(
        isJapanese
          ? '購入処理中にエラーが発生しました。もう一度お試しください。'
          : 'An error occurred during purchase. Please try again.'
      );
      setStep('error');
    }
  }, [isJapanese, onPurchaseComplete]);

  const handleRetry = useCallback(() => {
    setStep('select');
    setError(null);
  }, []);

  // Calculate next billing date
  const getNextBillingDate = () => {
    const date = new Date();
    if (selectedPlan === 'monthly') {
      date.setMonth(date.getMonth() + 1);
    } else {
      date.setFullYear(date.getFullYear() + 1);
    }
    return date.toLocaleDateString(isJapanese ? 'ja-JP' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (step === 'success') {
    return (
      <div className="purchase-flow">
        <div className="purchase-success">
          <div className="success-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h2>{isJapanese ? '購入完了' : 'Purchase Complete'}</h2>
          <p>
            {isJapanese
              ? 'プレミアムプランへのアップグレードありがとうございます！すべてのプレミアム機能がご利用いただけます。'
              : 'Thank you for upgrading to Premium! All premium features are now available.'}
          </p>
          <button type="button" className="btn-primary" onClick={onClose}>
            {isJapanese ? '閉じる' : 'Close'}
          </button>
        </div>
      </div>
    );
  }

  if (step === 'error') {
    return (
      <div className="purchase-flow">
        <div className="purchase-error">
          <div className="error-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <h2>{isJapanese ? 'エラーが発生しました' : 'Error Occurred'}</h2>
          <p>{error}</p>
          <button type="button" className="btn-primary" onClick={handleRetry}>
            {isJapanese ? 'もう一度試す' : 'Try Again'}
          </button>
        </div>
      </div>
    );
  }

  if (step === 'processing') {
    return (
      <div className="purchase-flow">
        <div className="purchase-processing">
          <div className="processing-spinner" />
          <p>{isJapanese ? '処理中...' : 'Processing...'}</p>
        </div>
      </div>
    );
  }

  if (step === 'confirm') {
    return (
      <div className="purchase-flow">
        <div className="purchase-header">
          <h2>{isJapanese ? '購入確認' : 'Confirm Purchase'}</h2>
        </div>

        <div className="purchase-confirm-details">
          <div className="confirm-row">
            <span className="confirm-label">
              {isJapanese ? 'プラン' : 'Plan'}
            </span>
            <span className="confirm-value">
              {selectedPlan === 'monthly'
                ? isJapanese
                  ? '月額プラン'
                  : 'Monthly Plan'
                : isJapanese
                  ? '年額プラン'
                  : 'Yearly Plan'}
            </span>
          </div>
          <div className="confirm-row">
            <span className="confirm-label">
              {isJapanese ? '金額' : 'Amount'}
            </span>
            <span className="confirm-value">
              ¥{selectedPricing.amount.toLocaleString()}
              {isJapanese ? '（税込）' : ' (tax included)'}
            </span>
          </div>
          <div className="confirm-row">
            <span className="confirm-label">
              {isJapanese ? '次回請求日' : 'Next Billing Date'}
            </span>
            <span className="confirm-value">{getNextBillingDate()}</span>
          </div>
        </div>

        <div className="purchase-warning-box">
          <div className="warning-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <div className="warning-content">
            <p>
              {isJapanese
                ? '「購入する」をクリックすると、Chrome Web Store経由で決済が行われます。'
                : 'By clicking "Purchase", you will be charged via Chrome Web Store.'}
            </p>
          </div>
        </div>

        <div className="purchase-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setStep('select')}
          >
            {isJapanese ? '戻る' : 'Back'}
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={() => void handlePurchase()}
          >
            {isJapanese ? '購入する' : 'Purchase'}
          </button>
        </div>
      </div>
    );
  }

  // Default: select plan step
  return (
    <div className="purchase-flow">
      <div className="purchase-header">
        <h2>
          {isJapanese ? 'プレミアムにアップグレード' : 'Upgrade to Premium'}
        </h2>
        <p>
          {isJapanese
            ? 'すべての機能を解放して、集中力を最大限に高めましょう'
            : 'Unlock all features and maximize your focus'}
        </p>
      </div>

      {/* Feature List */}
      <div className="premium-features-list">
        <div className="feature-item">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>
            {isJapanese
              ? '無制限のカスタムドメイン'
              : 'Unlimited custom domains'}
          </span>
        </div>
        <div className="feature-item">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>
            {isJapanese ? '高度なスケジュール設定' : 'Advanced scheduling'}
          </span>
        </div>
        <div className="feature-item">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>
            {isJapanese ? '詳細な統計とレポート' : 'Detailed stats & reports'}
          </span>
        </div>
        <div className="feature-item">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>{isJapanese ? '優先サポート' : 'Priority support'}</span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="pricing-cards">
        <PricingCard
          plan="monthly"
          amount={PRICING.monthly.amount}
          interval="month"
          selected={selectedPlan === 'monthly'}
          onSelect={() => setSelectedPlan('monthly')}
        />
        <PricingCard
          plan="yearly"
          amount={PRICING.yearly.amount}
          originalAmount={PRICING.monthly.amount * 12}
          interval="year"
          savings={PRICING.yearly.savings}
          selected={selectedPlan === 'yearly'}
          onSelect={() => setSelectedPlan('yearly')}
          recommended
        />
      </div>

      {/* Monthly equivalent for yearly */}
      {selectedPlan === 'yearly' && (
        <div className="pricing-monthly-equivalent">
          {isJapanese
            ? `月あたり約¥${monthlyEquivalent}（2ヶ月分お得）`
            : `About ¥${monthlyEquivalent}/month (2 months free)`}
        </div>
      )}

      {/* Auto-renewal Warning */}
      <div className="auto-renewal-notice">
        <div className="notice-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <div className="notice-content">
          <h4>{isJapanese ? '自動更新について' : 'About Auto-Renewal'}</h4>
          <p>
            {isJapanese
              ? 'このサブスクリプションは、キャンセルするまで自動的に更新されます。更新の7日前にメールでお知らせします。'
              : 'This subscription will automatically renew until cancelled. We will notify you 7 days before renewal.'}
          </p>
          <ul>
            <li>
              {isJapanese ? '次回請求日: ' : 'Next billing: '}
              <strong>{getNextBillingDate()}</strong>
            </li>
            <li>
              {isJapanese ? '請求額: ' : 'Amount: '}
              <strong>¥{selectedPricing.amount.toLocaleString()}</strong>
            </li>
            <li>
              {isJapanese
                ? 'キャンセルは設定からいつでも可能'
                : 'Cancel anytime from settings'}
            </li>
          </ul>
        </div>
      </div>

      {/* Agreement Checkboxes */}
      <div className="purchase-agreements">
        <label className="agreement-checkbox">
          <input
            type="checkbox"
            checked={agreedToAutoRenewal}
            onChange={(e) => setAgreedToAutoRenewal(e.target.checked)}
          />
          <span className="checkbox-custom" />
          <span className="checkbox-label">
            {isJapanese
              ? '上記の自動更新について理解し、同意します'
              : 'I understand and agree to the auto-renewal terms above'}
          </span>
        </label>

        <label className="agreement-checkbox">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
          />
          <span className="checkbox-custom" />
          <span className="checkbox-label">
            {isJapanese ? (
              <>
                <a
                  href={LEGAL_URLS.termsOfService}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  利用規約
                </a>
                と
                <a
                  href={LEGAL_URLS.privacyPolicy}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  プライバシーポリシー
                </a>
                に同意します
              </>
            ) : (
              <>
                I agree to the{' '}
                <a
                  href={LEGAL_URLS.termsOfService}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms of Service
                </a>{' '}
                and{' '}
                <a
                  href={LEGAL_URLS.privacyPolicy}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>
              </>
            )}
          </span>
        </label>
      </div>

      {/* Refund Policy Note */}
      <div className="refund-note">
        <p>
          {isJapanese
            ? `購入後${REFUND_POLICY.refundWindowHours}時間以内は返金可能です。`
            : `Refunds available within ${REFUND_POLICY.refundWindowHours} hours of purchase.`}{' '}
          <a
            href={LEGAL_URLS.chromeWebStorePolicy}
            target="_blank"
            rel="noopener noreferrer"
          >
            {isJapanese ? '詳細を見る' : 'Learn more'}
          </a>
        </p>
      </div>

      {/* Purchase Button */}
      <div className="purchase-actions">
        {onClose && (
          <button type="button" className="btn-secondary" onClick={onClose}>
            {isJapanese ? 'キャンセル' : 'Cancel'}
          </button>
        )}
        <button
          type="button"
          className="btn-primary btn-purchase"
          disabled={!canProceed}
          onClick={handleProceedToConfirm}
        >
          {isJapanese ? '続ける' : 'Continue'}
        </button>
      </div>
    </div>
  );
}
