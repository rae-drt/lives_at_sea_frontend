import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import eslint from 'vite-plugin-eslint'

// https://vite.dev/config/
export default defineConfig({
  build: {
    outDir: 'build',
  },
  plugins: [react(), eslint()],
})
