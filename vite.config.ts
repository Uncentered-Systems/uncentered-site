import { defineConfig } from 'vite'
import UnoCSS from 'unocss/vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    UnoCSS(),
    react(),
  ],
  server: {
    proxy: {
      '/api': {
        target: (import.meta as any).IS_PROD ? 'https://localhost:8081' : 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  }
})
