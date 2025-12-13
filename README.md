<div align="center">

# ShortShield

**Block short-form videos. Reclaim your focus.**

_The average person spends 2.5 hours daily on short-form videos. Take back your time._

[![CI](https://github.com/adabana-saki/ShortShield/actions/workflows/ci.yml/badge.svg)](https://github.com/adabana-saki/ShortShield/actions/workflows/ci.yml)
[![CodeQL](https://github.com/adabana-saki/ShortShield/actions/workflows/codeql.yml/badge.svg)](https://github.com/adabana-saki/ShortShield/actions/workflows/codeql.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Chrome](https://img.shields.io/badge/Chrome-Extension-4285F4?logo=googlechrome&logoColor=white)](https://github.com/adabana-saki/ShortShield)
[![Firefox](https://img.shields.io/badge/Firefox-Add--on-FF7139?logo=firefox&logoColor=white)](https://github.com/adabana-saki/ShortShield)
[![Edge](https://img.shields.io/badge/Edge-Add--on-0078D7?logo=microsoftedge&logoColor=white)](https://github.com/adabana-saki/ShortShield)

[**Install**](#installation) · [**Features**](#features) · [**Demo**](#demo) · [**Contributing**](CONTRIBUTING.md)

[日本語](README.ja.md) | [简体中文](README.zh-CN.md) | [한국어](README.ko.md)

</div>

---

## The Problem

> "I opened TikTok for 5 minutes... and 2 hours disappeared."

Sound familiar? Short-form videos are engineered to hijack your attention:

- **Dopamine loops**: Each 15-second video triggers a reward response
- **Infinite scroll**: No natural stopping point
- **Algorithm optimization**: Content gets more addictive over time

The result? Fragmented attention, reduced productivity, and hours lost daily.

## The Solution

**ShortShield blocks short-form video content at the source** — before willpower even enters the equation.

```text
YouTube Shorts  → Blocked
TikTok Feed     → Blocked
Instagram Reels → Blocked
```

No more "just one more video." No more doom scrolling. Just focus.

---

## Demo

<div align="center">

<!-- TODO: Add actual demo GIF -->

![ShortShield Demo](docs/assets/demo-placeholder.png)

_One click to block. One click to unblock. Full control._

</div>

|  Without ShortShield  |    With ShortShield     |
| :-------------------: | :---------------------: |
|  Endless scroll trap  | Clean, focused browsing |
|  2+ hours lost daily  |     Time reclaimed      |
| Constant distractions |    Deep work enabled    |

---

## Features

| Feature                     | Description                                           |
| --------------------------- | ----------------------------------------------------- |
| **Multi-Platform Blocking** | YouTube Shorts, TikTok, Instagram Reels — all covered |
| **Per-Platform Control**    | Block TikTok but allow Shorts? You decide             |
| **Whitelist System**        | Allow specific creators, channels, or URLs            |
| **Custom Rules**            | Add your own CSS selectors for advanced blocking      |
| **Privacy-First**           | Zero data collection. Everything stays local          |
| **Cross-Browser**           | Chrome, Firefox, Edge supported                       |

---

## Comparison

| Feature         | ShortShield |  BlockSite  | uBlock Origin | Screen Time |
| --------------- | :---------: | :---------: | :-----------: | :---------: |
| YouTube Shorts  |     ✅      | ⚠️ Partial  |      ❌       |     ❌      |
| TikTok          |     ✅      |     ✅      |      ❌       |     ✅      |
| Instagram Reels |     ✅      | ⚠️ Partial  |      ❌       |     ❌      |
| Whitelist       |   ✅ Free   |   💰 Paid   |      N/A      |     ❌      |
| Custom Rules    |     ✅      |     ❌      |      ✅       |     ❌      |
| Privacy         | ✅ No data  | ❌ Collects |  ✅ No data   | ❌ Collects |
| Open Source     |     ✅      |     ❌      |      ✅       |     ❌      |
| Price           |  **Free**   |  Freemium   |     Free      |    Paid     |

---

## Installation

### Browser Stores

| Browser | Status      | Link             |
| ------- | ----------- | ---------------- |
| Chrome  | Coming Soon | Chrome Web Store |
| Firefox | Coming Soon | Firefox Add-ons  |
| Edge    | Coming Soon | Edge Add-ons     |

### Manual Installation (Development)

<details>
<summary><strong>Click to expand installation steps</strong></summary>

1. **Clone the repository**

   ```bash
   git clone https://github.com/adabana-saki/ShortShield.git
   cd ShortShield
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Build the extension**

   ```bash
   # For Chrome
   pnpm build:chrome

   # For Firefox
   pnpm build:firefox

   # For Edge
   pnpm build:edge

   # Build all browsers
   pnpm build:all
   ```

4. **Load the extension**
   - **Chrome**: Go to `chrome://extensions/`, enable "Developer mode", click "Load unpacked", select `dist/chrome`
   - **Firefox**: Go to `about:debugging#/runtime/this-firefox`, click "Load Temporary Add-on", select any file in `dist/firefox`
   - **Edge**: Go to `edge://extensions/`, enable "Developer mode", click "Load unpacked", select `dist/edge`

</details>

---

## Usage

### Quick Start

1. Click the **ShortShield icon** in your browser toolbar
2. Toggle the **main switch** to enable/disable blocking
3. Use **platform toggles** to control individual sites

### Whitelist (Allow Specific Content)

1. Open extension **Options** (gear icon)
2. Navigate to **Whitelist** section
3. Add channels, URLs, or domains you want to allow

### Custom Blocking Rules

1. Open extension **Options**
2. Navigate to **Custom Rules** section
3. Add CSS selectors for elements to block

---

## Why ShortShield Exists

**I was angry.** Hours lost every day to short-form videos. Late nights scrolling, achieving nothing, just watching time disappear. This frustration with wasted time and the regret that followed drove me to create ShortShield.

After realizing I was spending 3+ hours daily on short-form videos, I tried everything:

- ❌ **Willpower** — Failed after 2 days
- ❌ **App timers** — Just tapped "ignore"
- ❌ **Uninstalling apps** — Reinstalled within hours
- ❌ **Website blockers** — Too aggressive, blocked everything

What I needed was **surgical precision**: block the addictive content, but keep the platforms usable for legitimate purposes (search, specific creators, etc.).

ShortShield is that tool.

### The Mission

**I want you to reclaim your time.** Protect your life from these cleverly engineered time thieves. Use those recovered hours to focus on what truly matters. **Live more efficiently. Live more intentionally.**

ShortShield isn't just a blocker. It's a shield for your time and your life.

---

## The Science

Short-form video platforms use psychological techniques to maximize engagement:

| Technique            | How It Works                              | ShortShield's Response      |
| -------------------- | ----------------------------------------- | --------------------------- |
| **Variable Rewards** | Unpredictable content keeps you scrolling | Block the feed entirely     |
| **Infinite Scroll**  | No natural stopping point                 | Remove the scroll mechanism |
| **Autoplay**         | Next video starts without consent         | Prevent video loading       |
| **FOMO Design**      | "Trending" and "For You" create urgency   | Hide recommendation UI      |

---

## FAQ

<details>
<summary><strong>Does this completely block YouTube/TikTok/Instagram?</strong></summary>

No. ShortShield only blocks the **short-form video sections** (Shorts, For You page, Reels). You can still use YouTube search, watch regular videos, browse Instagram posts, etc.

</details>

<details>
<summary><strong>Can I temporarily disable blocking?</strong></summary>

Yes! One click on the extension icon toggles blocking on/off. You can also disable specific platforms while keeping others blocked.

</details>

<details>
<summary><strong>Does ShortShield collect my data?</strong></summary>

**No.** ShortShield is 100% local. No analytics, no tracking, no external requests. Your browsing data never leaves your device.

</details>

<details>
<summary><strong>Why not just use uBlock Origin?</strong></summary>

uBlock Origin is great for ads, but blocking short-form videos requires platform-specific rules that update frequently. ShortShield maintains these rules and provides a user-friendly interface.

</details>

<details>
<summary><strong>Will this work on mobile?</strong></summary>

Currently, ShortShield is desktop-only (browser extension). Mobile support is on the roadmap.

</details>

---

## Roadmap

- [x] Core blocking engine
- [x] YouTube Shorts support
- [x] TikTok support
- [x] Instagram Reels support
- [x] Whitelist system
- [x] Custom rules
- [x] Multi-browser support
- [ ] Browser store release
- [ ] Usage statistics dashboard
- [ ] **Timer functionality** (daily usage limits)
- [ ] **Custom domain blocking** (add your own sites to block)
- [ ] **Anti-unblock mechanism** (make it harder to disable protection)
- [ ] Scheduled blocking (focus hours)
- [ ] Mobile browser support (Firefox Android)
- [ ] Safari extension

[View full roadmap →](https://github.com/adabana-saki/ShortShield/projects)

---

## Development

### Prerequisites

- Node.js 20+
- pnpm 9+

### Commands

```bash
pnpm install        # Install dependencies
pnpm dev            # Start development server
pnpm build:all      # Build for all browsers
pnpm test:unit      # Run unit tests
pnpm test:e2e       # Run E2E tests
pnpm lint           # Run linting
pnpm typecheck      # Run type checking
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
└── tests/              # Test suites
```

---

## Contributing

We welcome contributions! ShortShield is designed to be contributor-friendly.

### Quick Start

```bash
git clone https://github.com/adabana-saki/ShortShield.git
cd ShortShield
pnpm install
pnpm dev
```

### Good First Issues

Looking to contribute? Check out issues labeled [`good first issue`](https://github.com/adabana-saki/ShortShield/labels/good%20first%20issue).

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

### Translations

Help translate ShortShield! See [TRANSLATING.md](TRANSLATING.md) for instructions.

---

## Privacy

ShortShield is built with privacy as a core principle:

- **No data collection** — We don't collect any user data
- **No external requests** — All functionality works offline
- **Local storage only** — Settings stored in your browser
- **Open source** — Full code transparency

See our [Privacy Policy](docs/PRIVACY_POLICY.md) for details.

## Security

Found a vulnerability? Please see our [Security Policy](SECURITY.md).

## License

[MIT](LICENSE) — Use it, modify it, share it.

---

## Acknowledgments

- Built with [React](https://react.dev/)
- Bundled with [Vite](https://vitejs.dev/)
- Extension framework by [@crxjs/vite-plugin](https://crxjs.dev/)

---

<div align="center">

**Developed by [ADALAB](https://adalab.pages.dev/)**

Project Lead: Adabana Saki

---

If ShortShield helped you reclaim your focus, consider giving it a ⭐

[⭐ Star this project](https://github.com/adabana-saki/ShortShield)

</div>
