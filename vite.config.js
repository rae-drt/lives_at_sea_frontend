import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import eslint from 'vite-plugin-eslint'

// https://vite.dev/config/
export default defineConfig(({command, mode}) => {
  if(command === 'build' || mode === 'production') {
    return {
      build: {
        outDir: 'build',
      },
      plugins: [react()],
    }
  }
  else if(command === 'serve') {
    return {
      plugins: [react(), eslint()],
    }
  }
  else {
    throw Error('Check vite.config.js');
  }
})
