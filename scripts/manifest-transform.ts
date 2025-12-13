/**
 * Manifest transformation script
 * Transforms manifest.json between Chrome MV3 and Firefox MV2 formats
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

interface ChromeManifest {
  manifest_version: 3;
  name: string;
  version: string;
  description: string;
  default_locale?: string;
  permissions: string[];
  host_permissions?: string[];
  background: {
    service_worker: string;
    type?: string;
  };
  content_scripts?: Array<{
    matches: string[];
    js: string[];
    run_at?: string;
  }>;
  action?: {
    default_popup?: string;
    default_icon?: Record<string, string>;
    default_title?: string;
  };
  options_ui?: {
    page: string;
    open_in_tab?: boolean;
  };
  icons?: Record<string, string>;
  content_security_policy?: {
    extension_pages: string;
  };
}

interface FirefoxManifest {
  manifest_version: 2;
  name: string;
  version: string;
  description: string;
  default_locale?: string;
  permissions: string[];
  browser_specific_settings?: {
    gecko: {
      id: string;
      strict_min_version: string;
    };
  };
  background: {
    scripts: string[];
    persistent: boolean;
  };
  content_scripts?: Array<{
    matches: string[];
    js: string[];
    run_at?: string;
  }>;
  browser_action?: {
    default_popup?: string;
    default_icon?: Record<string, string>;
    default_title?: string;
  };
  options_ui?: {
    page: string;
    open_in_tab?: boolean;
  };
  icons?: Record<string, string>;
  content_security_policy?: string;
}

/**
 * Transform Chrome MV3 manifest to Firefox MV2 format
 */
function chromeToFirefox(chrome: ChromeManifest, geckoId: string): FirefoxManifest {
  const firefox: FirefoxManifest = {
    manifest_version: 2,
    name: chrome.name,
    version: chrome.version,
    description: chrome.description,
    default_locale: chrome.default_locale,
    // Merge permissions and host_permissions for MV2
    permissions: [
      ...chrome.permissions,
      ...(chrome.host_permissions || []),
    ],
    browser_specific_settings: {
      gecko: {
        id: geckoId,
        strict_min_version: '109.0',
      },
    },
    // Convert service_worker to background scripts
    background: {
      scripts: [chrome.background.service_worker],
      persistent: false,
    },
    content_scripts: chrome.content_scripts,
    // Convert action to browser_action
    browser_action: chrome.action
      ? {
          default_popup: chrome.action.default_popup,
          default_icon: chrome.action.default_icon,
          default_title: chrome.action.default_title,
        }
      : undefined,
    options_ui: chrome.options_ui,
    icons: chrome.icons,
    // Convert CSP object to string
    content_security_policy: chrome.content_security_policy
      ? chrome.content_security_policy.extension_pages
      : undefined,
  };

  // Remove undefined properties
  return JSON.parse(JSON.stringify(firefox));
}

/**
 * Transform Firefox MV2 manifest to Chrome MV3 format
 */
function firefoxToChrome(firefox: FirefoxManifest): ChromeManifest {
  // Separate host permissions from regular permissions
  const hostPermissionPatterns = /^(\*|https?):\/\//;
  const hostPermissions: string[] = [];
  const regularPermissions: string[] = [];

  firefox.permissions.forEach((perm) => {
    if (hostPermissionPatterns.test(perm)) {
      hostPermissions.push(perm);
    } else {
      regularPermissions.push(perm);
    }
  });

  const chrome: ChromeManifest = {
    manifest_version: 3,
    name: firefox.name,
    version: firefox.version,
    description: firefox.description,
    default_locale: firefox.default_locale,
    permissions: regularPermissions,
    host_permissions: hostPermissions.length > 0 ? hostPermissions : undefined,
    // Convert background scripts to service_worker
    background: {
      service_worker: firefox.background.scripts[0],
      type: 'module',
    },
    content_scripts: firefox.content_scripts,
    // Convert browser_action to action
    action: firefox.browser_action
      ? {
          default_popup: firefox.browser_action.default_popup,
          default_icon: firefox.browser_action.default_icon,
          default_title: firefox.browser_action.default_title,
        }
      : undefined,
    options_ui: firefox.options_ui,
    icons: firefox.icons,
    // Convert CSP string to object
    content_security_policy: firefox.content_security_policy
      ? { extension_pages: firefox.content_security_policy }
      : undefined,
  };

  // Remove undefined properties
  return JSON.parse(JSON.stringify(chrome));
}

/**
 * Load manifest from file
 */
