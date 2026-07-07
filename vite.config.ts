import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // Dev: proxy the personalization API to the backend (server/). In prod nginx
  // proxies /api → the Node service, so the frontend always calls /api relative.
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_TARGET || 'http://localhost:8787',
        changeOrigin: true,
      },
      // Dev parity for the Selected Work grid: the app calls the same-origin
      // /directus path in prod (nginx → Directus container). Locally, forward it
      // to the deployed Directus so the grid shows real CMS images.
      '/directus': {
        target: process.env.VITE_DIRECTUS_TARGET || 'https://darlingdesign.pro',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
