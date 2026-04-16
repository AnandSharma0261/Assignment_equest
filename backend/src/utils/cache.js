import { getRedis } from '../config/redis.js';

const PREFIX = 'jb:';
export const keys = {
  jobsList: (qs) => `${PREFIX}jobs:list:${qs || 'all'}`,
  jobsListPattern: () => `${PREFIX}jobs:list:*`,
  jobDetail: (id) => `${PREFIX}jobs:detail:${id}`,
};

async function safe(fn, fallback) {
  try { return await fn(); } catch (err) {
    console.warn('[cache] skipped:', err.message);
    return fallback;
  }
}

export async function cacheGetJSON(key) {
  return safe(async () => {
    const raw = await getRedis().get(key);
    return raw ? JSON.parse(raw) : null;
  }, null);
}

export async function cacheSetJSON(key, value, ttlSeconds) {
  return safe(async () => {
    await getRedis().set(key, JSON.stringify(value), 'EX', ttlSeconds);
    return true;
  }, false);
}

export async function cacheDel(key) {
  return safe(async () => {
    await getRedis().del(key);
    return true;
  }, false);
}

export async function cacheDelByPattern(pattern) {
  return safe(async () => {
    const redis = getRedis();
    const stream = redis.scanStream({ match: pattern, count: 100 });
    const pipeline = redis.pipeline();
    let count = 0;
    for await (const batch of stream) {
      for (const k of batch) { pipeline.del(k); count++; }
    }
    if (count > 0) await pipeline.exec();
    return count;
  }, 0);
}
