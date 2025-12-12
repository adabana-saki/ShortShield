# ShortBlocker — グローバル OSS 開発ガイド

<div align="center">

**🌏 English version is [here](./shortblocker-global-guide.md)**

</div>

---

## 📋 目次

1. [プロジェクト概要](#1-プロジェクト概要)
2. [国際化戦略](#2-国際化戦略)
3. [フォルダ構造](#3-フォルダ構造)
4. [技術スタック](#4-技術スタック)
5. [開発環境セットアップ](#5-開発環境セットアップ)
6. [コーディング規約](#6-コーディング規約)
7. [Git ワークフロー](#7-git-ワークフロー)
8. [CI/CD パイプライン](#8-cicd-パイプライン)
9. [テスト戦略](#9-テスト戦略)
10. [ドキュメント構成](#10-ドキュメント構成)
11. [リリース管理](#11-リリース管理)
12. [OSS コミュニティ運営](#12-oss-コミュニティ運営)
13. [開発フェーズ](#13-開発フェーズ)

---

## 1. プロジェクト概要

### 1.1 ミッション

YouTube Shorts、TikTok、Instagram Reels などの短尺動画をブロックすることで、ユーザーが時間と集中力を取り戻すことを支援する。

### 1.2 コアバリュー

| 価値 | 説明 |
|------|------|
| 🔒 **プライバシー重視** | デフォルトで外部データ送信なし |
| ⚡ **パフォーマンス** | ページロードへの影響 < 100ms |
| 🌍 **グローバル** | 世界中のユーザー向けに設計 |
| 🔓 **透明性** | 完全オープンソース |
| 🎛️ **ユーザーコントロール** | すべての機能をユーザーが制御可能 |

### 1.3 対象プラットフォーム

- **ブラウザ**: Chrome, Edge (Chromium), Firefox, Brave, Opera
- **地域**: グローバル（初期対応: EN, JA, ZH, KO, ES, PT, DE, FR）
- **ストア**: Chrome Web Store, Firefox Add-ons, Edge Add-ons

---

## 2. 国際化戦略

### 2.1 言語サポートの階層

| 階層 | 言語 | カバレッジ |
|------|------|-----------|
| **Tier 1** (完全) | 英語, 日本語 | UI, ドキュメント, ストア, サポート |
| **Tier 2** (UI) | 中国語(簡体/繁体), 韓国語, スペイン語 | UI, ストア |
| **Tier 3** (コミュニティ) | ポルトガル語, ドイツ語, フランス語など | コミュニティ貢献 |

### 2.2 i18n アーキテクチャ

```
public/
└── _locales/
    ├── en/                    # 英語（デフォルト/フォールバック）
    │   └── messages.json
    ├── ja/                    # 日本語
    │   └── messages.json
    ├── zh_CN/                 # 中国語（簡体字）
    │   └── messages.json
    ├── zh_TW/                 # 中国語（繁体字）
    │   └── messages.json
    ├── ko/                    # 韓国語
    │   └── messages.json
    ├── es/                    # スペイン語
    │   └── messages.json
    ├── pt_BR/                 # ポルトガル語（ブラジル）
    │   └── messages.json
    ├── de/                    # ドイツ語
    │   └── messages.json
    └── fr/                    # フランス語
        └── messages.json
```

### 2.3 メッセージファイルのフォーマット

```json
// _locales/ja/messages.json
{
  "extensionName": {
    "message": "ShortBlocker",
    "description": "拡張機能の名前"
  },
  "extensionDescription": {
    "message": "短尺動画をブロックして集中力と生産性を維持",
    "description": "ブラウザ拡張ストアに表示される説明"
  },
  "popupToggleOn": {
    "message": "ブロック有効",
    "description": "ブロックが有効な時のステータステキスト"
  },
  "popupToggleOff": {
    "message": "ブロック無効",
    "description": "ブロックが無効な時のステータステキスト"
  },
  "optionsWhitelistTitle": {
    "message": "ホワイトリスト",
    "description": "オプションページのホワイトリストセクションのタイトル"
  },
  "optionsWhitelistDescription": {
    "message": "ブロックしないサイトやチャンネル",
    "description": "ホワイトリストセクションの説明"
  },
  "statsBlockedToday": {
    "message": "今日のブロック数: $COUNT$",
    "description": "今日ブロックした動画数を表示",
    "placeholders": {
      "count": {
        "content": "$1",
        "example": "42"
      }
    }
  },
  "statsBlockedTotal": {
    "message": "合計ブロック数: $COUNT$",
    "description": "合計でブロックした動画数を表示",
    "placeholders": {
      "count": {
        "content": "$1",
        "example": "1,234"
      }
    }
  }
}
```

### 2.4 i18n ユーティリティモジュール

```typescript
// src/shared/utils/i18n.ts
import browser from 'webextension-polyfill';

/**
 * ローカライズされたメッセージを取得（置換文字列オプション付き）
 */
export function t(
  messageName: string,
  substitutions?: string | string[]
): string {
  const message = browser.i18n.getMessage(messageName, substitutions);
  
  if (!message) {
    console.warn(`[i18n] 翻訳がありません: ${messageName}`);
    return messageName;
  }
  
  return message;
}

/**
 * 現在の UI 言語を取得
 */
export function getUILanguage(): string {
  return browser.i18n.getUILanguage();
}

/**
 * ロケールに応じた数値フォーマット
 */
export function formatNumber(
  value: number,
  locale?: string
): string {
  const lang = locale ?? getUILanguage();
  return new Intl.NumberFormat(lang).format(value);
}

/**
 * ロケールに応じた日付フォーマット
 */
export function formatDate(
  date: Date,
  options?: Intl.DateTimeFormatOptions,
  locale?: string
): string {
  const lang = locale ?? getUILanguage();
  return new Intl.DateTimeFormat(lang, options).format(date);
}

/**
 * 相対時間のフォーマット（例: "2時間前"）
 */
export function formatRelativeTime(
  date: Date,
  locale?: string
): string {
  const lang = locale ?? getUILanguage();
  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' });
  
  const now = Date.now();
  const diffMs = date.getTime() - now;
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);
  
  if (Math.abs(diffSec) < 60) {
    return rtf.format(diffSec, 'second');
  } else if (Math.abs(diffMin) < 60) {
    return rtf.format(diffMin, 'minute');
  } else if (Math.abs(diffHour) < 24) {
    return rtf.format(diffHour, 'hour');
  } else {
    return rtf.format(diffDay, 'day');
  }
}
```

### 2.5 React Hook for i18n

```typescript
// src/shared/hooks/useI18n.ts
import { useCallback, useMemo } from 'react';
import { t, formatNumber, formatDate, getUILanguage } from '../utils/i18n';

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
  
  return {
    t: translate,
    locale,
    formatNumber: number,
    formatDate: date,
  };
}

// コンポーネントでの使用例
function StatsDisplay({ blockedToday, blockedTotal }: StatsProps) {
  const { t, formatNumber } = useI18n();
  
  return (
    <div className="stats">
      <p>{t('statsBlockedToday', formatNumber(blockedToday))}</p>
      <p>{t('statsBlockedTotal', formatNumber(blockedTotal))}</p>
    </div>
  );
}
```

---

## 3. フォルダ構造

```
shortblocker/
├── .github/                          # GitHub 設定
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.yml            # バイリンガルバグ報告
│   │   ├── feature_request.yml       # バイリンガル機能リクエスト
│   │   ├── translation.yml           # 翻訳貢献用
│   │   └── config.yml
│   ├── PULL_REQUEST_TEMPLATE/
│   │   ├── default.md                # 英語（デフォルト）
│   │   └── ja.md                     # 日本語オプション
│   ├── workflows/
│   │   ├── ci.yml                    # CI パイプライン
│   │   ├── release.yml               # リリース自動化
│   │   ├── i18n-check.yml            # 翻訳完全性チェック
│   │   └── codeql.yml                # セキュリティスキャン
│   └── ...
│
├── docs/                             # ドキュメント（英語優先）
│   ├── ARCHITECTURE.md
│   ├── DETECTION_RULES.md
│   ├── PRIVACY_POLICY.md
│   ├── PRIVACY_POLICY.ja.md          # 日本語翻訳
│   ├── store-listings/               # 言語別ストア説明
│   │   ├── en/
│   │   ├── ja/
│   │   └── ...
│   └── images/
│       └── screenshots/
│           ├── en/
│           ├── ja/
│           └── ...
│
├── src/
│   ├── background/                   # Service Worker
│   ├── content/                      # Content Scripts
│   │   └── platforms/                # プラットフォーム別検出
│   ├── popup/                        # ポップアップ UI
│   ├── options/                      # オプションページ
│   ├── shared/
│   │   ├── types/
│   │   ├── constants/
│   │   │   └── locales.ts            # サポートロケール一覧
│   │   ├── utils/
│   │   │   └── i18n.ts               # i18n ユーティリティ
│   │   └── hooks/
│   │       └── useI18n.ts            # i18n React フック
│   └── rules/
│
├── public/
│   ├── icons/
│   └── _locales/                     # ブラウザ拡張 i18n
│       ├── en/
│       ├── ja/
│       ├── zh_CN/
│       ├── zh_TW/
│       ├── ko/
│       ├── es/
│       ├── pt_BR/
│       ├── de/
│       └── fr/
│
├── tests/
│   ├── unit/
│   │   └── i18n.test.ts              # i18n ユーティリティテスト
│   ├── integration/
│   ├── e2e/
│   └── mocks/
│       └── i18n.ts                   # テスト用 i18n モック
│
├── scripts/
│   ├── i18n-check.ts                 # 翻訳完全性チェック
│   └── i18n-extract.ts               # 翻訳文字列抽出
│
├── README.md                         # 英語（プライマリ）
├── README.ja.md                      # 日本語
├── README.zh-CN.md                   # 中国語（簡体字）
├── CONTRIBUTING.md                   # 英語
├── CONTRIBUTING.ja.md                # 日本語
└── ...
```

---

## 4. 技術スタック

### 4.1 コア技術

| カテゴリ | 技術 | 理由 |
|----------|------|------|
| 言語 | TypeScript 5.x | 型安全性、IDE サポート |
| UI | React 18 + Tailwind CSS | コンポーネント指向、ユーティリティファースト CSS |
| ビルド | Vite + @crxjs/vite-plugin | 高速ビルド、HMR 対応 |
| テスト | Vitest + Playwright | 高速ユニットテスト、クロスブラウザ E2E |
| i18n | WebExtensions i18n API + Intl | ネイティブブラウザサポート、標準 API |
| クロスブラウザ | webextension-polyfill | Firefox/Chrome 互換性 |

---

## 5. 開発環境セットアップ

### 5.1 前提条件

```bash
# Node.js 20.x 以上
node --version  # v20.x.x

# pnpm 推奨（npm/yarn も可）
npm install -g pnpm
```

### 5.2 初期セットアップ

```bash
# リポジトリクローン
git clone https://github.com/YOUR_USERNAME/shortblocker.git
cd shortblocker

# 依存関係インストール
pnpm install

# Git hooks セットアップ
pnpm prepare

# i18n 完全性チェック
pnpm i18n:check

# 開発サーバー起動
pnpm dev
```

### 5.3 異なる言語でのテスト

```bash
# Chrome: 特定の言語でテスト
google-chrome --lang=ja

# Firefox: about:config で変更
# intl.locale.requested = "ja"
```

---

## 6. コーディング規約

### 6.1 i18n ベストプラクティス

```typescript
// ❌ 悪い例: ハードコードされた文字列
function showStatus(enabled: boolean) {
  return enabled ? 'ブロック中' : 'ブロック停止';
}

// ✅ 良い例: i18n キーを使用
function showStatus(enabled: boolean) {
  return enabled ? t('statusEnabled') : t('statusDisabled');
}

// ❌ 悪い例: 文字列連結
function showCount(count: number) {
  return '今日 ' + count + ' 件ブロックしました';
}

// ✅ 良い例: プレースホルダーを使用
function showCount(count: number) {
  return t('blockedToday', formatNumber(count));
}

// ❌ 悪い例: ハードコードされた日付フォーマット
function showDate(date: Date) {
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
}

// ✅ 良い例: Intl.DateTimeFormat を使用
function showDate(date: Date) {
  return formatDate(date, { dateStyle: 'medium' });
}
```

### 6.2 RTL 言語サポート（将来対応）

```css
/* styles/base.css */

/* RTL サポートのための論理プロパティを使用 */
.container {
  /* ❌ 悪い例: 物理プロパティ */
  /* margin-left: 1rem; */
  /* padding-right: 2rem; */
  
  /* ✅ 良い例: 論理プロパティ */
  margin-inline-start: 1rem;
  padding-inline-end: 2rem;
}
```

---

## 7. Git ワークフロー

### 7.1 ブランチ戦略

```
main (protected)
├── develop
│   ├── feature/youtube-detection
│   ├── feature/options-page
│   ├── fix/mutation-observer-leak
│   ├── i18n/add-korean                # i18n 専用ブランチ
│   └── docs/api-documentation
└── release/v0.1.0
```

### 7.2 Conventional Commits

```bash
# フォーマット
<type>(<scope>): <subject>

# Types
feat     # 新機能
fix      # バグ修正
docs     # ドキュメント
style    # フォーマット
refactor # リファクタリング
perf     # パフォーマンス
test     # テスト
build    # ビルドシステム
ci       # CI 設定
i18n     # 国際化  ← i18n 作業用に追加
chore    # メンテナンス

# 例
feat(youtube): ホームフィードのショート検出を追加
fix(content): オブザーバークリーンアップのメモリリークを修正
i18n: 韓国語翻訳を追加
i18n(ja): オプションページの翻訳の誤字を修正
docs: 中国語 README を追加
```

### 7.3 推奨コミット履歴

```bash
# プロジェクト初期化
chore: Vite と TypeScript で初期プロジェクトセットアップ
chore: ESLint と Prettier 設定を追加
chore: Husky と lint-staged を設定

# ドキュメント
docs: 英語の README を追加
docs: 日本語の README (README.ja.md) を追加
docs: コントリビュートガイド (EN/JA) を追加

# コア実装
feat(manifest): i18n 対応の Chrome MV3 manifest を追加
feat(i18n): i18n ユーティリティモジュールを追加
feat(i18n): 英語と日本語の翻訳を追加
feat(background): Service Worker ブートストラップを実装
feat(content): Content Script エントリーポイントを追加
feat(youtube): URL ベースのショート検出を実装

# テスト
test(i18n): i18n ユーティリティテストを追加
test(youtube): URL 検出のユニットテストを追加

# UI
feat(popup): i18n 対応のポップアップ UI を作成
feat(options): 言語セレクター付きオプションページを実装

# 追加言語
i18n: 中国語（簡体字）翻訳を追加
i18n: 韓国語翻訳を追加
i18n: スペイン語翻訳を追加

# CI/CD
ci: i18n 完全性チェックワークフローを追加
ci: マルチブラウザビルド用 GitHub Actions を設定

# リリース
chore: v0.1.0 リリース準備
```

---

## 8. CI/CD パイプライン

### 8.1 i18n チェックスクリプト

```typescript
// scripts/i18n-check.ts
import fs from 'fs';
import path from 'path';

const LOCALES_DIR = 'public/_locales';
const BASE_LOCALE = 'en';

interface Report {
  complete: boolean;
  missing: Record<string, string[]>;
  stats: Record<string, { total: number; translated: number; percentage: number }>;
}

function checkTranslations(): Report {
  const baseMessages = JSON.parse(
    fs.readFileSync(path.join(LOCALES_DIR, BASE_LOCALE, 'messages.json'), 'utf8')
  );
  const baseKeys = new Set(Object.keys(baseMessages));
  
  const locales = fs.readdirSync(LOCALES_DIR)
    .filter(f => fs.statSync(path.join(LOCALES_DIR, f)).isDirectory())
    .filter(f => f !== BASE_LOCALE);
  
  const report: Report = {
    complete: true,
    missing: {},
    stats: {},
  };
  
  for (const locale of locales) {
    const messages = JSON.parse(
      fs.readFileSync(path.join(LOCALES_DIR, locale, 'messages.json'), 'utf8')
    );
    const localeKeys = new Set(Object.keys(messages));
    
    const missing = [...baseKeys].filter(k => !localeKeys.has(k));
    
    report.missing[locale] = missing;
    report.stats[locale] = {
      total: baseKeys.size,
      translated: baseKeys.size - missing.length,
      percentage: Math.round(((baseKeys.size - missing.length) / baseKeys.size) * 100),
    };
    
    if (missing.length > 0) {
      report.complete = false;
    }
  }
  
  return report;
}

// チェック実行
const report = checkTranslations();

console.log('\n📊 翻訳レポート\n');
console.log('| 言語 | 進捗 | 不足 |');
console.log('|------|------|------|');

for (const [locale, stats] of Object.entries(report.stats)) {
  const bar = '█'.repeat(Math.floor(stats.percentage / 10)) + 
              '░'.repeat(10 - Math.floor(stats.percentage / 10));
  const missing = report.missing[locale].length;
  console.log(`| ${locale.padEnd(6)} | ${bar} ${stats.percentage}% | ${missing} |`);
}

if (!report.complete) {
  console.log('\n❌ 一部の翻訳が不完全です！\n');
  process.exit(1);
} else {
  console.log('\n✅ すべての翻訳が完了しています！\n');
}
```

---

## 9. テスト戦略

### 9.1 i18n 専用テスト

```typescript
// tests/unit/i18n.test.ts
import { describe, it, expect, vi } from 'vitest';
import { t, formatNumber, formatDate } from '@/shared/utils/i18n';

describe('i18n ユーティリティ', () => {
  describe('formatNumber()', () => {
    it('ロケールに応じて数値をフォーマットする', () => {
      expect(formatNumber(1234567, 'en-US')).toBe('1,234,567');
      expect(formatNumber(1234567, 'de-DE')).toBe('1.234.567');
      expect(formatNumber(1234567, 'ja-JP')).toBe('1,234,567');
    });
  });

  describe('formatDate()', () => {
    const date = new Date('2024-01-15T10:30:00Z');

    it('ロケールに応じて日付をフォーマットする', () => {
      const enResult = formatDate(date, { dateStyle: 'short' }, 'en-US');
      const jaResult = formatDate(date, { dateStyle: 'short' }, 'ja-JP');
      
      expect(enResult).toMatch(/1\/15\/24/);
      expect(jaResult).toMatch(/2024\/01\/15/);
    });
  });
});
```

### 9.2 翻訳完全性テスト

```typescript
// tests/unit/translations.test.ts
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const LOCALES_DIR = 'public/_locales';

describe('翻訳ファイル', () => {
  const baseMessages = JSON.parse(
    fs.readFileSync(path.join(LOCALES_DIR, 'en', 'messages.json'), 'utf8')
  );
  const baseKeys = Object.keys(baseMessages);

  const locales = fs.readdirSync(LOCALES_DIR)
    .filter(f => fs.statSync(path.join(LOCALES_DIR, f)).isDirectory());

  for (const locale of locales) {
    describe(`${locale} の翻訳`, () => {
      const messages = JSON.parse(
        fs.readFileSync(path.join(LOCALES_DIR, locale, 'messages.json'), 'utf8')
      );

      it('有効な JSON 構造を持つ', () => {
        expect(messages).toBeDefined();
        expect(typeof messages).toBe('object');
      });

      it('各キーに message プロパティがある', () => {
        for (const [key, value] of Object.entries(messages)) {
          expect(value).toHaveProperty('message');
          expect(typeof (value as any).message).toBe('string');
        }
      });

      if (locale !== 'en') {
        it('すべてのベースキーがある', () => {
          const localeKeys = Object.keys(messages);
          const missingKeys = baseKeys.filter(k => !localeKeys.includes(k));
          
          expect(missingKeys).toEqual([]);
        });
      }
    });
  }
});
```

---

## 10. ドキュメント構成

### 10.1 多言語 README

```markdown
<!-- README.md（英語 - プライマリ）-->
<div align="center">
  <h1>ShortBlocker</h1>
  <p><strong>Block short-form videos and reclaim your focus</strong></p>
  
  <p>
    <a href="./README.ja.md">日本語</a> •
    <a href="./README.zh-CN.md">简体中文</a> •
    <a href="./README.ko.md">한국어</a>
  </p>
</div>
```

```markdown
<!-- README.ja.md（日本語）-->
<div align="center">
  <h1>ShortBlocker</h1>
  <p><strong>短尺動画をブロックして集中力を取り戻す</strong></p>
  
  <p>
    <a href="./README.md">English</a> •
    <a href="./README.zh-CN.md">简体中文</a> •
    <a href="./README.ko.md">한국어</a>
  </p>
</div>

## 🎯 概要

ShortBlocker は、YouTube Shorts、TikTok、Instagram Reels などの短尺動画をブラウザ上でブロックする拡張機能です。

### なぜ ShortBlocker？

- ⏱️ **時間を取り戻す**: 無限スクロールの誘惑をカット
- 🔒 **プライバシー重視**: デフォルトで外部通信なし
- ⚡ **軽量設計**: ページロードへの影響は最小限
- 🛠️ **カスタマイズ可能**: 細かいルール設定が可能

## ✨ 機能

| 機能 | 説明 |
|------|------|
| 🚫 ショートブロック | YouTube Shorts、TikTok、Instagram Reels を非表示 |
| ⚙️ ホワイトリスト | 特定のサイトやチャンネルを例外設定 |
| 📊 統計表示 | ブロックした動画数を確認 |
| 🌐 多言語対応 | 日本語・英語ほか多数 |

## 📥 インストール

### Chrome / Edge

1. [Chrome Web Store](https://chrome.google.com/webstore/...) からインストール

### Firefox

1. [Firefox Add-ons](https://addons.mozilla.org/...) からインストール

### 開発版

```bash
git clone https://github.com/YOUR_USERNAME/shortblocker.git
cd shortblocker
pnpm install
pnpm dev
```

## 🤝 コントリビュート

コントリビュートは大歓迎です！[CONTRIBUTING.ja.md](CONTRIBUTING.ja.md) をご覧ください。

## 📄 ライセンス

[MIT License](LICENSE)
```

---

## 11. リリース管理

### 11.1 マルチストアリリースチェックリスト

```markdown
## リリースチェックリスト v0.x.x

### リリース前
- [ ] すべてのテストがパス
- [ ] i18n チェックがパス（すべての翻訳が完了）
- [ ] CHANGELOG.md を更新
- [ ] package.json と manifest.json のバージョンを更新
- [ ] 必要に応じてドキュメントを更新

### ビルド
- [ ] `pnpm build:all` 成功
- [ ] Chrome 拡張を手動テスト
- [ ] Firefox 拡張を手動テスト
- [ ] 複数言語でテスト（最低 EN, JA, ZH）

### ストア申請
- [ ] **Chrome Web Store**
  - [ ] ZIP をアップロード
  - [ ] ストア掲載文を更新（全言語）
  - [ ] 必要に応じて新しいスクリーンショットをアップロード
- [ ] **Firefox Add-ons**
  - [ ] ZIP をアップロード
  - [ ] ストア掲載文を更新（全言語）
- [ ] **Edge Add-ons**（任意）
  - [ ] ZIP をアップロード
  - [ ] ストア掲載文を更新

### リリース後
- [ ] GitHub Release を作成しノートを記載
- [ ] SNS で告知（該当する場合）
- [ ] 最初の 24-48 時間は問題を監視
```

### 11.2 ストア掲載文テンプレート（日本語）

```
docs/store-listings/ja/description.txt
────────────────────────────────────────

🚫 ShortBlocker - 短尺動画をブロック

時間を取り戻そう！ShortBlocker は人気プラットフォームの短尺動画をブロックし、集中力を維持するお手伝いをします。

✨ 機能

• YouTube ショート、TikTok、Instagram リールをブロック
• ワンクリックでオン/オフ切替
• 特定のチャンネルやアカウントをホワイトリスト登録
• ブロックした動画数を確認
• データ収集なし - プライバシーを尊重

🎯 なぜ ShortBlocker？

短尺動画は無限スクロールを誘発するよう設計されています。ShortBlocker があなたをサポート：

• 大切なことに集中
• 無意識のスクロールを減少
• 1日の時間を取り戻す

🔒 プライバシー重視

• データ収集なし
• 外部サーバーなし
• トラッキングなし
• 100% オープンソース

🌍 対応言語

English, 日本語, 简体中文, 繁體中文, 한국어, Español, Português, Deutsch, Français

📖 オープンソース

ShortBlocker はオープンソースです！コードの確認、問題報告、貢献はこちら：
https://github.com/YOUR_USERNAME/shortblocker
```

---

## 12. OSS コミュニティ運営

### 12.1 バイリンガルコミュニケーションガイドライン

| シナリオ | 返信言語 |
|----------|----------|
| 英語の Issue | 英語で返信 |
| 日本語の Issue | 日本語で返信 |
| その他の言語の Issue | 英語で返信（翻訳サポートを提案） |
| 任意の言語からの PR | 英語でレビューコメント |
| リリースノート | 英語優先、日本語翻訳付き |

### 12.2 翻訳貢献ガイド

```markdown
<!-- TRANSLATING.md -->

# 翻訳ガイド

ShortBlocker の翻訳にご協力いただきありがとうございます！

## 新しい言語の追加

1. `public/_locales/en/` を `public/_locales/{locale}/` にコピー
2. `messages.json` 内のすべての `"message"` 値を翻訳
3. `"description"` は翻訳しない（開発者向け）
4. `$COUNT$` などのプレースホルダーは変更しない
5. `pnpm i18n:check` で完全性を確認
6. タイトル `i18n: add {language} translation` で PR を提出

## 言語コード

| コード | 言語 |
|--------|------|
| en | 英語 |
| ja | 日本語 |
| zh_CN | 中国語（簡体字） |
| zh_TW | 中国語（繁体字） |
| ko | 韓国語 |
| es | スペイン語 |
| pt_BR | ポルトガル語（ブラジル） |
| de | ドイツ語 |
| fr | フランス語 |

## ヒント

- 翻訳は簡潔に（UI スペースは限られています）
- 英語オリジナルのトーンに合わせる
- 実際の拡張機能で翻訳をテストする
- 不明な点があれば Issue で質問

## 謝辞

すべての翻訳者は以下でクレジットされます：
- README.md の Contributors セクション
- GitHub リリースノート
- 拡張機能の About ページ
```

---

## 13. 開発フェーズ

### Phase 1: プロジェクトセットアップ（1-2 日）

```bash
□ GitHub リポジトリを作成
□ README.md, LICENSE, .gitignore で初期化
□ i18n スクリプト付き package.json をセットアップ
□ TypeScript, ESLint, Prettier を設定
□ Vite + @crxjs/vite-plugin を追加
□ フォルダ構造を作成
□ i18n インフラをセットアップ
□ 英語と日本語の翻訳を追加
□ 適切な履歴で初回コミット
```

### Phase 2: MVP 実装（3-5 日）

```bash
□ i18n 対応の manifest.json を作成
□ Service Worker を実装
□ Content Script を実装
□ YouTube URL 検出
□ 基本的なブロック機能
□ i18n 対応のポップアップ UI
□ ストレージ層
□ ユニットテスト（i18n テスト含む）
```

### Phase 3: 機能拡張（5-7 日）

```bash
□ TikTok 検出
□ Instagram 検出
□ DOM ベース検出（MutationObserver）
□ i18n 対応のオプションページ
□ ホワイトリスト機能
□ ログビューア
□ 追加言語（ZH, KO, ES）
□ 統合テスト
```

### Phase 4: ポリッシュとリリース（3-5 日）

```bash
□ Firefox 互換性
□ E2E テスト
□ i18n チェック付き CI/CD パイプライン
□ ドキュメント完成（EN, JA）
□ ストア掲載準備（全言語）
□ Chrome Web Store 申請
□ Firefox Add-ons 申請
□ v0.1.0 リリース
```

---

## まとめ

このガイドにより、ShortBlocker は**真のグローバル OSS プロジェクト**として構築されます：

✅ **設計段階からの国際化**: 初日から i18n をアーキテクチャに組み込み  
✅ **多言語サポート**: 9 言語 + 拡張可能なフレームワーク  
✅ **グローバルコミュニティ**: バイリンガルドキュメントと Issue テンプレート  
✅ **プロフェッショナル品質**: TypeScript、テスト、CI/CD  
✅ **プライバシー重視**: データ収集なし、透明なコードベース  
✅ **クロスブラウザ**: Chrome, Firefox, Edge サポート  

---

## クイックスタートコマンド

```bash
# 開発
pnpm dev              # 開発サーバー起動
pnpm build:all        # 全ブラウザ向けビルド
pnpm test             # テスト実行

# i18n
pnpm i18n:check       # 翻訳完全性チェック
pnpm i18n:extract     # 翻訳文字列抽出

# リリース
pnpm release          # ビルドとパッケージング
```

質問がありますか？英語でも日本語でも Issue を開いてください！🚀
