'use server';

import { createError } from '../errors';
import { getRateLimiter, isRedisConfigured } from './rate-limit';
import type { RateLimitType } from './types';

export async function withRateLimit(key: string, type: RateLimitType): Promise<boolean> {
  // Skip rate limiting if Redis is not configured (development/preview environments)
  if (!isRedisConfigured()) {
    return true;
  }

  let success = false;

  try {
    const limiter = getRateLimiter(type);
    ({ success } = await limiter.limit(key));
  } catch {
    // If rate limiting fails, allow the request to proceed
    // This prevents blocking users due to infrastructure issues
    console.warn('[RateLimit] Redis unavailable, allowing request');
    return true;
  }

  if (!success) {
    throw createError('RATE_LIMIT');
  }

  return success;
}
