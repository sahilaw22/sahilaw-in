import express from 'express';
import cors from 'cors';
import apiRouter from '../server/api.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Mount API router for both prefixed and un-prefixed Vercel serverless invocations
app.use('/api', apiRouter);
app.use('/', apiRouter);

export default app;

