# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Edge browser support with dedicated manifest
- Comprehensive i18n support (9 languages total)
  - Chinese Simplified (zh_CN)
  - Chinese Traditional (zh_TW)
  - Korean (ko)
  - Spanish (es)
  - Portuguese Brazil (pt_BR)
  - German (de)
  - French (fr)
- Store listings for all supported languages
- README translations (Chinese, Korean)
- Japanese PR template
- Detection rules documentation
- i18n utility tests

### Changed

- Updated build system to support Chrome, Firefox, and Edge
- Improved locale file structure

### Security

- Input validation and sanitization
- Content Security Policy compliance
- Message sender validation

## [0.1.0] - 2025-12-14

### Added - Core Blocking

- **Multi-Platform Short-Form Video Blocking**
  - YouTube Shorts (home feed, shelf, player, URL-based)
  - TikTok (For You feed, video containers)
  - Instagram Reels (Reels tab, feed reels)
- **SNS Feed Blocking**
  - Twitter/X timeline blocking
  - Facebook News Feed blocking
  - LinkedIn Feed blocking
  - Reddit r/popular and r/all blocking
  - Threads main feed blocking
  - Snapchat Web Discover feed blocking
- **Custom Domain Blocking**
  - Add any website to block list
  - Per-domain enable/disable
  - Custom block messages
- **Whitelist System**
  - Whitelist by channel (YouTube)
  - Whitelist by URL (specific videos/posts)
  - Whitelist by domain
- **Custom Blocking Rules**
  - CSS selector-based blocking
  - Platform-specific rules
  - User-defined custom rules

### Added - Focus & Productivity Features

- **Focus Mode**
  - One-click distraction blocking
  - 30/60/120 minute durations
  - Soft lock (5-second delay to cancel)
  - Session countdown timer
  - Completion notifications
- **Pomodoro Timer**
  - Classic 25/5 work/break technique
  - Customizable work/break durations
  - Long break after 4 sessions (15 min default)
  - Auto-start work sessions
  - Auto-start breaks
  - Sound notifications (optional)
  - Pause/resume/skip controls
- **Site Time Limits**
  - Daily usage limits per platform
  - Time tracking with visual indicators
  - Warning system (80% = yellow, 100% = red)
  - Automatic blocking when limit exceeded
  - Midnight reset
- **Time Tracking & Reports**
  - 90-day usage history
  - Daily time spent per platform
  - Visual charts and graphs
  - Total usage statistics
  - Platform breakdown
  - Export/delete data
- **Streak Tracking**
  - Track consecutive focus days
  - Milestone achievements (7/30/100 days)
  - Current and longest streak display
  - Visual progress tracking
  - Motivational milestones
- **Challenge Mode**
  - Math puzzles (Easy/Medium/Hard)
  - Typing challenges (sentence reproduction)
  - Pattern memory challenges
  - Cooldown system (5 min default)
  - Difficulty-based complexity
  - Optional bypass disable
- **Lockdown Mode**
  - PIN-protected settings (4-8 digits)
  - SHA-256 PIN hashing
  - Emergency bypass system (30 min default)
  - Activation/deactivation controls
  - Countdown timer for bypass
  - Prevents impulsive setting changes
- **Schedule Blocking**
  - Time-based auto-blocking
  - Day-specific schedules
  - Custom time ranges
  - Work hours blocking
  - Sleep time blocking
  - Weekend blocking options

### Added - Customization & UX

- **Custom Block Page**
  - Personalized block messages
  - Custom motivational quotes
  - Theme selection (dark/light/system)
  - Primary color customization
  - Show/hide bypass button
- **Multi-Language Support (9 languages)**
  - English (en)
  - Japanese (ja)
  - German (de)
  - Spanish (es)
  - French (fr)
  - Korean (ko)
  - Portuguese Brazil (pt_BR)
  - Chinese Simplified (zh_CN)
  - Chinese Traditional (zh_TW)
  - Auto-detection based on browser language
- **Popup UI**
  - Main toggle switch
  - Per-platform toggles
  - Block statistics display
  - Focus Mode quick access
  - Pomodoro Timer controls
- **Options Page**
  - Whitelist management
  - Custom CSS rules
  - Activity log viewer
  - Settings export/import
  - All feature configurations
  - Multi-tab organization

### Technical

- **Browser Support**
  - Chrome (Manifest V3)
  - Firefox (Manifest V3)
  - Edge (Manifest V3)
- **Architecture**
  - TypeScript strict mode
  - React 18 with hooks
  - Tailwind CSS styling
  - Vite build system
  - Message passing architecture
  - Storage API for persistence
- **Testing & Quality**
  - Vitest unit testing
  - Playwright E2E testing
  - ESLint with security plugin
  - Prettier code formatting
  - TypeScript type checking
  - Husky pre-commit hooks
- **Security**
  - Content Security Policy (CSP)
  - Input validation and sanitization
  - Message sender verification
  - No external data transmission
  - Minimal permissions model
  - SHA-256 PIN hashing for Lockdown Mode
- **Documentation**
  - Comprehensive README with feature tables
  - FEATURES.md with detailed guides
  - CONTRIBUTING.md for contributors
  - SECURITY.md for vulnerability reporting
  - Privacy Policy
  - Architecture documentation
  - Detection rules documentation

---

## Version History Format

### Types of Changes

- **Added** for new features
- **Changed** for changes in existing functionality
- **Deprecated** for soon-to-be removed features
- **Removed** for now removed features
- **Fixed** for any bug fixes
- **Security** for vulnerability fixes

### Example Entry

```markdown
## [1.2.0] - 2024-03-15

### Added

- New feature description (#123)

### Changed

- Updated behavior (#124)

### Fixed

- Bug fix description (#125)

### Security

- Security improvement (#126)
```
