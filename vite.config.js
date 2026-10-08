import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.png', 'favicon.svg'],
      strategies: 'generateSW',
      manifest: {
        name: 'کافه ترشی',
        short_name: 'کافه ترشی',
        description: 'ترشیجات خانگی، خیارشور، زیتون و محصولات شور',
        scope: './',
        start_url: './',
        theme_color: '#2E7D32',
        background_color: '#FFF8E8',
        display: 'standalone',
        orientation: 'portrait',
        lang: 'fa',
        dir: 'rtl',
        icons: [
          { src: 'icon.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icon.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icon.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        mode: 'development',
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
        sourcemap: false,
        inlineWorkboxRuntime: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
    }),
  ],
  base: './',
  build: {
    outDir: 'docs',
    emptyOutDir: true,
  },
})
