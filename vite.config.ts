import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import { resolve } from 'path';
import { existsSync, readFileSync } from 'fs';

// Determine target browser from environment
const browser = (
  process.env.BROWSER !== undefined && process.env.BROWSER !== ''
    ? process.env.BROWSER
    : 'chrome'
) as 'chrome' | 'firefox' | 'edge';

/**
 * Manifest type for crx plugin
 */
type CrxManifest = chrome.runtime.ManifestV3;

/**
 * Load manifest (Manifest V3 for all browsers)
 * Firefox uses a separate manifest due to browser-specific requirements
 */
function loadManifest(): CrxManifest {
  const manifestFile = browser === 'firefox' ? 'manifest.firefox.json' : 'manifest.json';
  const manifestPath = resolve(__dirname, manifestFile);

  if (!existsSync(manifestPath)) {
    throw new Error(`Manifest not found: ${manifestPath}`);
  }

  const content = readFileSync(manifestPath, 'utf-8');
  return JSON.parse(content) as CrxManifest;
}

const manifest = loadManifest();

export default defineConfig({
  base: './',
  plugins: [
    react(),
    crx({
      // @ts-expect-error - CRXJS types are more permissive than Chrome types
      manifest,
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@/shared': resolve(__dirname, 'src/shared'),
      '@/background': resolve(__dirname, 'src/background'),
      '@/content': resolve(__dirname, 'src/content'),
      '@/popup': resolve(__dirname, 'src/popup'),
      '@/options': resolve(__dirname, 'src/options'),
    },
  },
  build: {
    outDir: `dist/${browser}`,
    emptyOutDir: true,
    sourcemap: process.env.NODE_ENV === 'development',
    rollupOptions: {
      output: {
        // Use chunking for better CSP compliance
        manualChunks: undefined,
      },
    },
    // Minimize for production
    minify: process.env.NODE_ENV === 'production' ? 'esbuild' : false,
  },
  // Development server configuration
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
  },
  // Define environment variables
  define: {
    __BROWSER__: JSON.stringify(browser),
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
  },
});
