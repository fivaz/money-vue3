import { sentryVitePlugin } from '@sentry/vite-plugin'
import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: 'Money',
        short_name: 'Money',
        description: 'A finance app',
        theme_color: 'rgb(255, 202, 40)',
        background_color: 'rgb(107, 75, 70)',
        display: 'standalone',
        start_url: '/',
        // Icons will be populated automatically by pwaAssets
      },
      pwaAssets: {
        // Define the source image for generating icons
        image: 'public/logo.svg', // Path to your source icon (e.g., a 512x512 PNG or SVG)
        // Optional: Customize asset generation
        preset: 'minimal-2023', // Use a preset for common icon sizes
        // You can also use a custom config instead of a preset if needed
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg}'], // Cache these file types
      },
    }),
    sentryVitePlugin({
      org: 'fivaz-lb',
      project: 'money',
    }),
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  build: {
    sourcemap: true,
  },
})
