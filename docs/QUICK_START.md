# Quick Start Guide

Get ShortShield up and running in 2 minutes.

---

## For Users

### Installation (Development Build)

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
   ```

4. **Load in browser**

   **Chrome:**
   - Open `chrome://extensions/`
   - Enable "Developer mode" (top right)
   - Click "Load unpacked"
   - Select `dist/chrome` folder

   **Firefox:**
   - Open `about:debugging#/runtime/this-firefox`
   - Click "Load Temporary Add-on"
   - Select any file in `dist/firefox` folder

   **Edge:**
   - Open `edge://extensions/`
   - Enable "Developer mode" (bottom left)
   - Click "Load unpacked"
   - Select `dist/edge` folder

### First Use

1. **Click the ShortShield icon** in your browser toolbar
2. **Toggle the main switch** to enable blocking
3. **Test it:** Visit YouTube and try to access Shorts - they should be blocked!

### Essential Features to Try

1. **Focus Mode**
   - Click ShortShield icon → Focus tab
   - Start a 30-minute focus session
   - All enabled platforms are blocked during focus time

2. **Pomodoro Timer**
   - Click ShortShield icon → Pomodoro tab
   - Start a 25-minute work session
   - Take automatic breaks

3. **Site Time Limits**
   - Right-click icon → Options
   - Navigate to Time Limits
   - Set 30 minutes daily limit for YouTube

---

## For Developers

### Development Setup

1. **Prerequisites**

   ```bash
   node -v  # Should be 20 or higher
   pnpm -v  # Should be 9 or higher
   ```

2. **Clone and install**

   ```bash
   git clone https://github.com/adabana-saki/ShortShield.git
   cd ShortShield
   pnpm install
   ```

3. **Start development server**

   ```bash
   pnpm dev
   ```

   This will:
   - Build the extension with hot reload
   - Watch for file changes
   - Automatically rebuild

4. **Load extension** (same as above - use `dist/chrome`, `dist/firefox`, or `dist/edge`)

### Making Changes

1. **Edit source files** in `src/`
2. **See changes instantly** (hot reload)
3. **Test your changes** in the browser
4. **Run tests**
   ```bash
   pnpm test:unit
   pnpm lint
   pnpm typecheck
   ```

### Project Structure

```
src/
├── background/      # Service worker (background logic)
│   ├── messaging.ts # Message handlers
│   ├── storage.ts   # Settings management
│   └── timers.ts    # Focus mode, Pomodoro, etc.
├── content/         # Content scripts (DOM manipulation)
│   ├── platforms/   # Platform detectors
│   │   ├── youtube.ts
│   │   ├── tiktok.ts
│   │   └── instagram.ts
│   └── actions/     # Blocking actions
├── popup/           # Popup UI (React)
│   ├── App.tsx
│   └── components/
├── options/         # Options page (React)
│   ├── App.tsx
│   └── components/
└── shared/          # Shared code
    ├── types/       # TypeScript types
    ├── hooks/       # React hooks
    └── utils/       # Helper functions
```

### Common Tasks

**Run tests:**

```bash
pnpm test:unit        # Unit tests
pnpm test:e2e         # E2E tests (Playwright)
pnpm test:coverage    # Coverage report
```

**Linting & formatting:**

```bash
pnpm lint             # Check linting
pnpm lint:fix         # Auto-fix issues
pnpm format           # Format code
```

**Type checking:**

```bash
pnpm typecheck        # Check TypeScript types
```

**Build for production:**

```bash
pnpm build:all        # Build all browsers
pnpm release          # Build + test
```

### Making Your First Contribution

1. **Find an issue**
   - Look for [`good first issue`](https://github.com/adabana-saki/ShortShield/labels/good%20first%20issue) label
   - Comment to claim it

2. **Create a branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**

4. **Test thoroughly**

   ```bash
   pnpm lint
   pnpm typecheck
   pnpm test:unit
   ```

5. **Commit**

   ```bash
   git commit -m "feat: add your feature description"
   ```

   Follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation
   - `test:` - Tests
   - `refactor:` - Code refactoring

6. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

---

## Troubleshooting

### Extension not loading

- Make sure you built the extension first (`pnpm build:chrome`)
- Check that you selected the correct `dist/[browser]` folder
- Try reloading the extension page

### Changes not appearing

- Check if dev server is running (`pnpm dev`)
- Reload the extension (click reload icon in extensions page)
- Hard refresh the page you're testing on (Ctrl+Shift+R)

### Build errors

```bash
# Clean and reinstall
rm -rf node_modules dist
pnpm install
pnpm build:chrome
```

### Tests failing

```bash
# Update snapshots
pnpm test:unit -- -u

# Run specific test
pnpm test:unit -- youtube.test.ts
```

---

## Resources

- **Full Documentation**: [README.md](../README.md)
- **Features Guide**: [FEATURES.md](../FEATURES.md)
- **Contributing Guide**: [CONTRIBUTING.md](../CONTRIBUTING.md)
- **Architecture**: [ARCHITECTURE.md](ARCHITECTURE.md)
- **Detection Rules**: [DETECTION_RULES.md](DETECTION_RULES.md)

---

## Need Help?

- **Issues**: [Report bugs](https://github.com/adabana-saki/ShortShield/issues)
- **Discussions**: [Ask questions](https://github.com/adabana-saki/ShortShield/discussions)

---

**Happy blocking! 🛡️**
