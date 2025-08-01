import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import eslint from 'vite-plugin-eslint'
import { fileURLToPath, URL } from 'url'

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
          //globals: true,
          setupFiles: './src/test/config/setupTests.js',
          include: ['src/test/*.?(c|m)[jt]s?(x)'],
          pool: 'vmThreads',
        },
        resolve: {
          alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
          },
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
