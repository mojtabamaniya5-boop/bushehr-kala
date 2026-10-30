import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'docs',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-router')) return 'vendor-router';
            if (id.includes('lucide-react')) return 'vendor-icons';
            if (id.includes('supabase')) return 'vendor-supabase';
            if (id.includes('react')) return 'vendor-react';
            return 'vendor'; // بقیه پکیج‌ها
          }
        }
      }
    }
  }
})
