// vite.config.js
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    
    build: {
      sourcemap: false,
      // Reduce console output during build
      reportCompressedSize: false,
      minify: 'terser',
      terserOptions: {
        format: {
          // Remove console.logs in production
          comments: false,
        },
      },
    },
    
    server: {
      hmr: {
        overlay: false
      },
      // Suppress WebSocket connection warnings
      cors: false,
      // Quiet mode for development server
      quiet: true
    },
    
    css: {
      devSourcemap: false,
    },
    
    optimizeDeps: {
      exclude: ['@react-devtools-backend/compact'],
    },
    
    // Custom logger configuration
    logger: {
      level: env.VITE_DISABLE_WARNINGS ? 'error' : 'info',
      clearScreen: false,
    },
    
    // Esbuild configuration
    esbuild: {
      pure: ['console.log', 'console.info', 'console.debug', 'console.warn'],
      legalComments: 'none',
    }
  }
})