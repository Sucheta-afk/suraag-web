import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __APP_BUILD_ID__: JSON.stringify(process.env.VERCEL_GIT_COMMIT_SHA || 'local')
  },
  server: {
    port: 3000,
    open: false
  }
})
