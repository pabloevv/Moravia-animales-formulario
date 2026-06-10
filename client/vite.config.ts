import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Mobile-first SPA. Dev server proxies /api to the local Express backend
// so the frontend can fetch('/api/vote') with no CORS/host juggling.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
});
