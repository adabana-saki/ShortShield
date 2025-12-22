/**
 * Subscription management component
 * Displays current subscription status and management options
 */

import { useState } from 'react';
import { useI18n } from '@/shared/hooks/useI18n';
import { PRICING, LEGAL_URLS } from '@/shared/constants/legal';
import { PurchaseFlow } from './PurchaseFlow';

type SubscriptionStatus = 'none' | 'active' | 'cancelled' | 'expired';

interface SubscriptionInfo {
  status: SubscriptionStatus;
  plan?: 'monthly' | 'yearly';
  startDate?: Date;
  nextBillingDate?: Date;
  cancelledAt?: Date;
  expiresAt?: Date;
}

export function SubscriptionManager() {
  const { locale } = useI18n();
  const isJapanese = locale === 'ja';

  // TODO: Get actual subscription info from storage/API
  const [subscription] = useState<SubscriptionInfo>({
    status: 'none',
  });

  const [showPurchaseFlow, setShowPurchaseFlow] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(isJapanese ? 'ja-JP' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleCancelSubscription = () => {
    // TODO: Implement cancellation via Chrome Web Store API
    setShowCancelConfirm(false);
  };

  if (showPurchaseFlow) {
    return (
      <PurchaseFlow
        onClose={() => setShowPurchaseFlow(false)}
        onPurchaseComplete={() => {
          setShowPurchaseFlow(false);
          // TODO: Refresh subscription status
        }}
      />
    );
  }

  // No subscription - show upgrade prompt
  if (subscription.status === 'none') {
    return (
      <div className="subscription-manager">
        <div className="subscription-header">
          <h2>{isJapanese ? 'プレミアム' : 'Premium'}</h2>
          <p>
            {isJapanese
              ? 'プレミアムにアップグレードして、すべての機能を解放しましょう'
              : 'Upgrade to Premium to unlock all features'}
          </p>
        </div>

        <div className="subscription-promo">
          <div className="promo-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <div className="promo-content">
            <h3>
              {isJapanese ? '現在は無料プラン' : 'Currently on Free Plan'}
            </h3>
            <p>
              {isJapanese
                ? 'プレミアムプランで無制限の機能をお楽しみください'
                : 'Enjoy unlimited features with Premium'}
            </p>
          </div>
        </div>

        <div className="free-vs-premium">
          <div className="comparison-header">
            <div className="comparison-feature">
              {isJapanese ? '機能' : 'Feature'}
            </div>
            <div className="comparison-free">
              {isJapanese ? '無料' : 'Free'}
            </div>
            <div className="comparison-premium">
              {isJapanese ? 'プレミアム' : 'Premium'}
            </div>
          </div>
          <div className="comparison-row">
            <div className="comparison-feature">
              {isJapanese ? 'プラットフォームブロック' : 'Platform blocking'}
            </div>
            <div className="comparison-free">
              <span className="check">✓</span>
            </div>
            <div className="comparison-premium">
              <span className="check">✓</span>
            </div>
          </div>
          <div className="comparison-row">
            <div className="comparison-feature">
              {isJapanese ? 'カスタムドメイン' : 'Custom domains'}
            </div>
            <div className="comparison-free">
              <span className="limit">3</span>
            </div>
            <div className="comparison-premium">
              <span className="unlimited">
                {isJapanese ? '無制限' : 'Unlimited'}
              </span>
            </div>
          </div>
          <div className="comparison-row">
            <div className="comparison-feature">
              {isJapanese ? 'スケジュール設定' : 'Scheduling'}
            </div>
            <div className="comparison-free">
              <span className="check">✓</span>
            </div>
            <div className="comparison-premium">
              <span className="check">✓</span>
            </div>
          </div>
          <div className="comparison-row">
            <div className="comparison-feature">
              {isJapanese ? '高度なスケジュール' : 'Advanced schedules'}
            </div>
            <div className="comparison-free">
              <span className="dash">—</span>
            </div>
            <div className="comparison-premium">
              <span className="check">✓</span>
            </div>
          </div>
          <div className="comparison-row">
            <div className="comparison-feature">
              {isJapanese ? '詳細レポート' : 'Detailed reports'}
            </div>
            <div className="comparison-free">
              <span className="dash">—</span>
            </div>
            <div className="comparison-premium">
              <span className="check">✓</span>
            </div>
          </div>
          <div className="comparison-row">
            <div className="comparison-feature">
              {isJapanese ? '優先サポート' : 'Priority support'}
            </div>
            <div className="comparison-free">
              <span className="dash">—</span>
            </div>
            <div className="comparison-premium">
              <span className="check">✓</span>
            </div>
          </div>
        </div>

        <div className="subscription-cta">
          <div className="cta-price">
            <span className="cta-from">{isJapanese ? '月額' : 'From'}</span>
            <span className="cta-amount">
              ¥{Math.round(PRICING.yearly.amount / 12)}
            </span>
            <span className="cta-interval">{isJapanese ? '/月〜' : '/mo'}</span>
          </div>
          <button
            type="button"
            className="btn-primary btn-upgrade"
            onClick={() => setShowPurchaseFlow(true)}
          >
            {isJapanese ? 'プレミアムにアップグレード' : 'Upgrade to Premium'}
          </button>
        </div>
      </div>
    );
  }

  // Active subscription
  if (subscription.status === 'active') {
    const pricing =
      subscription.plan === 'monthly' ? PRICING.monthly : PRICING.yearly;

    return (
      <div className="subscription-manager">
        <div className="subscription-header">
          <h2>
            {isJapanese ? 'サブスクリプション管理' : 'Manage Subscription'}
          </h2>
        </div>

        <div className="subscription-status-card active">
          <div className="status-badge">
            <span className="badge-active">
              {isJapanese ? '有効' : 'Active'}
            </span>
          </div>
          <div className="status-plan">
            <h3>
              {subscription.plan === 'monthly'
                ? isJapanese
                  ? '月額プレミアム'
                  : 'Monthly Premium'
                : isJapanese
                  ? '年額プレミアム'
                  : 'Yearly Premium'}
            </h3>
            <p className="status-price">
              ¥{pricing.amount.toLocaleString()}
              {subscription.plan === 'monthly'
                ? isJapanese
                  ? '/月'
                  : '/month'
                : isJapanese
                  ? '/年'
                  : '/year'}
            </p>
          </div>
        </div>

        <div className="subscription-details">
          {subscription.startDate && (
            <div className="detail-row">
              <span className="detail-label">
                {isJapanese ? '開始日' : 'Start Date'}
              </span>
              <span className="detail-value">
                {formatDate(subscription.startDate)}
              </span>
            </div>
          )}
          {subscription.nextBillingDate && (
            <div className="detail-row">
              <span className="detail-label">
                {isJapanese ? '次回請求日' : 'Next Billing'}
              </span>
              <span className="detail-value">
                {formatDate(subscription.nextBillingDate)}
              </span>
            </div>
          )}
          <div className="detail-row">
            <span className="detail-label">
              {isJapanese ? '次回請求額' : 'Next Amount'}
            </span>
            <span className="detail-value">
              ¥{pricing.amount.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="subscription-actions">
          <a
            href="https://play.google.com/store/account/subscriptions"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            {isJapanese ? 'Google Playで管理' : 'Manage on Google Play'}
          </a>
          <button
            type="button"
            className="btn-danger-outline"
            onClick={() => setShowCancelConfirm(true)}
          >
            {isJapanese ? 'キャンセル' : 'Cancel'}
          </button>
        </div>

        {/* Cancel Confirmation Dialog */}
        {showCancelConfirm && (
          <div className="modal-overlay">
            <div className="modal-dialog">
              <h3>
                {isJapanese ? 'キャンセルの確認' : 'Confirm Cancellation'}
              </h3>
              <p>
                {isJapanese
                  ? 'サブスクリプションをキャンセルしてもよろしいですか？現在の請求期間が終了するまでプレミアム機能をご利用いただけます。'
                  : 'Are you sure you want to cancel? You will continue to have access to Premium features until the end of your current billing period.'}
              </p>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowCancelConfirm(false)}
                >
                  {isJapanese ? '戻る' : 'Go Back'}
                </button>
                <button
                  type="button"
                  className="btn-danger"
                  onClick={handleCancelSubscription}
                >
                  {isJapanese ? 'キャンセルする' : 'Cancel Subscription'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="subscription-links">
          <a href={LEGAL_URLS.termsOfService}>
            {isJapanese ? '利用規約' : 'Terms of Service'}
          </a>
          <span className="link-separator">•</span>
          <a href={LEGAL_URLS.privacyPolicy}>
            {isJapanese ? 'プライバシーポリシー' : 'Privacy Policy'}
          </a>
        </div>
      </div>
    );
  }

  // Cancelled subscription
  if (subscription.status === 'cancelled') {
    return (
      <div className="subscription-manager">
        <div className="subscription-header">
          <h2>{isJapanese ? 'サブスクリプション' : 'Subscription'}</h2>
        </div>

        <div className="subscription-status-card cancelled">
          <div className="status-badge">
            <span className="badge-cancelled">
              {isJapanese ? 'キャンセル済み' : 'Cancelled'}
            </span>
          </div>
          <div className="status-info">
            <p>
              {isJapanese
                ? `プレミアム機能は${subscription.expiresAt ? formatDate(subscription.expiresAt) : '請求期間終了'}までご利用いただけます。`
                : `Premium features available until ${subscription.expiresAt ? formatDate(subscription.expiresAt) : 'end of billing period'}.`}
            </p>
          </div>
        </div>

        <div className="subscription-reactivate">
          <p>
            {isJapanese
              ? 'プレミアムの特典を引き続きお楽しみいただけます'
              : 'Continue enjoying Premium benefits'}
          </p>
          <button
            type="button"
            className="btn-primary"
            onClick={() => setShowPurchaseFlow(true)}
          >
            {isJapanese ? '再登録する' : 'Resubscribe'}
          </button>
        </div>
      </div>
    );
  }

  // Expired subscription
  return (
    <div className="subscription-manager">
      <div className="subscription-header">
        <h2>{isJapanese ? 'サブスクリプション' : 'Subscription'}</h2>
      </div>

      <div className="subscription-status-card expired">
        <div className="status-badge">
          <span className="badge-expired">
            {isJapanese ? '期限切れ' : 'Expired'}
          </span>
        </div>
        <div className="status-info">
          <p>
            {isJapanese
              ? 'プレミアムサブスクリプションの有効期限が切れました。'
              : 'Your Premium subscription has expired.'}
          </p>
        </div>
      </div>

      <button
        type="button"
        className="btn-primary btn-upgrade"
        onClick={() => setShowPurchaseFlow(true)}
      >
        {isJapanese ? '再登録する' : 'Resubscribe'}
      </button>
    </div>
  );
}
