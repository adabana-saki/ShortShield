import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import { resolve } from 'path';
import { existsSync, readFileSync } from 'fs';

// Determine target browser from environment
const browser = (process.env.BROWSER || 'chrome') as 'chrome' | 'firefox';

/**
 * Load manifest based on target browser
 * Chrome: Uses MV3 manifest.json
 * Firefox: Uses MV2 manifest.firefox.json
 */
function loadManifest() {
  const manifestPath = browser === 'firefox'
    ? resolve(__dirname, 'manifest.firefox.json')
    : resolve(__dirname, 'manifest.json');

  if (!existsSync(manifestPath)) {
    throw new Error(`Manifest not found: ${manifestPath}`);
  }

  const content = readFileSync(manifestPath, 'utf-8');
  return JSON.parse(content);
}

const manifest = loadManifest();

export default defineConfig({
  plugins: [
    react(),
    crx({
      manifest,
      // Firefox-specific options
      ...(browser === 'firefox' && {
        browser: 'firefox',
      }),
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
        // Prevent inline scripts for CSP compliance
        inlineDynamicImport: false,
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
