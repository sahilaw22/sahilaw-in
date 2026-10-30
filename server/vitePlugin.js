import express from 'express';
import apiRouter from './api.js';

export function portfolioAssistantVitePlugin() {
  return {
    name: 'portfolio-assistant-api-plugin',
    configureServer(server) {
      const app = express();
      app.use(express.json());
      app.use(apiRouter);

      server.middlewares.use('/api', app);
    },
  };
}

