import Redis from 'ioredis';

let client = null;

export function getRedis() {
  if (client) return client;
  const url = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
  client = new Redis(url, {
    lazyConnect: false,
    maxRetriesPerRequest: 2,
    enableOfflineQueue: false,
  });
  client.on('connect', () => console.log('[redis] connected'));
  client.on('error', (err) => console.error('[redis] error:', err.message));
  return client;
}
