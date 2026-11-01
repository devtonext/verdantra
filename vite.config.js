import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/src/admin/')) {
            return 'admin';
          }
          if (id.includes('@supabase/supabase-js')) {
            return 'supabase';
          }
        }
      }
    }
  }
});
