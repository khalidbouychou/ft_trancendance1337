// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false,
  },
  // Hide source map warnings and other development warnings
  server: {
    hmr: {
      overlay: false  // Disable the error overlay
    }
  },
  // Custom configuration to suppress source map warnings
  optimizeDeps: {
    exclude: ['@react-devtools-backend/compact'], // Exclude problematic dependencies
  },
  // Suppress Vite-specific warnings
  logger: {
    level: 'error', // Only show errors, not warnings
  },
  css: {
    devSourcemap: false, // Disable CSS source maps
  }
})