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
    if(mode === 'test') {
      return {
        plugins: [react()],
        test: {
          environment: 'jsdom',
          globals: true,
          setupFiles: './src/setupTests.js',
          include: ['src/*.{test,spec}.?(c|m)[jt]s?(x)'],
          pool: 'vmThreads',
        },
      }
    }
    else if(mode === 'development') {
      return {
        plugins: [react(), eslint()],
      }
    }
  }
  throw Error('Check vite.config.js.\n       Command:' + command + '\n       Mode: ' + mode);
})
