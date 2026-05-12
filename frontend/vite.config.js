import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { compression } from 'vite-plugin-compression2'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    compression({ algorithm: 'gzip', threshold: 1024 }),
    compression({ algorithm: 'brotliCompress', threshold: 1024 }),
  ],
  server: {
    port: 5173,
    open: true,
    allowedHosts: ['katrina-reverse-cheque-shift.trycloudflare.com'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          leaflet: ['leaflet', 'react-leaflet'],
          charts: ['recharts'],
          mui: ['@mui/material', '@emotion/react', '@emotion/styled'],
          i18n: ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
        },
      },
    },
  },
})
