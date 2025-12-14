# GitHub Release 作成手順

## v0.1.0 リリース手順

### 1. GitタグとZIPファイルの準備

```bash
# ビルド済みの場合はスキップ
pnpm build:all

# ZIPファイルを作成
cd dist/chrome
zip -r ../../shortshield-chrome-v0.1.0.zip .
cd ../firefox
zip -r ../../shortshield-firefox-v0.1.0.zip .
cd ../edge
zip -r ../../shortshield-edge-v0.1.0.zip .
cd ../..
```

PowerShellの場合:

```powershell
Compress-Archive -Path dist\chrome\* -DestinationPath shortshield-chrome-v0.1.0.zip -Force
Compress-Archive -Path dist\firefox\* -DestinationPath shortshield-firefox-v0.1.0.zip -Force
Compress-Archive -Path dist\edge\* -DestinationPath shortshield-edge-v0.1.0.zip -Force
```

### 2. Gitタグの作成とプッシュ

```bash
# タグを作成
git tag v0.1.0

# タグをプッシュ
git push origin v0.1.0
```

### 3. GitHub Actionsの自動実行

タグをプッシュすると、`.github/workflows/release.yml` が自動的に実行されます：

1. バージョン検証
2. 全ブラウザ向けビルド
3. ZIPファイル作成
4. GitHub Releaseドラフト作成

**ステータス確認:**

- GitHubリポジトリの「Actions」タブで進行状況を確認
- 成功すると「Releases」にドラフトが作成されます

### 4. Releaseドラフトの編集

