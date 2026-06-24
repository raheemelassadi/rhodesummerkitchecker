import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/rhode': {
        target: 'https://www.rhodeskin.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/rhode/, ''),
      },
    },
  },
})