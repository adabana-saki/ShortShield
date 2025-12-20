/**
 * Commercial Transaction Law (特定商取引法) disclosure page
 * Required for selling digital products in Japan
 */

import { useI18n } from '@/shared/hooks/useI18n';
import {
  SELLER_INFO,
  PRICING,
  REFUND_POLICY,
  LEGAL_URLS,
} from '@/shared/constants/legal';

export function CommercialTransaction() {
  const { t, locale } = useI18n();
  const isJapanese = locale === 'ja';

  // This page is primarily for Japanese users
  // but we show a translated version for non-Japanese users

  return (
    <div className="legal-page">
      <div className="legal-header">
        <h1 className="legal-title">
          {isJapanese
            ? '特定商取引法に基づく表記'
            : 'Commercial Transaction Disclosure'}
        </h1>
        <p className="legal-subtitle">
          {isJapanese
            ? '（特定商取引に関する法律第11条に基づく表示）'
            : '(Required disclosure under Japanese Commercial Transaction Law)'}
        </p>
      </div>

      <div className="legal-content commercial-transaction">
        <table className="legal-table">
          <tbody>
            <tr>
              <th>{isJapanese ? '販売業者' : 'Seller'}</th>
              <td>{SELLER_INFO.businessName || '[未設定]'}</td>
            </tr>
            <tr>
              <th>{isJapanese ? '運営責任者' : 'Representative'}</th>
              <td>{SELLER_INFO.representative || '[未設定]'}</td>
            </tr>
            <tr>
              <th>{isJapanese ? '所在地' : 'Address'}</th>
              <td>
                {SELLER_INFO.address ||
                  (isJapanese
                    ? '請求があった場合、遅滞なく開示いたします'
                    : 'Disclosed upon request')}
              </td>
            </tr>
            <tr>
              <th>{isJapanese ? 'メールアドレス' : 'Email'}</th>
              <td>{SELLER_INFO.email || '[未設定]'}</td>
            </tr>
            {SELLER_INFO.phone && (
              <tr>
                <th>{isJapanese ? '電話番号' : 'Phone'}</th>
                <td>{SELLER_INFO.phone}</td>
              </tr>
            )}
            <tr>
              <th>{isJapanese ? '販売価格' : 'Pricing'}</th>
              <td>
                <ul className="pricing-list">
                  <li>
                    {isJapanese ? '月額プラン' : 'Monthly Plan'}: ¥
                    {PRICING.monthly.amount}
                    {isJapanese ? '（税込）' : ' (tax included)'}
                  </li>
                  <li>
                    {isJapanese ? '年額プラン' : 'Yearly Plan'}: ¥
                    {PRICING.yearly.amount}
                    {isJapanese ? '（税込）' : ' (tax included)'}
                  </li>
                </ul>
              </td>
            </tr>
            <tr>
              <th>
                {isJapanese ? '販売価格以外の必要料金' : 'Additional Costs'}
              </th>
              <td>
                {isJapanese
                  ? 'なし（インターネット接続料金はお客様負担）'
                  : 'None (internet connection fees are borne by the customer)'}
              </td>
            </tr>
            <tr>
              <th>{isJapanese ? '支払方法' : 'Payment Method'}</th>
              <td>
                {isJapanese
                  ? 'Chrome Web Store決済（クレジットカード、デビットカード、Google Play残高等）'
                  : 'Chrome Web Store Payment (Credit card, Debit card, Google Play balance, etc.)'}
              </td>
            </tr>
            <tr>
              <th>{isJapanese ? '支払時期' : 'Payment Timing'}</th>
              <td>
                {isJapanese
                  ? '購入時に即時決済'
                  : 'Immediate payment at time of purchase'}
              </td>
            </tr>
            <tr>
              <th>{isJapanese ? '商品の引渡し時期' : 'Delivery'}</th>
              <td>
                {isJapanese
                  ? '決済完了後、即時にプレミアム機能が有効化されます'
                  : 'Premium features are activated immediately after payment'}
              </td>
            </tr>
            <tr>
              <th>
                {isJapanese
                  ? '返品・キャンセルについて'
                  : 'Returns & Cancellation'}
              </th>
              <td>
                <div className="refund-policy">
                  <p>
                    {isJapanese
                      ? `購入後${REFUND_POLICY.refundWindowHours}時間以内は、Chrome Web Storeのポリシーに従い返金が可能です。`
                      : `Refunds are available within ${REFUND_POLICY.refundWindowHours} hours of purchase per Chrome Web Store policy.`}
                  </p>
                  <p>
                    {isJapanese
                      ? 'サブスクリプションは次回更新日前にいつでもキャンセル可能です。キャンセル後も、現在の請求期間終了まではサービスをご利用いただけます。'
                      : 'Subscriptions can be cancelled anytime before the next renewal date. After cancellation, you can continue to use the service until the end of the current billing period.'}
                  </p>
                  <p className="eu-notice">
                    {isJapanese
                      ? `※EU在住のお客様は、消費者保護法に基づき${REFUND_POLICY.euCoolingOffDays}日間のクーリングオフ権を有します。`
                      : `*EU residents have a ${REFUND_POLICY.euCoolingOffDays}-day cooling-off period under consumer protection law.`}
                  </p>
                </div>
              </td>
            </tr>
            <tr>
              <th>{isJapanese ? '動作環境' : 'System Requirements'}</th>
              <td>
                <ul>
                  <li>
                    Google Chrome{' '}
                    {isJapanese ? 'バージョン88以上' : 'version 88 or later'}
                  </li>
                  <li>
                    Microsoft Edge (Chromium){' '}
                    {isJapanese ? 'バージョン88以上' : 'version 88 or later'}
                  </li>
                  <li>
                    {isJapanese
                      ? 'インターネット接続環境'
                      : 'Internet connection'}
                  </li>
                </ul>
              </td>
            </tr>
            <tr>
              <th>{isJapanese ? '特別な販売条件' : 'Special Conditions'}</th>
              <td>
                <ul>
                  <li>
                    {isJapanese
                      ? 'サブスクリプションは自動更新されます'
                      : 'Subscriptions are automatically renewed'}
                  </li>
                  <li>
                    {isJapanese
                      ? '更新日の7日前にメールでお知らせします'
                      : 'Email notification will be sent 7 days before renewal'}
                  </li>
                  <li>
                    {isJapanese
                      ? 'キャンセルは設定画面からいつでも可能です'
                      : 'Cancellation is available anytime from the settings page'}
                  </li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Auto-renewal Warning */}
        <div className="auto-renewal-warning">
          <h3>
            {isJapanese
              ? '⚠️ 自動更新に関する重要なお知らせ'
              : '⚠️ Important Notice About Auto-Renewal'}
          </h3>
          <p>
            {isJapanese
              ? 'プレミアムサブスクリプションは、お客様がキャンセルしない限り、自動的に更新されます。更新日の7日前にメールでお知らせします。キャンセルは、設定画面の「サブスクリプション管理」からいつでも行えます。'
              : 'Premium subscriptions will automatically renew unless you cancel. We will send you an email notification 7 days before renewal. You can cancel anytime from "Subscription Management" in settings.'}
          </p>
        </div>

        {/* Related Links */}
        <div className="legal-links-section">
          <h3>{isJapanese ? '関連リンク' : 'Related Links'}</h3>
          <ul className="legal-links">
            <li>
              <a href={LEGAL_URLS.termsOfService}>{t('termsOfServiceTitle')}</a>
            </li>
            <li>
              <a href={LEGAL_URLS.privacyPolicy}>{t('privacyPolicyTitle')}</a>
            </li>
            <li>
              <a
                href={LEGAL_URLS.chromeWebStorePolicy}
                target="_blank"
                rel="noopener noreferrer"
              >
                {isJapanese
                  ? 'Chrome Web Store 返金ポリシー'
                  : 'Chrome Web Store Refund Policy'}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
