import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API Endpoints
app.use('/api', apiRouter);

// Serve static frontend build from dist/
const distDir = path.resolve(__dirname, '../dist');
app.use(express.static(distDir));

// Handle client-side routing fallback
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Endpoint not found' });
  }
  res.sendFile(path.join(distDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Portfolio Assistant Server running on http://localhost:${PORT}`);
  console.log(`Admin Dashboard available at http://localhost:${PORT}/#/chatbot-response`);
});
