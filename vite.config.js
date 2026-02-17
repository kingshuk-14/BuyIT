import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/huggingface': {
        target: 'https://router.huggingface.co/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/huggingface/, '')
      },
      '/api/groq': {
        target: 'https://api.groq.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/groq/, '')
      },
      '/api/together': {
        target: 'https://api.together.xyz',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/together/, '')
      },
      '/api/openai': {
        target: 'https://api.openai.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/openai/, '')
      },
      '/api/google': {
        target: 'https://generativelanguage.googleapis.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/google/, '')
      }
    }
  }
})
