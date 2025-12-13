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

## [0.1.0] - TBD

### Added

- YouTube Shorts blocking
  - Home feed detection
  - Shorts shelf hiding
  - Shorts player redirection
  - URL-based detection
- TikTok blocking
  - For You feed blocking
  - Video container hiding
- Instagram Reels blocking
  - Reels tab blocking
  - Feed Reels hiding
- Popup UI
  - Main toggle switch
  - Per-platform toggles
  - Block statistics display
- Options page
  - Whitelist management
  - Custom CSS rules
  - Activity log viewer
  - Settings export/import
- Internationalization
  - English (default)
  - Japanese

### Technical

- Chrome Manifest V3 support
- Firefox Manifest V2 support
- TypeScript strict mode
- React 18 with hooks
- Tailwind CSS styling
- Vite build system
- Vitest unit testing
- Playwright E2E testing

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
