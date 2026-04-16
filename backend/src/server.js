import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { connectDB } from './config/db.js';
import { getRedis } from './config/redis.js';

import authRoutes from './routes/auth.routes.js';
import jobRoutes from './routes/job.routes.js';
import applicationRoutes from './routes/application.routes.js';

import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN?.split(',').map((s) => s.trim()) || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 5000;

async function start() {
  await connectDB(process.env.MONGO_URI);
  getRedis();
  app.listen(PORT, () => console.log(`[api] listening on :${PORT}`));
}

start().catch((err) => {
  console.error('[fatal]', err);
  process.exit(1);
});
