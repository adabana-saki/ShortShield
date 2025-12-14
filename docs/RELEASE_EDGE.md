# Microsoft Edge Add-ons リリース手順

## 事前準備

### 必要なもの

- Microsoft アカウント
- 開発者登録料: **無料**（個人）または $9.99（企業）
- ZIPファイル: `dist/edge` フォルダ

## 手順

### 1. Microsoft Partner Center 登録

1. [Microsoft Partner Center](https://partner.microsoft.com/dashboard/microsoftedge/public/login) にアクセス
2. Microsoft アカウントでログイン
3. 初回のみ：開発者アカウント登録
   - **個人**: 無料
   - **企業**: $9.99（一回のみ）

### 2. 拡張機能のZIP作成

```bash
cd dist/edge
zip -r ../../shortshield-edge-v0.1.0.zip .
cd ../..
```

またはWindows PowerShellで：

```powershell
Compress-Archive -Path dist\edge\* -DestinationPath shortshield-edge-v0.1.0.zip
```

### 3. 新しい拡張機能を作成

1. Partner Center ダッシュボードで「新しい拡張機能」をクリック
2. ZIPファイルをアップロード
3. 自動検証完了後「続行」

### 4. プロパティ情報

#### 表示名

```
ShortShield
```

#### カテゴリ

- **Productivity**

#### プライバシーポリシーURL

```
https://github.com/adabana-saki/ShortShield/blob/main/docs/PRIVACY_POLICY.md
```

### 5. ストア掲載情報

#### 簡単な説明 (132文字以内)

```
Block short-form videos and reclaim your focus. Comprehensive productivity toolkit with Focus Mode, Pomodoro Timer, and more.
```

#### 詳細な説明

```markdown
ShortShield helps you reclaim your time by blocking short-form videos across YouTube Shorts, TikTok, and Instagram Reels.

🛡️ CORE BLOCKING FEATURES
• Multi-platform blocking (YouTube Shorts, TikTok, Instagram Reels)
• SNS feed blocking (Twitter, Facebook, LinkedIn, Reddit, Threads, Snapchat)
• Custom domain blocking for any website
• Whitelist system for trusted channels and URLs
• Custom CSS rules for advanced blocking

⏱️ PRODUCTIVITY FEATURES
• Focus Mode - One-click distraction blocking (30/60/120 minutes with soft lock)
• Pomodoro Timer - Classic 25/5 work/break cycles with auto-start
• Site Time Limits - Set daily usage limits per platform
• Time Tracking - 90-day usage history with visual reports
• Streak Tracking - Track consecutive focus days with milestones
• Challenge Mode - Solve math/typing/pattern puzzles to bypass blocks
• Lockdown Mode - PIN-protect settings to prevent impulsive changes
• Schedule Blocking - Auto-block during specific hours (work/sleep time)

🎨 CUSTOMIZATION
• Custom block page with motivational messages and themes
• Multi-language support (English, Japanese, German, Spanish, French, Korean, Portuguese, Chinese Simplified, Chinese Traditional)
• Dark/Light/System themes with custom colors
• Fully customizable settings

🔒 PRIVACY-FIRST DESIGN
• Zero data collection - No analytics, no tracking, no external requests
• Everything stays local on your device
• Open source for full transparency
• SHA-256 PIN hashing for Lockdown Mode security

Perfect for students, professionals, and anyone looking to reduce screen time, improve focus, and build better digital habits.

🌟 OPEN SOURCE
GitHub: https://github.com/adabana-saki/ShortShield
License: MIT
```

#### 検索キーワード (最大7個)

```
productivity
focus
blocker
youtube shorts
tiktok
pomodoro
time tracking
```

### 6. グラフィック素材

#### ストアアイコン

- **300x300px**: `public/icons/icon-128.png` をリサイズ

#### スクリーンショット

**必須: 最低1枚、推奨3-5枚**

推奨サイズ: **1366x768px** または **1280x800px**

1. メインUI - ポップアップ画面
2. ブロック画面 - 実際のブロック動作
3. Focus Mode - Focus Modeタイマー
4. 設定画面 - オプションページ
5. 統計画面 - Time Reports

各スクリーンショットにキャプション追加:

- "Main popup with platform toggles"
- "Block page in action"
- "Focus Mode timer"
- "Comprehensive settings"
- "Time tracking reports"

### 7. パッケージの詳細

#### 可視性

- **公開** (推奨)
- または「非公開」「特定のユーザー」

#### 市場

- **すべての市場** (推奨)
- または特定の国/地域のみ

#### 料金

- **無料**

### 8. プライバシー設定

#### データ収集

- **いいえ、この拡張機能はデータを収集しません**

#### 権限の説明

```
This extension requests the following permissions:

• storage - Save user settings and time tracking data locally on device
• tabs - Detect when user visits short-form video websites to apply blocking
• alarms - Implement Focus Mode and Pomodoro timer functionality
• notifications - Display notifications when focus sessions complete

No data is collected, transmitted, or shared. All data stays on your device.
```

### 9. 年齢制限

- **なし** - すべての年齢に適しています

### 10. 審査に提出

1. すべての情報を確認
2. 「公開のために送信」をクリック
3. 審査には通常 **3-5営業日** かかります

### 11. 公開後

#### 承認された場合

- ストアURLは: `https://microsoftedge.microsoft.com/addons/detail/[拡張機能ID]`
- README とソーシャルメディアで共有

#### 拒否された場合

- 拒否理由を確認
- 修正して再提出

## Edgeの特徴

✅ **Chromiumベース** - ChromeとほぼJavaScript同じパッケージ使用可能
✅ **個人は無料** - 企業のみ$9.99の登録料
⚠️ **審査が遅め** - Chrome/Firefoxより時間がかかる場合がある
⚠️ **ユーザー数少なめ** - Chrome/Firefoxより市場が小さい

## よくある拒否理由

1. **スクリーンショット不足** - 最低1枚必要
2. **プライバシーポリシー不備** - URLを明記
3. **説明不明確** - 機能を明確に説明
4. **権限の説明不足** - 各権限の使用理由を詳細に

## 更新版のリリース

1. `package.json` のバージョンを更新
2. 新しいZIPをビルド
3. Partner Centerで「パッケージを更新」
4. 変更内容を説明
5. 提出

## チェックリスト

- [ ] Microsoft Partner Center 登録完了
- [ ] ZIPファイル作成
- [ ] ストア掲載情報記入
- [ ] スクリーンショット準備（最低1枚）
- [ ] プライバシーポリシーURL設定
- [ ] 権限の説明記入
- [ ] 検索キーワード設定
- [ ] 審査に提出
- [ ] 承認待ち

## 参考リンク

- [Microsoft Partner Center](https://partner.microsoft.com/dashboard/microsoftedge)
- [公式ガイド](https://docs.microsoft.com/microsoft-edge/extensions-chromium/publish/publish-extension)
- [審査ポリシー](https://docs.microsoft.com/microsoft-edge/extensions-chromium/store-policies/developer-policies)
