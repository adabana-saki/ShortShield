import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import { resolve } from 'path';
import manifest from './manifest.json';

const browser = process.env.BROWSER || 'chrome';

export default defineConfig({
  plugins: [
    react(),
    crx({ manifest }),
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
