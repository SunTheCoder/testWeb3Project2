import { defineConfig } from 'vite'
import eslintPlugin from 'vite-plugin-eslint'
import react from '@vitejs/plugin-react'
import jsconfigPaths from "vite-jsconfig-paths"


// https://vitejs.dev/config/
export default defineConfig((mode) => ({
  plugins: [
    react(),
    jsconfigPaths(),
    eslintPlugin({
      lintOnStart: true,
      failOnError: mode === 'production',
    }),
  ],
  server: {
    open: false,
    proxy: {
      '/api': 'http://backend:8000',
    },
    host: '0.0.0.0',
  },
}))
