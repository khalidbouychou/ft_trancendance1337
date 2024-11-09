import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  mode: 'production',
  cacheDir: '.vite-cache',
  plugins: [react()],
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react'],
          reactDom: ['react-dom']
        }
      }
    }
  }
})