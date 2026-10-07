import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'favicon.svg'],
      strategies: 'generateSW',
      manifest: {
        name: 'بوشهر کالا',
        short_name: 'بوشهرکالا',
        description: 'فروشگاه لوازم جانبی دیجیتال',
        scope: './',
        start_url: './',
        theme_color: '#DC2626',
        background_color: '#0F172A',
        display: 'standalone',
        orientation: 'portrait',
        lang: 'fa',
        dir: 'rtl',
        icons: [
          { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
          { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
        ],
      },
      workbox: {
        mode: 'development',
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
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
