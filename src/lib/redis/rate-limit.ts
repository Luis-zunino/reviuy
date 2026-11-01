import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import type { RateLimitType } from './types';

export function isRedisConfigured(): boolean {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  return Boolean(redisUrl && redisToken && redisUrl !== 'your_redis_url_here');
}

let rateLimitersCache: Record<RateLimitType, Ratelimit> | null = null;

function buildRateLimiters(): Record<RateLimitType, Ratelimit> {
  const redis = Redis.fromEnv();

  return {
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

    auth_email: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '1 m'),
    }),

    auth_oauth: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '1 m'),
    }),

    auth_refresh: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(30, '5 m'),
    }),
  };
}

export function getRateLimiter(type: RateLimitType): Ratelimit {
  if (!isRedisConfigured()) {
    throw new Error('Upstash Redis credentials are not configured');
  }

  if (!rateLimitersCache) {
    rateLimitersCache = buildRateLimiters();
  }

  return rateLimitersCache[type];
}
