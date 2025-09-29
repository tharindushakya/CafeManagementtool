import Redis from 'ioredis';

export function createRedisClient(url?: string) {
  const redisUrl = url || process.env.REDIS_URL || 'redis://localhost:6379';
  return new Redis(redisUrl);
}