1. [Releases ページ](https://github.com/adabana-saki/ShortShield/releases) にアクセス
2. ドラフトの「Edit」をクリック

### 5. Release情報の記入

#### タイトル

```
ShortShield v0.1.0
```

#### 説明文

```markdown
# ShortShield v0.1.0 - Initial Release 🎉

Block short-form videos and reclaim your focus. Comprehensive productivity toolkit for Chrome, Firefox, and Edge.

## ✨ Highlights

ShortShield blocks short-form videos across YouTube Shorts, TikTok, and Instagram Reels, helping you reclaim your time and focus.

**16+ Features including:**

- 🛡️ Multi-platform short-form video blocking
- ⏱️ Focus Mode with soft lock
- 🍅 Pomodoro Timer
- 📊 Time Tracking & Reports
- 🔥 Streak Tracking
- 🧩 Challenge Mode
- 🔒 Lockdown Mode (PIN-protected settings)
- 📅 Schedule Blocking

## 📥 Downloads

### Browser Extensions

| Browser     | Download                                                                                                                              | Status                     |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| **Chrome**  | [shortshield-chrome-v0.1.0.zip](https://github.com/adabana-saki/ShortShield/releases/download/v0.1.0/shortshield-chrome-v0.1.0.zip)   | Coming to Chrome Web Store |
| **Firefox** | [shortshield-firefox-v0.1.0.zip](https://github.com/adabana-saki/ShortShield/releases/download/v0.1.0/shortshield-firefox-v0.1.0.zip) | Coming to Firefox Add-ons  |
| **Edge**    | [shortshield-edge-v0.1.0.zip](https://github.com/adabana-saki/ShortShield/releases/download/v0.1.0/shortshield-edge-v0.1.0.zip)       | Coming to Edge Add-ons     |

### Installation (Development)

1. Download the ZIP file for your browser
2. Extract the contents
3. Load as unpacked extension:
   - **Chrome**: `chrome://extensions` → Developer mode → Load unpacked
   - **Firefox**: `about:debugging#/runtime/this-firefox` → Load Temporary Add-on
   - **Edge**: `edge://extensions` → Developer mode → Load unpacked

## 🛡️ Core Blocking Features

### Multi-Platform Blocking

- **YouTube Shorts** - Remove Shorts shelf, block /shorts URLs
- **TikTok** - Block For You feed and video pages
- **Instagram Reels** - Hide Reels tab and block Reels content

### SNS Feed Blocking

- Twitter/X timeline
- Facebook News Feed
- LinkedIn Feed
- Reddit r/popular and r/all
- Threads main feed
- Snapchat Web Discover feed

### Whitelist & Custom Rules

- Whitelist specific channels, URLs, or domains
- Custom domain blocking
- CSS selector-based custom rules

## ⏱️ Productivity Features

### Focus Mode

- One-click distraction blocking
- 30/60/120 minute durations
- Soft lock (5-second delay to cancel)
- Session countdown timer
- Completion notifications

### Pomodoro Timer

- Classic 25/5 work/break technique
- Customizable durations
- Long break after 4 sessions
- Auto-start options
- Sound notifications
- Pause/resume/skip controls

### Site Time Limits

- Daily usage limits per platform
- Visual warning system (80% = yellow, 100% = red)
- Automatic blocking when limit reached
- Midnight reset

### Time Tracking & Reports

- 90-day usage history
- Daily time spent per platform
- Visual charts and statistics
- Platform breakdown
- Export/delete data

### Streak Tracking

- Track consecutive focus days
- Milestone achievements (7/30/100 days)
- Current and longest streak display
- Motivational progress tracking

### Challenge Mode

- Math puzzles (Easy/Medium/Hard difficulty)
- Typing challenges (sentence reproduction)
- Pattern memory challenges
- Cooldown system (5 min default)
- Optional bypass disable

### Lockdown Mode

- PIN-protect settings (4-8 digits)
- SHA-256 PIN hashing for security
- Emergency bypass system (30 min default)
- Activation/deactivation controls
- Countdown timer for bypass
- Prevents impulsive setting changes

### Schedule Blocking

- Time-based auto-blocking
- Day-specific schedules
- Custom time ranges
- Work hours / sleep time blocking
- Weekend blocking options

## 🎨 Customization

### Custom Block Page

- Personalized block messages
- Custom motivational quotes
- Theme selection (dark/light/system)
- Primary color customization
- Show/hide bypass button

### Multi-Language Support

Supported languages (9):

- 🇬🇧 English
- 🇯🇵 Japanese (日本語)
- 🇩🇪 German (Deutsch)
- 🇪🇸 Spanish (Español)
- 🇫🇷 French (Français)
- 🇰🇷 Korean (한국어)
- 🇧🇷 Portuguese (Português)
- 🇨🇳 Chinese Simplified (简体中文)
- 🇹🇼 Chinese Traditional (繁體中文)

## 🔒 Privacy & Security

- ✅ Zero data collection
- ✅ No analytics or tracking
- ✅ No external requests
- ✅ Everything stays local
- ✅ Open source for full transparency
- ✅ SHA-256 PIN hashing for Lockdown Mode

## 📋 Technical Details

### Browser Support

- Chrome (Manifest V3)
- Firefox (Manifest V3)
- Edge (Manifest V3)

### Tech Stack

- TypeScript strict mode
- React 18 with hooks
- Tailwind CSS
- Vite build system
- Vitest unit testing
- Playwright E2E testing

### Code Quality

- ESLint with security plugin
- Prettier formatting
- Husky pre-commit hooks
- 196 unit tests passing
- Full type safety

## 📝 Full Changelog

See [CHANGELOG.md](https://github.com/adabana-saki/ShortShield/blob/main/CHANGELOG.md) for complete details.

## 🙏 Acknowledgments

Built with:

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [@crxjs/vite-plugin](https://crxjs.dev/)

## 📖 Documentation

- [Features Guide](https://github.com/adabana-saki/ShortShield/blob/main/FEATURES.md)
- [Contributing Guide](https://github.com/adabana-saki/ShortShield/blob/main/CONTRIBUTING.md)
- [Quick Start Guide](https://github.com/adabana-saki/ShortShield/blob/main/docs/QUICK_START.md)

## 💬 Feedback & Support

- 🐛 [Report bugs](https://github.com/adabana-saki/ShortShield/issues)
- 💡 [Request features](https://github.com/adabana-saki/ShortShield/issues)
- 💬 [Join discussions](https://github.com/adabana-saki/ShortShield/discussions)

---

**If ShortShield helped you reclaim your focus, consider giving it a ⭐ on [GitHub](https://github.com/adabana-saki/ShortShield)!**

Developed by [ADALAB](https://adalab.pages.dev/) | Project Lead: Adabana Saki
```

### 6. Releaseの公開

1. 「Set as the latest release」にチェック
2. 「Publish release」をクリック

### 7. リリース後の確認

- [ ] Release URLが機能するか確認
- [ ] ZIPダウンロードが機能するか確認
- [ ] READMEのリンクを更新

## 次のステップ

1. **ソーシャルメディアで共有**
   - Twitter/X
   - Reddit (r/productivity, r/chrome_extensions)
   - Hacker News (Show HN)
   - Product Hunt

2. **ブラウザストアのリンク更新**
   - Chrome Web Store承認後、Release説明文を更新
   - Firefox Add-ons承認後、Release説明文を更新
   - Edge Add-ons承認後、Release説明文を更新

3. **READMEの更新**
   - Installation セクションにストアリンクを追加
   - Download counts badgeを追加（承認後）

## チェックリスト

- [ ] 全ブラウザ向けZIPファイル作成
- [ ] Gitタグ作成・プッシュ
- [ ] GitHub Actions成功確認
- [ ] Releaseドラフト編集
- [ ] Release説明文記入
- [ ] Releaseの公開
- [ ] ダウンロードリンク確認
- [ ] ソーシャルメディアで共有

## 参考リンク

- [GitHub Releases Guide](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository)
