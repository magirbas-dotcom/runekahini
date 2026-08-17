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
      manifest: {
        name: 'Rune Kahini',
        short_name: 'Rune Kahini',
        description:
          "Elder Futhark Rune okuması, Doğum Rune'si hesaplayıcısı ve tılsım tasarımcısı.",
        theme_color: '#0c0a09',
        background_color: '#0c0a09',
        display: 'standalone',
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
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
})
