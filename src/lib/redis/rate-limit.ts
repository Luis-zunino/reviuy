import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Validar que las credenciales de Redis estén configuradas
if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error(
    '❌ Missing Upstash Redis credentials!\n\n' +
      'Please configure in .env.local:\n' +
      '  UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io\n' +
      '  UPSTASH_REDIS_REST_TOKEN=your_token_here\n\n' +
      'Get your credentials at: https://console.upstash.com/'
  );
}

if (process.env.UPSTASH_REDIS_REST_URL === 'your_redis_url_here') {
  throw new Error(
    '❌ Upstash Redis not configured!\n\n' +
      'Please replace placeholder values in .env.local with real credentials.\n' +
      'Visit: https://console.upstash.com/ to create a Redis database.'
  );
}

const redis = Redis.fromEnv();

export const rateLimiters = {
  vote: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '10 s'),
  }),

  write: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '10 s'),
  }),

  sensitive: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, '1 h'),
  }),
};
