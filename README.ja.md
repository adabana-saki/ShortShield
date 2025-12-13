# ShortShield

> 短尺動画をブロックして集中力を取り戻す

[![CI](https://github.com/adabana-saki/ShortShield/actions/workflows/ci.yml/badge.svg)](https://github.com/adabana-saki/ShortShield/actions/workflows/ci.yml)
[![CodeQL](https://github.com/adabana-saki/ShortShield/actions/workflows/codeql.yml/badge.svg)](https://github.com/adabana-saki/ShortShield/actions/workflows/codeql.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

ShortShieldは、YouTube Shorts、TikTok、Instagram Reelsなどの短尺動画コンテンツをブロックし、集中力を維持するためのブラウザ拡張機能です。

**開発: [ADALAB](https://adalab.pages.dev/)**

[English](README.md) | [简体中文](README.zh-CN.md) | [한국어](README.ko.md)

## 機能

- **マルチプラットフォーム対応**: YouTube Shorts、TikTok、Instagram Reelsをブロック
- **細かな制御**: プラットフォームごとにブロックの有効/無効を切り替え
- **ホワイトリスト**: 特定のチャンネル、URL、ドメインを許可
- **カスタムルール**: 高度なブロックのためのCSSセレクタを追加
- **プライバシー優先**: すべてのデータはローカルに保存、外部トラッキングなし
- **クロスブラウザ**: Chrome、Firefox、Edgeに対応

## インストール

### Chrome ウェブストア

近日公開予定！

### Firefox Add-ons

近日公開予定！

### Edge アドオン

近日公開予定！

### 手動インストール（開発用）

1. リポジトリをクローン:

   ```bash
   git clone https://github.com/adabana-saki/ShortShield.git
   cd ShortShield
   ```

2. 依存関係をインストール:

   ```bash
   pnpm install
   ```

3. 拡張機能をビルド:

   ```bash
   # Chrome用
   pnpm build:chrome

   # Firefox用
   pnpm build:firefox

   # Edge用
   pnpm build:edge

   # 全ブラウザ用
   pnpm build:all
   ```

4. 拡張機能を読み込み:
   - **Chrome**: `chrome://extensions/` を開き、「デベロッパーモード」を有効にし、「パッケージ化されていない拡張機能を読み込む」をクリックして `dist/chrome` フォルダを選択
   - **Firefox**: `about:debugging#/runtime/this-firefox` を開き、「一時的なアドオンを読み込む」をクリックして `dist/firefox` フォルダ内の任意のファイルを選択
   - **Edge**: `edge://extensions/` を開き、「開発者モード」を有効にし、「展開して読み込み」をクリックして `dist/edge` フォルダを選択

## 使い方

### 基本操作

1. ブラウザツールバーのShortShieldアイコンをクリック
2. メイントグルでブロックの有効/無効を切り替え
3. 必要に応じて各プラットフォームを個別にトグル

### ホワイトリスト

1. 拡張機能オプションを開く（歯車アイコンをクリック）
2. ホワイトリストセクションに移動
3. 許可したいチャンネル、URL、ドメインを追加

### カスタムルール

1. 拡張機能オプションを開く
2. カスタムルールセクションに移動
3. ブロックしたい要素のCSSセレクタを追加

## 開発

### 前提条件

- Node.js 20以上
- pnpm 9以上

### コマンド

```bash
# 依存関係のインストール
pnpm install

# 開発サーバーの起動
pnpm dev

# Chrome用ビルド
pnpm build:chrome

# Firefox用ビルド
pnpm build:firefox

# Edge用ビルド
pnpm build:edge

# 全ブラウザ用ビルド
pnpm build:all

# ユニットテストの実行
pnpm test:unit

# E2Eテストの実行
pnpm test:e2e

# Lintの実行
pnpm lint

# 型チェックの実行
pnpm typecheck

# 翻訳のチェック
pnpm i18n:check
```

### プロジェクト構成

```
shortshield/
├── src/
│   ├── background/     # Service Worker
│   ├── content/        # Content Scripts
│   │   ├── platforms/  # プラットフォーム検出
│   │   └── actions/    # ブロックアクション
│   ├── popup/          # ポップアップUI
│   ├── options/        # オプションページ
│   └── shared/         # 共有ユーティリティ
├── public/
│   ├── icons/          # 拡張機能アイコン
│   └── _locales/       # i18nメッセージ
├── tests/
│   ├── unit/           # ユニットテスト
│   ├── integration/    # 統合テスト
│   └── e2e/            # E2Eテスト
└── docs/               # ドキュメント
```

## プライバシー

ShortShieldはプライバシーを重視して設計されています:

- **データ収集なし**: ユーザーデータは一切収集しません
- **外部リクエストなし**: すべての機能がオフラインで動作
- **ローカルストレージのみ**: 設定はブラウザにローカル保存
- **オープンソース**: コードの完全な透明性

詳細は[プライバシーポリシー](docs/PRIVACY_POLICY.ja.md)をご覧ください。

## コントリビューション

コントリビューションを歓迎します！詳細は[コントリビューションガイド](CONTRIBUTING.ja.md)をご覧ください。

### 翻訳

ShortShieldをより多くの言語に翻訳するお手伝いをしてください。手順については[TRANSLATING.md](TRANSLATING.md)をご覧ください。

## セキュリティ

セキュリティに関する問題については、[セキュリティポリシー](SECURITY.md)をご覧ください。

## ライセンス

[MIT](LICENSE)

## 謝辞

- [React](https://react.dev/)で構築
- [Vite](https://vitejs.dev/)でバンドル
- [@crxjs/vite-plugin](https://crxjs.dev/)による拡張機能フレームワーク

---

**ShortShield** は [ADALAB](https://adalab.pages.dev/) によって開発・メンテナンスされています

プロジェクトリード: Adabana Saki
