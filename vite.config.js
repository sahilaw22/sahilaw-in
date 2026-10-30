import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { portfolioAssistantVitePlugin } from './server/vitePlugin.js';

export default defineConfig({
  plugins: [react(), portfolioAssistantVitePlugin()],
  base: './',
});