function loadManifest<T>(path: string): T {
  if (!existsSync(path)) {
    throw new Error(`Manifest file not found: ${path}`);
  }
  const content = readFileSync(path, 'utf-8');
  return JSON.parse(content) as T;
}

/**
 * Save manifest to file
 */
function saveManifest<T>(path: string, manifest: T): void {
  const content = JSON.stringify(manifest, null, 2) + '\n';
  writeFileSync(path, content, 'utf-8');
  console.log(`Manifest saved to: ${path}`);
}

/**
 * Get manifest for specified browser
 */
export function getManifestForBrowser(browser: 'chrome' | 'firefox'): ChromeManifest | FirefoxManifest {
  const chromePath = resolve(rootDir, 'manifest.json');
  const firefoxPath = resolve(rootDir, 'manifest.firefox.json');

  if (browser === 'chrome') {
    return loadManifest<ChromeManifest>(chromePath);
  } else {
    // Use Firefox-specific manifest if it exists
    if (existsSync(firefoxPath)) {
      return loadManifest<FirefoxManifest>(firefoxPath);
    }
    // Otherwise, transform Chrome manifest
    const chrome = loadManifest<ChromeManifest>(chromePath);
    return chromeToFirefox(chrome, 'shortshield@example.com');
  }
}

/**
 * CLI interface
 */
function main(): void {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'to-firefox': {
      const chromePath = resolve(rootDir, 'manifest.json');
      const firefoxPath = resolve(rootDir, 'manifest.firefox.json');
      const geckoId = args[1] || 'shortshield@example.com';

      const chrome = loadManifest<ChromeManifest>(chromePath);
      const firefox = chromeToFirefox(chrome, geckoId);
      saveManifest(firefoxPath, firefox);
      console.log('Chrome MV3 -> Firefox MV2 transformation complete');
      break;
    }

    case 'to-chrome': {
      const firefoxPath = resolve(rootDir, 'manifest.firefox.json');
      const chromePath = resolve(rootDir, 'manifest.json');

      const firefox = loadManifest<FirefoxManifest>(firefoxPath);
      const chrome = firefoxToChrome(firefox);
      saveManifest(chromePath, chrome);
      console.log('Firefox MV2 -> Chrome MV3 transformation complete');
      break;
    }

    case 'validate': {
      const browser = args[1] as 'chrome' | 'firefox';
      if (!browser || !['chrome', 'firefox'].includes(browser)) {
        console.error('Usage: manifest-transform validate <chrome|firefox>');
        process.exit(1);
      }

      try {
        const manifest = getManifestForBrowser(browser);
        console.log(`${browser} manifest is valid:`);
        console.log(JSON.stringify(manifest, null, 2));
      } catch (error) {
        console.error(`Invalid ${browser} manifest:`, error);
        process.exit(1);
      }
      break;
    }

    case 'sync': {
      // Sync Firefox manifest with Chrome manifest
      const chromePath = resolve(rootDir, 'manifest.json');
      const firefoxPath = resolve(rootDir, 'manifest.firefox.json');

      if (!existsSync(firefoxPath)) {
        console.log('Firefox manifest does not exist, creating from Chrome manifest...');
        const chrome = loadManifest<ChromeManifest>(chromePath);
        const firefox = chromeToFirefox(chrome, 'shortshield@example.com');
        saveManifest(firefoxPath, firefox);
      } else {
        // Update version and other synced fields
        const chrome = loadManifest<ChromeManifest>(chromePath);
        const firefox = loadManifest<FirefoxManifest>(firefoxPath);

        // Sync fields
        firefox.version = chrome.version;
        firefox.name = chrome.name;
        firefox.description = chrome.description;
        firefox.default_locale = chrome.default_locale;

        saveManifest(firefoxPath, firefox);
        console.log('Firefox manifest synced with Chrome manifest');
      }
      break;
    }

    default:
      console.log(`
Manifest Transform Tool

Usage:
  pnpm manifest:to-firefox [gecko-id]  Convert Chrome MV3 to Firefox MV2
  pnpm manifest:to-chrome              Convert Firefox MV2 to Chrome MV3
  pnpm manifest:validate <browser>     Validate manifest for browser
  pnpm manifest:sync                   Sync Firefox manifest with Chrome

Examples:
  pnpm manifest:to-firefox shortshield@example.com
  pnpm manifest:validate chrome
  pnpm manifest:sync
      `);
  }
}

// Run CLI if executed directly
if (import.meta.url === `file://${process.argv[1]}`.replace(/\\/g, '/')) {
  main();
}

export { chromeToFirefox, firefoxToChrome, loadManifest, saveManifest };
