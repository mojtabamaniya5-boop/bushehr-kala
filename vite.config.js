import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'docs'
    // NOTE: no manualChunks — splitting vendor by name created a circular
    // chunk dependency (react-dom <-> scheduler) that crashed the app with
    // "Cannot read properties of undefined (reading 'createContext')" on
    // some browsers. Rollup's default chunking keeps evaluation order safe.
  }
})
