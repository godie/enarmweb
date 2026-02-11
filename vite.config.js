import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    https: false
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@materializecss-css": path.resolve(__dirname, "node_modules/@materializecss/materialize/dist/css/materialize.min.css"),
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './src/setupTests.js',
    css: true,
  },
})
