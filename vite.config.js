import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { portfolioAssistantVitePlugin } from './server/vitePlugin.js';

export default defineConfig({
  plugins: [react(), portfolioAssistantVitePlugin()],
  base: './',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three')) return 'vendor-three';
            if (id.includes('gsap')) return 'vendor-gsap';
            if (id.includes('jszip')) return 'vendor-jszip';
            return 'vendor';
          }
        },
      },
    },
  },
});
