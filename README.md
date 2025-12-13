# ShortShield

> Block short-form videos and reclaim your focus

[![CI](https://github.com/adalab/shortshield/actions/workflows/ci.yml/badge.svg)](https://github.com/adalab/shortshield/actions/workflows/ci.yml)
[![CodeQL](https://github.com/adalab/shortshield/actions/workflows/codeql.yml/badge.svg)](https://github.com/adalab/shortshield/actions/workflows/codeql.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

ShortShield is a browser extension that helps you stay focused by blocking short-form video content on YouTube Shorts, TikTok, and Instagram Reels.

[日本語](README.ja.md)

## Features

- **Multi-Platform Support**: Block content on YouTube Shorts, TikTok, and Instagram Reels
- **Granular Control**: Enable/disable blocking per platform
- **Whitelist**: Allow specific channels, URLs, or domains
- **Custom Rules**: Add your own CSS selectors for advanced blocking
- **Privacy-First**: All data stays local, no external tracking
- **Cross-Browser**: Works on Chrome and Firefox

## Installation

### Chrome Web Store

Coming soon!

### Firefox Add-ons

Coming soon!

### Manual Installation (Development)

1. Clone the repository:
   ```bash
   git clone https://github.com/adalab/shortshield.git
   cd shortshield
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Build the extension:
   ```bash
   # For Chrome
   pnpm build:chrome

   # For Firefox
   pnpm build:firefox
   ```

4. Load the extension:
   - **Chrome**: Go to `chrome://extensions/`, enable "Developer mode", click "Load unpacked", and select the `dist/chrome` folder
   - **Firefox**: Go to `about:debugging#/runtime/this-firefox`, click "Load Temporary Add-on", and select any file in the `dist/firefox` folder

## Usage

### Basic Controls

1. Click the ShortShield icon in your browser toolbar
2. Use the main toggle to enable/disable blocking
3. Toggle individual platforms as needed

### Whitelist

1. Open the extension options (click the gear icon)
2. Go to the Whitelist section
3. Add channels, URLs, or domains you want to allow

### Custom Rules

1. Open the extension options
2. Go to Custom Rules section
3. Add CSS selectors for elements you want to block

## Development

### Prerequisites

- Node.js 20+
- pnpm 9+

### Commands

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for Chrome
pnpm build:chrome

# Build for Firefox
pnpm build:firefox

# Build for all browsers
pnpm build:all

# Run unit tests
pnpm test:unit

# Run E2E tests
pnpm test:e2e

# Run linting
pnpm lint

# Run type checking
pnpm typecheck

# Check translations
pnpm i18n:check
```

### Project Structure

```
shortshield/
├── src/
│   ├── background/     # Service Worker
│   ├── content/        # Content Scripts
│   │   ├── platforms/  # Platform detectors
│   │   └── actions/    # Blocking actions
│   ├── popup/          # Popup UI
│   ├── options/        # Options page
│   └── shared/         # Shared utilities
├── public/
│   ├── icons/          # Extension icons
│   └── _locales/       # i18n messages
├── tests/
│   ├── unit/           # Unit tests
│   ├── integration/    # Integration tests
│   └── e2e/            # E2E tests
└── docs/               # Documentation
```

## Privacy

ShortShield is designed with privacy in mind:

- **No data collection**: We don't collect any user data
- **No external requests**: All functionality works offline
- **Local storage only**: Settings are stored locally in your browser
- **Open source**: Full transparency of what the code does

See our [Privacy Policy](docs/PRIVACY_POLICY.md) for more details.

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Translations

Help us translate ShortShield into more languages. See [TRANSLATING.md](TRANSLATING.md) for instructions.

## Security

For security issues, please see our [Security Policy](SECURITY.md).

## License

[MIT](LICENSE)

## Acknowledgments

- Built with [React](https://react.dev/)
- Bundled with [Vite](https://vitejs.dev/)
- Extension framework by [@crxjs/vite-plugin](https://crxjs.dev/)
