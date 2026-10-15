import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,onnx,json,yaml}'],
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
    })
  ]
});
