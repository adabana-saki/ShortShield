# ShortBlocker — Global OSS Development Guide

<div align="center">

**🌏 日本語版は [こちら](./GUIDE.ja.md)**

</div>

---

## 📋 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Internationalization Strategy](#2-internationalization-strategy)
3. [Folder Structure](#3-folder-structure)
4. [Tech Stack](#4-tech-stack)
5. [Development Setup](#5-development-setup)
6. [Coding Standards](#6-coding-standards)
7. [Git Workflow](#7-git-workflow)
8. [CI/CD Pipeline](#8-cicd-pipeline)
9. [Testing Strategy](#9-testing-strategy)
10. [Documentation Structure](#10-documentation-structure)
11. [Release Management](#11-release-management)
12. [OSS Community Management](#12-oss-community-management)
13. [Development Phases](#13-development-phases)

---

## 1. Project Overview

### 1.1 Mission

Help users reclaim their time and focus by blocking short-form videos (YouTube Shorts, TikTok, Instagram Reels) that can lead to endless scrolling.

### 1.2 Core Values

| Value | Description |
|-------|-------------|
| 🔒 **Privacy First** | No external data transmission by default |
| ⚡ **Performance** | < 100ms impact on page load |
| 🌍 **Global** | Designed for users worldwide |
| 🔓 **Transparency** | Fully open-source codebase |
| 🎛️ **User Control** | All features are user-configurable |

### 1.3 Target Platforms

- **Browsers**: Chrome, Edge (Chromium), Firefox, Brave, Opera
- **Regions**: Global (initial focus: EN, JA, ZH, KO, ES, PT, DE, FR)
- **Store Listings**: Chrome Web Store, Firefox Add-ons, Edge Add-ons

---

## 2. Internationalization Strategy

### 2.1 Language Support Tiers

| Tier | Languages | Coverage |
|------|-----------|----------|
| **Tier 1** (Full) | English, Japanese | UI, Docs, Store, Support |
| **Tier 2** (UI) | Chinese (Simplified/Traditional), Korean, Spanish | UI, Store |
| **Tier 3** (Community) | Portuguese, German, French, etc. | Community-contributed |

### 2.2 i18n Architecture

```
public/
└── _locales/
    ├── en/                    # English (Default/Fallback)
    │   └── messages.json
    ├── ja/                    # Japanese
    │   └── messages.json
    ├── zh_CN/                 # Chinese (Simplified)
    │   └── messages.json
    ├── zh_TW/                 # Chinese (Traditional)
    │   └── messages.json
    ├── ko/                    # Korean
    │   └── messages.json
    ├── es/                    # Spanish
    │   └── messages.json
    ├── pt_BR/                 # Portuguese (Brazil)
    │   └── messages.json
    ├── de/                    # German
    │   └── messages.json
    └── fr/                    # French
        └── messages.json
```

### 2.3 Message File Format

```json
// _locales/en/messages.json
{
  "extensionName": {
    "message": "ShortBlocker",
    "description": "Name of the extension"
  },
  "extensionDescription": {
    "message": "Block short-form videos to stay focused and productive",
    "description": "Description shown in browser extension stores"
  },
  "popupToggleOn": {
    "message": "Blocking enabled",
    "description": "Status text when blocking is active"
  },
  "popupToggleOff": {
    "message": "Blocking disabled",
    "description": "Status text when blocking is inactive"
  },
  "optionsWhitelistTitle": {
    "message": "Whitelist",
    "description": "Title for whitelist section in options"
  },
  "optionsWhitelistDescription": {
    "message": "Sites and channels that won't be blocked",
    "description": "Description for whitelist section"
  },
  "statsBlockedToday": {
    "message": "Blocked today: $COUNT$",
    "description": "Shows number of videos blocked today",
    "placeholders": {
      "count": {
        "content": "$1",
        "example": "42"
      }
    }
  },
  "statsBlockedTotal": {
    "message": "Total blocked: $COUNT$",
    "description": "Shows total number of videos blocked",
    "placeholders": {
      "count": {
        "content": "$1",
        "example": "1,234"
      }
    }
  }
}
```

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

### 2.4 i18n Utility Module

```typescript
// src/shared/utils/i18n.ts
import browser from 'webextension-polyfill';

/**
 * Get localized message with optional substitutions
 */
export function t(
  messageName: string,
  substitutions?: string | string[]
): string {
  const message = browser.i18n.getMessage(messageName, substitutions);
  
  if (!message) {
    console.warn(`[i18n] Missing translation: ${messageName}`);
    return messageName;
  }
  
  return message;
}

/**
 * Get current UI language
 */
export function getUILanguage(): string {
  return browser.i18n.getUILanguage();
}

/**
 * Get accept languages in order of preference
 */
export async function getAcceptLanguages(): Promise<string[]> {
  return browser.i18n.getAcceptLanguages();
}

/**
 * Format number according to locale
 */
export function formatNumber(
  value: number,
  locale?: string
): string {
  const lang = locale ?? getUILanguage();
  return new Intl.NumberFormat(lang).format(value);
}

/**
 * Format date according to locale
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
 * Format relative time (e.g., "2 hours ago")
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

// Usage in component
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

### 2.6 Store Listing Translations

```
docs/
└── store-listings/
    ├── en/
    │   ├── title.txt              # 45 chars max
    │   ├── summary.txt            # 132 chars max
    │   ├── description.txt        # 16,000 chars max
    │   └── screenshots/
    │       ├── 1-popup.png
    │       ├── 2-options.png
    │       └── captions.json
    ├── ja/
    │   ├── title.txt
    │   ├── summary.txt
    │   ├── description.txt
    │   └── screenshots/
    │       ├── 1-popup.png        # Localized screenshots
    │       ├── 2-options.png
    │       └── captions.json
    └── ... (other languages)
```

---

## 3. Folder Structure

```
shortblocker/
├── .github/                          # GitHub configuration
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.yml            # Bilingual bug report
│   │   ├── feature_request.yml       # Bilingual feature request
│   │   ├── translation.yml           # Translation contribution
│   │   └── config.yml
│   ├── PULL_REQUEST_TEMPLATE/
│   │   ├── default.md                # English (default)
│   │   └── ja.md                     # Japanese option
│   ├── workflows/
│   │   ├── ci.yml                    # CI pipeline
│   │   ├── release.yml               # Release automation
│   │   ├── i18n-check.yml            # Translation completeness check
│   │   └── codeql.yml                # Security scanning
│   ├── CODEOWNERS
│   ├── FUNDING.yml
│   └── dependabot.yml
│
├── docs/                             # Documentation (English primary)
│   ├── ARCHITECTURE.md
│   ├── DETECTION_RULES.md
│   ├── API.md
│   ├── PRIVACY_POLICY.md
│   ├── PRIVACY_POLICY.ja.md          # Japanese translation
│   ├── store-listings/               # Store descriptions per language
│   │   ├── en/
│   │   ├── ja/
│   │   ├── zh_CN/
│   │   └── ...
│   └── images/
│       ├── architecture-diagram.svg
│       └── screenshots/
│           ├── en/
│           ├── ja/
│           └── ...
│
├── src/
│   ├── background/
│   │   ├── index.ts
│   │   ├── storage.ts
│   │   ├── messaging.ts
│   │   └── rules-engine.ts
│   │
│   ├── content/
│   │   ├── index.ts
│   │   ├── observer.ts
│   │   ├── platforms/
│   │   │   ├── index.ts
│   │   │   ├── base.ts               # Abstract base detector
│   │   │   ├── youtube.ts
│   │   │   ├── tiktok.ts
│   │   │   └── instagram.ts
│   │   └── actions/
│   │       ├── hide.ts
│   │       ├── redirect.ts
│   │       └── index.ts
│   │
│   ├── popup/
│   │   ├── index.html
│   │   ├── index.tsx
│   │   ├── components/
│   │   │   ├── Toggle.tsx
│   │   │   ├── Stats.tsx
│   │   │   ├── QuickSettings.tsx
│   │   │   └── LanguageIndicator.tsx  # Shows current language
│   │   └── styles/
│   │       └── popup.css
│   │
│   ├── options/
│   │   ├── index.html
│   │   ├── index.tsx
│   │   ├── components/
│   │   │   ├── Whitelist.tsx
│   │   │   ├── CustomRules.tsx
│   │   │   ├── LogViewer.tsx
│   │   │   ├── ExportImport.tsx
│   │   │   └── LanguageSelector.tsx   # Manual language override
│   │   └── styles/
│   │       └── options.css
│   │
│   ├── shared/
│   │   ├── types/
│   │   │   ├── index.ts
│   │   │   ├── rules.ts
│   │   │   ├── settings.ts
│   │   │   ├── logs.ts
│   │   │   └── i18n.ts               # i18n type definitions
│   │   ├── constants/
│   │   │   ├── index.ts
│   │   │   ├── platforms.ts
│   │   │   ├── defaults.ts
│   │   │   └── locales.ts            # Supported locales list
│   │   ├── utils/
│   │   │   ├── url.ts
│   │   │   ├── logger.ts
│   │   │   └── i18n.ts               # i18n utilities
│   │   └── hooks/
│   │       ├── useSettings.ts
│   │       ├── useStorage.ts
│   │       └── useI18n.ts            # i18n React hook
│   │
│   └── rules/
│       ├── index.ts
│       ├── youtube.json
│       ├── tiktok.json
│       └── instagram.json
│
├── public/
│   ├── icons/
│   │   ├── icon-16.png
│   │   ├── icon-32.png
│   │   ├── icon-48.png
│   │   ├── icon-128.png
│   │   └── icon.svg
│   └── _locales/                     # Browser extension i18n
│       ├── en/
│       │   └── messages.json
│       ├── ja/
│       │   └── messages.json
│       ├── zh_CN/
│       │   └── messages.json
│       ├── zh_TW/
│       │   └── messages.json
│       ├── ko/
│       │   └── messages.json
│       ├── es/
│       │   └── messages.json
│       ├── pt_BR/
│       │   └── messages.json
│       ├── de/
│       │   └── messages.json
│       └── fr/
│           └── messages.json
│
├── tests/
│   ├── unit/
│   │   ├── rules-engine.test.ts
│   │   ├── url-utils.test.ts
│   │   ├── i18n.test.ts              # i18n utility tests
│   │   └── platforms/
│   ├── integration/
│   │   ├── content-script.test.ts
│   │   └── storage.test.ts
│   ├── e2e/
│   │   ├── playwright.config.ts
│   │   ├── fixtures/
│   │   └── specs/
│   │       ├── youtube.spec.ts
│   │       ├── tiktok.spec.ts
│   │       └── instagram.spec.ts
│   ├── mocks/
│   │   ├── dom/
│   │   ├── chrome-api.ts
│   │   └── i18n.ts                   # Mock i18n for tests
│   └── setup.ts
│
├── scripts/
│   ├── build.ts
│   ├── dev.ts
│   ├── manifest-transform.ts
│   ├── zip.ts
│   ├── i18n-check.ts                 # Check translation completeness
│   └── i18n-extract.ts               # Extract strings for translation
│
├── dist/
│   ├── chrome/
│   └── firefox/
│
├── .vscode/
│   ├── settings.json
│   ├── extensions.json
│   └── launch.json
│
├── manifest.json
├── manifest.firefox.json
│
├── package.json
├── tsconfig.json
├── tsconfig.build.json
├── vite.config.ts
├── vitest.config.ts
├── tailwind.config.js
├── postcss.config.js
├── .eslintrc.cjs
├── .prettierrc
├── .gitignore
├── .nvmrc
├── .editorconfig
│
├── README.md                         # English (primary)
├── README.ja.md                      # Japanese
├── README.zh-CN.md                   # Chinese (Simplified)
├── CONTRIBUTING.md                   # English
├── CONTRIBUTING.ja.md                # Japanese
├── CODE_OF_CONDUCT.md
├── LICENSE
├── CHANGELOG.md
└── SECURITY.md
```

---

## 4. Tech Stack

### 4.1 Core Technologies

| Category | Technology | Reason |
|----------|------------|--------|
| Language | TypeScript 5.x | Type safety, IDE support |
| UI | React 18 + Tailwind CSS | Component-based, utility-first CSS |
| Build | Vite + @crxjs/vite-plugin | Fast builds, HMR support |
| Testing | Vitest + Playwright | Fast unit tests, cross-browser E2E |
| i18n | WebExtensions i18n API + Intl | Native browser support, standard APIs |
| Cross-browser | webextension-polyfill | Firefox/Chrome compatibility |

### 4.2 package.json

```json
{
  "name": "shortblocker",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "dev:firefox": "vite --mode firefox",
    "build": "tsc && vite build",
    "build:firefox": "tsc && vite build --mode firefox",
    "build:all": "npm run build && npm run build:firefox",
    "test": "vitest",
    "test:unit": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "lint": "eslint src --ext .ts,.tsx",
    "lint:fix": "eslint src --ext .ts,.tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,css,json}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,css,json}\"",
    "typecheck": "tsc --noEmit",
    "i18n:check": "tsx scripts/i18n-check.ts",
    "i18n:extract": "tsx scripts/i18n-extract.ts",
    "prepare": "husky install",
    "zip": "tsx scripts/zip.ts",
    "release": "npm run build:all && npm run zip"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "webextension-polyfill": "^0.10.0"
  },
  "devDependencies": {
    "@crxjs/vite-plugin": "^2.0.0-beta.23",
    "@playwright/test": "^1.40.0",
    "@types/chrome": "^0.0.254",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@types/webextension-polyfill": "^0.10.7",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "@vitest/coverage-v8": "^1.0.0",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.56.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-react": "^7.33.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "husky": "^8.0.0",
    "jsdom": "^23.0.0",
    "lint-staged": "^15.0.0",
    "postcss": "^8.4.32",
    "prettier": "^3.1.0",
    "tailwindcss": "^3.3.0",
    "tsx": "^4.0.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "vitest": "^1.0.0"
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,css}": ["prettier --write"],
    "public/_locales/**/*.json": ["npm run i18n:check"]
  },
  "engines": {
    "node": ">=20.0.0"
  }
}
```

---

## 5. Development Setup

### 5.1 Prerequisites

```bash
# Node.js 20.x or higher
node --version  # v20.x.x

# pnpm recommended (npm/yarn also work)
npm install -g pnpm
```

### 5.2 Initial Setup

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/shortblocker.git
cd shortblocker

# Install dependencies
pnpm install

# Setup Git hooks
pnpm prepare

# Check i18n completeness
pnpm i18n:check

# Start development server
pnpm dev
```

### 5.3 Loading in Browser

**Chrome:**
1. Navigate to `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select `dist/chrome` folder

**Firefox:**
1. Navigate to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Select `dist/firefox/manifest.json`

### 5.4 Testing Different Languages

```bash
# Chrome: Test with specific language
google-chrome --lang=ja

# Firefox: Change in about:config
# intl.locale.requested = "ja"

# Or use browser.i18n.getUILanguage() override in dev
```

---

## 6. Coding Standards

### 6.1 TypeScript Style

```typescript
// ✅ Good: Explicit types, const assertion
export const SUPPORTED_LOCALES = [
  'en', 'ja', 'zh_CN', 'zh_TW', 'ko', 'es', 'pt_BR', 'de', 'fr'
] as const;

export type SupportedLocale = typeof SUPPORTED_LOCALES[number];

// ✅ Good: Interface with readonly properties
export interface Rule {
  readonly id: string;
  readonly name: string;
  readonly type: RuleType;
  readonly pattern: string;
  readonly action: BlockAction;
  readonly enabled: boolean;
  readonly priority?: number;
}

// ✅ Good: Type guard
function isSupportedLocale(locale: string): locale is SupportedLocale {
  return SUPPORTED_LOCALES.includes(locale as SupportedLocale);
}

// ✅ Good: Proper error handling with i18n
class LocalizedError extends Error {
  constructor(
    public readonly messageKey: string,
    public readonly substitutions?: string[]
  ) {
    super(messageKey);
    this.name = 'LocalizedError';
  }
}
```

### 6.2 i18n Best Practices

```typescript
// ❌ Bad: Hardcoded strings
function showStatus(enabled: boolean) {
  return enabled ? 'Blocking is ON' : 'Blocking is OFF';
}

// ✅ Good: Use i18n keys
function showStatus(enabled: boolean) {
  return enabled ? t('statusEnabled') : t('statusDisabled');
}

// ❌ Bad: String concatenation
function showCount(count: number) {
  return 'Blocked ' + count + ' videos today';
}

// ✅ Good: Use placeholders
function showCount(count: number) {
  return t('blockedToday', formatNumber(count));
}

// ❌ Bad: Hardcoded date format
function showDate(date: Date) {
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

// ✅ Good: Use Intl.DateTimeFormat
function showDate(date: Date) {
  return formatDate(date, { dateStyle: 'medium' });
}
```

### 6.3 Component i18n Pattern

```tsx
// src/popup/components/Stats.tsx
import { useI18n } from '@/shared/hooks/useI18n';

interface StatsProps {
  blockedToday: number;
  blockedTotal: number;
  lastBlocked?: Date;
}

export function Stats({ blockedToday, blockedTotal, lastBlocked }: StatsProps) {
  const { t, formatNumber, formatDate } = useI18n();
  
  return (
    <div className="stats-container">
      <div className="stat-item">
        <span className="stat-label">{t('statsBlockedToday')}</span>
        <span className="stat-value">{formatNumber(blockedToday)}</span>
      </div>
      
      <div className="stat-item">
        <span className="stat-label">{t('statsBlockedTotal')}</span>
        <span className="stat-value">{formatNumber(blockedTotal)}</span>
      </div>
      
      {lastBlocked && (
        <div className="stat-item">
          <span className="stat-label">{t('statsLastBlocked')}</span>
          <span className="stat-value">
            {formatDate(lastBlocked, { dateStyle: 'short', timeStyle: 'short' })}
          </span>
        </div>
      )}
    </div>
  );
}
```

### 6.4 RTL Language Support (Future-proof)

```css
/* styles/base.css */

/* Use logical properties for RTL support */
.container {
  /* ❌ Bad: physical properties */
  /* margin-left: 1rem; */
  /* padding-right: 2rem; */
  
  /* ✅ Good: logical properties */
  margin-inline-start: 1rem;
  padding-inline-end: 2rem;
}

/* Tailwind: Use logical utility classes */
/* ml-4 → ms-4 (margin-start) */
/* pr-2 → pe-2 (padding-end) */
/* text-left → text-start */
/* border-r → border-e */
```

```tsx
// Detect RTL in React
function useDirection() {
  const { locale } = useI18n();
  const rtlLocales = ['ar', 'he', 'fa', 'ur'];
  return rtlLocales.some(l => locale.startsWith(l)) ? 'rtl' : 'ltr';
}

// Apply to root element
function App() {
  const dir = useDirection();
  return <div dir={dir}>{/* content */}</div>;
}
```

---

## 7. Git Workflow

### 7.1 Branch Strategy

```
main (protected)
├── develop
│   ├── feature/youtube-detection
│   ├── feature/options-page
│   ├── fix/mutation-observer-leak
│   ├── i18n/add-korean                # i18n-specific branch
│   └── docs/api-documentation
└── release/v0.1.0
```

### 7.2 Conventional Commits

```bash
# Format
<type>(<scope>): <subject>

# Types
feat     # New feature
fix      # Bug fix
docs     # Documentation
style    # Formatting
refactor # Code restructuring
perf     # Performance
test     # Tests
build    # Build system
ci       # CI configuration
i18n     # Internationalization  ← Added for i18n work
chore    # Maintenance

# Examples
feat(youtube): add detection for Shorts in home feed
fix(content): prevent memory leak in observer cleanup
i18n: add Korean translation
i18n(ja): fix typo in options page translation
docs: add Chinese README
```

### 7.3 Recommended Commit History

```bash
# Project initialization
chore: initial project setup with Vite and TypeScript
chore: add ESLint and Prettier configuration
chore: configure Husky and lint-staged

# Documentation
docs: add README in English
docs: add Japanese README (README.ja.md)
docs: add CONTRIBUTING guide (EN/JA)

# Core implementation
feat(manifest): add Chrome MV3 manifest with i18n support
feat(i18n): add i18n utility module
feat(i18n): add English and Japanese translations
feat(background): implement service worker bootstrap
feat(content): add content script entry point
feat(youtube): implement URL-based Shorts detection

# Testing
test(i18n): add i18n utility tests
test(youtube): add unit tests for URL detection

# UI
feat(popup): create popup UI with i18n support
feat(options): implement options page with language selector

# Additional languages
i18n: add Chinese (Simplified) translation
i18n: add Korean translation
i18n: add Spanish translation

# CI/CD
ci: add i18n completeness check workflow
ci: configure GitHub Actions for multi-browser build

# Release
chore: prepare v0.1.0 release
```

---

## 8. CI/CD Pipeline

### 8.1 i18n Check Workflow

```yaml
# .github/workflows/i18n-check.yml
name: i18n Check

on:
  push:
    paths:
      - 'public/_locales/**'
      - 'src/**/*.ts'
      - 'src/**/*.tsx'
  pull_request:
    paths:
      - 'public/_locales/**'

jobs:
  check-translations:
    name: Check Translation Completeness
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version-file: '.nvmrc'
          cache: 'pnpm'

      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Check i18n completeness
        run: pnpm i18n:check

      - name: Report missing translations
        if: failure()
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const report = fs.readFileSync('i18n-report.json', 'utf8');
            const data = JSON.parse(report);
            
            let comment = '## 🌐 Translation Check Failed\n\n';
            comment += '| Language | Missing Keys |\n';
            comment += '|----------|-------------|\n';
            
            for (const [lang, keys] of Object.entries(data.missing)) {
              if (keys.length > 0) {
                comment += `| ${lang} | ${keys.join(', ')} |\n`;
              }
            }
            
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: comment
            });
```

### 8.2 i18n Check Script

```typescript
// scripts/i18n-check.ts
import fs from 'fs';
import path from 'path';

const LOCALES_DIR = 'public/_locales';
const BASE_LOCALE = 'en';

interface Messages {
  [key: string]: {
    message: string;
    description?: string;
    placeholders?: Record<string, unknown>;
  };
}

interface Report {
  complete: boolean;
  missing: Record<string, string[]>;
  extra: Record<string, string[]>;
  stats: Record<string, { total: number; translated: number; percentage: number }>;
}

function loadMessages(locale: string): Messages {
  const filePath = path.join(LOCALES_DIR, locale, 'messages.json');
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing messages.json for locale: ${locale}`);
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function checkTranslations(): Report {
  const baseMessages = loadMessages(BASE_LOCALE);
  const baseKeys = new Set(Object.keys(baseMessages));
  
  const locales = fs.readdirSync(LOCALES_DIR)
    .filter(f => fs.statSync(path.join(LOCALES_DIR, f)).isDirectory())
    .filter(f => f !== BASE_LOCALE);
  
  const report: Report = {
    complete: true,
    missing: {},
    extra: {},
    stats: {},
  };
  
  for (const locale of locales) {
    const messages = loadMessages(locale);
    const localeKeys = new Set(Object.keys(messages));
    
    const missing = [...baseKeys].filter(k => !localeKeys.has(k));
    const extra = [...localeKeys].filter(k => !baseKeys.has(k));
    
    report.missing[locale] = missing;
    report.extra[locale] = extra;
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

// Run check
const report = checkTranslations();

console.log('\n📊 Translation Report\n');
console.log('| Language | Progress | Missing |');
console.log('|----------|----------|---------|');

for (const [locale, stats] of Object.entries(report.stats)) {
  const bar = '█'.repeat(Math.floor(stats.percentage / 10)) + 
              '░'.repeat(10 - Math.floor(stats.percentage / 10));
  const missing = report.missing[locale].length;
  console.log(`| ${locale.padEnd(8)} | ${bar} ${stats.percentage}% | ${missing} |`);
}

// Write report for CI
fs.writeFileSync('i18n-report.json', JSON.stringify(report, null, 2));

// Exit with error if incomplete
if (!report.complete) {
  console.log('\n❌ Some translations are incomplete!\n');
  process.exit(1);
} else {
  console.log('\n✅ All translations are complete!\n');
}
```

### 8.3 Main CI Workflow

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  lint:
    name: Lint & Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version-file: '.nvmrc'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm format:check
      - run: pnpm typecheck
      - run: pnpm i18n:check

  test:
    name: Unit Tests
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version-file: '.nvmrc'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm test:unit
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  build:
    name: Build (${{ matrix.target }})
    runs-on: ubuntu-latest
    needs: test
    strategy:
      matrix:
        target: [chrome, firefox]
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version-file: '.nvmrc'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm build:${{ matrix.target }}
      - uses: actions/upload-artifact@v4
        with:
          name: shortblocker-${{ matrix.target }}
          path: dist/${{ matrix.target }}

  e2e:
    name: E2E Tests
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version-file: '.nvmrc'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm exec playwright install --with-deps chromium
      - uses: actions/download-artifact@v4
        with:
          name: shortblocker-chrome
          path: dist/chrome
      - run: pnpm test:e2e
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## 9. Testing Strategy

### 9.1 i18n-Specific Tests

```typescript
// tests/unit/i18n.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { t, formatNumber, formatDate, formatRelativeTime } from '@/shared/utils/i18n';

// Mock browser.i18n
vi.mock('webextension-polyfill', () => ({
  default: {
    i18n: {
      getMessage: vi.fn((key: string, subs?: string[]) => {
        const messages: Record<string, string> = {
          'testSimple': 'Hello World',
          'testWithPlaceholder': `Count: ${subs?.[0] ?? '$1'}`,
          'testMultiplePlaceholders': `From ${subs?.[0] ?? '$1'} to ${subs?.[1] ?? '$2'}`,
        };
        return messages[key] ?? '';
      }),
      getUILanguage: vi.fn(() => 'en-US'),
    },
  },
}));

describe('i18n utilities', () => {
  describe('t()', () => {
    it('should return translated message', () => {
      expect(t('testSimple')).toBe('Hello World');
    });

    it('should handle placeholders', () => {
      expect(t('testWithPlaceholder', '42')).toBe('Count: 42');
    });

    it('should handle multiple placeholders', () => {
      expect(t('testMultiplePlaceholders', ['A', 'B'])).toBe('From A to B');
    });

    it('should return key for missing translation', () => {
      expect(t('nonExistent')).toBe('nonExistent');
    });
  });

  describe('formatNumber()', () => {
    it('should format numbers according to locale', () => {
      expect(formatNumber(1234567, 'en-US')).toBe('1,234,567');
      expect(formatNumber(1234567, 'de-DE')).toBe('1.234.567');
      expect(formatNumber(1234567, 'ja-JP')).toBe('1,234,567');
    });
  });

  describe('formatDate()', () => {
    const date = new Date('2024-01-15T10:30:00Z');

    it('should format dates according to locale', () => {
      const enResult = formatDate(date, { dateStyle: 'short' }, 'en-US');
      const jaResult = formatDate(date, { dateStyle: 'short' }, 'ja-JP');
      
      expect(enResult).toMatch(/1\/15\/24/);
      expect(jaResult).toMatch(/2024\/01\/15/);
    });
  });
});
```

### 9.2 Translation Completeness Test

```typescript
// tests/unit/translations.test.ts
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const LOCALES_DIR = 'public/_locales';

describe('Translation files', () => {
  const baseMessages = JSON.parse(
    fs.readFileSync(path.join(LOCALES_DIR, 'en', 'messages.json'), 'utf8')
  );
  const baseKeys = Object.keys(baseMessages);

  const locales = fs.readdirSync(LOCALES_DIR)
    .filter(f => fs.statSync(path.join(LOCALES_DIR, f)).isDirectory());

  for (const locale of locales) {
    describe(`${locale} translations`, () => {
      const messages = JSON.parse(
        fs.readFileSync(path.join(LOCALES_DIR, locale, 'messages.json'), 'utf8')
      );

      it('should have valid JSON structure', () => {
        expect(messages).toBeDefined();
        expect(typeof messages).toBe('object');
      });

      it('should have message property for each key', () => {
        for (const [key, value] of Object.entries(messages)) {
          expect(value).toHaveProperty('message');
          expect(typeof (value as any).message).toBe('string');
        }
      });

      if (locale !== 'en') {
        it('should have all base keys', () => {
          const localeKeys = Object.keys(messages);
          const missingKeys = baseKeys.filter(k => !localeKeys.includes(k));
          
          expect(missingKeys).toEqual([]);
        });

        it('should have matching placeholders', () => {
          for (const key of baseKeys) {
            if (messages[key]) {
              const basePlaceholders = baseMessages[key].placeholders || {};
              const localePlaceholders = messages[key].placeholders || {};
              
              expect(Object.keys(localePlaceholders).sort())
                .toEqual(Object.keys(basePlaceholders).sort());
            }
          }
        });
      }
    });
  }
});
```

---

## 10. Documentation Structure

### 10.1 Multi-language README

```markdown
<!-- README.md (English - Primary) -->
<div align="center">
  <img src="docs/images/logo.svg" alt="ShortBlocker Logo" width="128" />
  <h1>ShortBlocker</h1>
  <p><strong>Block short-form videos and reclaim your focus</strong></p>
  
  <p>
    <a href="./README.ja.md">日本語</a> •
    <a href="./README.zh-CN.md">简体中文</a> •
    <a href="./README.ko.md">한국어</a>
  </p>
  
  <!-- Badges -->
</div>

## 🎯 Overview

ShortBlocker is a browser extension that blocks short-form videos...

<!-- Rest of README in English -->
```

```markdown
<!-- README.ja.md (Japanese) -->
<div align="center">
  <img src="docs/images/logo.svg" alt="ShortBlocker Logo" width="128" />
  <h1>ShortBlocker</h1>
  <p><strong>短尺動画をブロックして集中力を取り戻す</strong></p>
  
  <p>
    <a href="./README.md">English</a> •
    <a href="./README.zh-CN.md">简体中文</a> •
    <a href="./README.ko.md">한국어</a>
  </p>
</div>

## 🎯 概要

ShortBlocker は、短尺動画をブロックするブラウザ拡張機能です...

<!-- 日本語の README -->
```

### 10.2 Bilingual Issue Templates

```yaml
# .github/ISSUE_TEMPLATE/bug_report.yml
name: "🐛 Bug Report / バグ報告"
description: "Report a bug / バグを報告する"
labels: ["bug", "needs-triage"]
body:
  - type: markdown
    attributes:
      value: |
        ## Bug Report / バグ報告
        Please fill in English or Japanese. / 英語または日本語で記入してください。
        
  - type: dropdown
    id: language
    attributes:
      label: "Preferred Language / 希望言語"
      options:
        - English
        - 日本語
    validations:
      required: true
      
  - type: textarea
    id: description
    attributes:
      label: "Description / 説明"
      description: |
        What happened? / 何が起きましたか？
      placeholder: |
        EN: Describe the bug...
        JA: バグの詳細を記述してください...
    validations:
      required: true
      
  - type: textarea
    id: steps
    attributes:
      label: "Steps to Reproduce / 再現手順"
      description: |
        How can we reproduce this? / どうすれば再現できますか？
      placeholder: |
        1. Go to / 移動: ...
        2. Click on / クリック: ...
        3. See error / エラー確認: ...
    validations:
      required: true
      
  - type: dropdown
    id: browser
    attributes:
      label: "Browser / ブラウザ"
      options:
        - Chrome
        - Firefox
        - Edge
        - Brave
        - Other
    validations:
      required: true
      
  - type: input
    id: version
    attributes:
      label: "Extension Version / 拡張機能バージョン"
      placeholder: "v0.1.0"
    validations:
      required: true
      
  - type: input
    id: os
    attributes:
      label: "OS"
      placeholder: "Windows 11 / macOS Sonoma / Ubuntu 22.04"
    validations:
      required: true
```

```yaml
# .github/ISSUE_TEMPLATE/translation.yml
name: "🌐 Translation / 翻訳"
description: "Add or fix translations / 翻訳の追加・修正"
labels: ["i18n", "good first issue"]
body:
  - type: markdown
    attributes:
      value: |
        ## Translation Contribution / 翻訳への貢献
        Thank you for helping translate ShortBlocker!
        ShortBlocker の翻訳にご協力いただきありがとうございます！
        
  - type: dropdown
    id: type
    attributes:
      label: "Type / 種類"
      options:
        - "New language / 新しい言語"
        - "Fix existing / 既存の修正"
        - "Update outdated / 古い翻訳の更新"
    validations:
      required: true
      
  - type: input
    id: language
    attributes:
      label: "Language / 言語"
      placeholder: "Korean (ko) / 한국어"
    validations:
      required: true
      
  - type: textarea
    id: details
    attributes:
      label: "Details / 詳細"
      description: |
        What translations are you adding or fixing?
        どの翻訳を追加または修正しますか？
```

---

## 11. Release Management

### 11.1 Multi-Store Release Checklist

```markdown
## Release Checklist v0.x.x

### Pre-release
- [ ] All tests passing
- [ ] i18n check passing (all translations complete)
- [ ] CHANGELOG.md updated
- [ ] Version bumped in package.json and manifest.json
- [ ] Documentation updated if needed

### Build
- [ ] `pnpm build:all` successful
- [ ] Chrome extension manually tested
- [ ] Firefox extension manually tested
- [ ] Test in multiple languages (EN, JA, ZH at minimum)

### Store Submissions
- [ ] **Chrome Web Store**
  - [ ] Upload ZIP
  - [ ] Update store listing (all languages)
  - [ ] Upload new screenshots if needed
- [ ] **Firefox Add-ons**
  - [ ] Upload ZIP
  - [ ] Update store listing (all languages)
- [ ] **Edge Add-ons** (optional)
  - [ ] Upload ZIP
  - [ ] Update store listing

### Post-release
- [ ] Create GitHub Release with notes
- [ ] Announce on social media (if applicable)
- [ ] Monitor for issues in first 24-48 hours
```

### 11.2 Store Listing Template

```
docs/store-listings/en/description.txt
────────────────────────────────────────

🚫 ShortBlocker - Block Short-Form Videos

Take back control of your time! ShortBlocker helps you stay focused by blocking distracting short-form videos on popular platforms.

✨ FEATURES

• Block YouTube Shorts, TikTok videos, and Instagram Reels
• One-click toggle to enable/disable blocking
• Whitelist specific channels or accounts
• Track how many distractions you've avoided
• Zero data collection - your privacy matters

🎯 WHY SHORTBLOCKER?

Short-form videos are designed to keep you scrolling endlessly. ShortBlocker puts you back in control, helping you:

• Stay focused on what matters
• Reduce mindless scrolling
• Reclaim hours of your day

🔒 PRIVACY FIRST

• No data collection
• No external servers
• No tracking
• 100% open source

🌍 AVAILABLE IN

English, 日本語, 简体中文, 繁體中文, 한국어, Español, Português, Deutsch, Français

📖 OPEN SOURCE

ShortBlocker is open source! View the code, report issues, or contribute at:
https://github.com/YOUR_USERNAME/shortblocker

────────────────────────────────────────

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

## 12. OSS Community Management

### 12.1 Bilingual Communication Guidelines

| Scenario | Response Language |
|----------|-------------------|
| Issue in English | Reply in English |
| Issue in Japanese | Reply in Japanese |
| Issue in other language | Reply in English (offer translation help) |
| PR from any language | Review comments in English |
| Release notes | English primary, Japanese translation |

### 12.2 Contributor Recognition

```markdown
<!-- README.md -->

## 🌟 Contributors

<!-- ALL-CONTRIBUTORS-LIST:START -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="..."><img src="..." /><br /><sub><b>Name</b></sub></a><br />💻 📖</td>
    <td align="center"><a href="..."><img src="..." /><br /><sub><b>翻訳者</b></sub></a><br />🌍</td>
  </tr>
</table>
<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

### Contribution Types / 貢献の種類

| Emoji | Type | 説明 |
|-------|------|------|
| 💻 | Code | コード |
| 📖 | Documentation | ドキュメント |
| 🌍 | Translation | 翻訳 |
| 🐛 | Bug reports | バグ報告 |
| 💡 | Ideas | アイデア |
| 🎨 | Design | デザイン |
```

### 12.3 Translation Contribution Guide

```markdown
<!-- TRANSLATING.md -->

# Translation Guide / 翻訳ガイド

Thank you for helping translate ShortBlocker!
ShortBlocker の翻訳にご協力いただきありがとうございます！

## Adding a New Language / 新しい言語の追加

1. Copy `public/_locales/en/` to `public/_locales/{locale}/`
2. Translate all `"message"` values in `messages.json`
3. Do NOT translate `"description"` (these are for developers)
4. Keep placeholders like `$COUNT$` unchanged
5. Run `pnpm i18n:check` to verify completeness
6. Submit a PR with title: `i18n: add {language} translation`

## Language Codes / 言語コード

| Code | Language | 言語 |
|------|----------|------|
| en | English | 英語 |
| ja | Japanese | 日本語 |
| zh_CN | Chinese (Simplified) | 简体中文 |
| zh_TW | Chinese (Traditional) | 繁體中文 |
| ko | Korean | 한국어 |
| es | Spanish | スペイン語 |
| pt_BR | Portuguese (Brazil) | ポルトガル語 |
| de | German | ドイツ語 |
| fr | French | フランス語 |

## Tips / ヒント

- Keep translations concise (UI space is limited)
- Match the tone of the English original
- Test your translations in the actual extension
- Ask questions in Issues if unsure

## Recognition / 謝辞

All translators are credited in:
- README.md Contributors section
- GitHub Release notes
- Extension's About page
```

---

## 13. Development Phases

### Phase 1: Project Setup (1-2 days)

```bash
□ Create GitHub repository
□ Initialize with README.md, LICENSE, .gitignore
□ Setup package.json with i18n scripts
□ Configure TypeScript, ESLint, Prettier
□ Add Vite + @crxjs/vite-plugin
□ Create folder structure
□ Setup i18n infrastructure
□ Add English and Japanese translations
□ Initial commit with proper history
```

### Phase 2: MVP Implementation (3-5 days)

```bash
□ Create manifest.json with i18n
□ Implement Service Worker
□ Implement Content Script
□ YouTube URL detection
□ Basic blocking functionality
□ Popup UI with i18n
□ Storage layer
□ Unit tests (including i18n tests)
```

### Phase 3: Feature Expansion (5-7 days)

```bash
□ TikTok detection
□ Instagram detection
□ DOM-based detection (MutationObserver)
□ Options page with i18n
□ Whitelist functionality
□ Log viewer
□ Add more languages (ZH, KO, ES)
□ Integration tests
```

### Phase 4: Polish & Release (3-5 days)

```bash
□ Firefox compatibility
□ E2E tests
□ CI/CD pipeline with i18n checks
□ Complete documentation (EN, JA)
□ Store listing preparation (all languages)
□ Chrome Web Store submission
□ Firefox Add-ons submission
□ v0.1.0 release
```

---

## Summary

This guide ensures ShortBlocker is built as a **truly global OSS project**:

✅ **International by Design**: i18n built into the architecture from day one  
✅ **Multi-language Support**: 9 languages with extensible framework  
✅ **Global Community**: Bilingual documentation and issue templates  
✅ **Professional Quality**: TypeScript, testing, CI/CD  
✅ **Privacy First**: No data collection, transparent codebase  
✅ **Cross-browser**: Chrome, Firefox, Edge support  

---

## Quick Start Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build:all        # Build for all browsers
pnpm test             # Run tests

# i18n
pnpm i18n:check       # Check translation completeness
pnpm i18n:extract     # Extract strings for translation

# Release
pnpm release          # Build and package for release
```

Questions? Open an issue in English or Japanese! 🚀
