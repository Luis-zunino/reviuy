import { rateLimiters } from './rate-limit';
import type { RateLimitType } from './types';

export async function withRateLimit(key: string, type: RateLimitType) {
  const limiter = rateLimiters[type];
  const { success } = await limiter.limit(key);

  return success;
}
