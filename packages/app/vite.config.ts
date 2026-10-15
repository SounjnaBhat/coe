import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';
import fs from 'fs';

function mirrorToRootDistPlugin() {
  return {
    name: 'mirror-to-root-dist',
    closeBundle() {
      try {
        const src = path.resolve(__dirname, 'dist');
        const dest = path.resolve(__dirname, '../../dist');
        if (fs.existsSync(src)) {
          fs.cpSync(src, dest, { recursive: true });
          console.log('[vite] Successfully mirrored packages/app/dist to root dist for Vercel');
        }
      } catch (e) {
        console.warn('[vite] Failed to mirror dist:', e);
      }
    }
  };
}

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,wasm}'],
        maximumFileSizeToCacheInBytes: 100 * 1024 * 1024
      },
      manifest: {
        name: 'Holamaatu',
        short_name: 'Holamaatu',
        description: 'Offline-first conversational maize advisory',
        theme_color: '#1a1a2e',
        icons: [
          {
            src: '/icon.png',
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      }
    }),
    mirrorToRootDistPlugin()
  ]
});
