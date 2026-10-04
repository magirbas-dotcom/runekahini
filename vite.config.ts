import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      // 'prompt' rather than 'autoUpdate': a new build waits instead of
      // swapping itself in, so ReloadPrompt can ask before reloading. With
      // autoUpdate a returning visitor kept seeing the previous version until
      // their second launch, with no way to know an update existed.
      registerType: 'prompt',
      // Registration is handled by virtual:pwa-register/react in
      // ReloadPrompt, so the plugin must not also inject its own script.
      injectRegister: null,
      includeAssets: ['icons/favicon-32.png', 'icons/apple-touch-icon.png'],
      workbox: {
        // The default precache list is js/css/html only, which left the realm
        // photos and stone images to the network — a reading opened offline
        // showed bare cards. WebP covers all of them (~2 MB in total).
        globPatterns: ['**/*.{js,css,html,svg,png,webp,woff2}'],
        // The service worker answers every navigation with the app shell; the
        // static legal/support pages are real pages and must be let through,
        // or opening askrune.app/gizlilik from the installed app shows the app.
        navigateFallbackDenylist: [/^\/(gizlilik|privacy|destek|support|kosullar|terms)(\/|$)/],
      },
      manifest: {
        name: 'Rune Kahini',
        short_name: 'Rune Kahini',
        description:
          "Elder Futhark Rune okuması, Doğum Rune'si hesaplayıcısı ve tılsım tasarımcısı.",
        theme_color: '#0c0a09',
        background_color: '#0c0a09',
        display: 'standalone',
        // Portrait only. Android honours this for the installed app; iOS ignores
        // it, so RotateNotice covers landscape there.
        orientation: 'portrait',
        start_url: '/',
        lang: 'tr',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            // Separate maskable art: the medallion sits inside the 80% safe
            // circle, so Android's circle/squircle crop never cuts into it.
            src: '/icons/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
})
