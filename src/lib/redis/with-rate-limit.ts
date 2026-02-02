'use server';

import { createError } from '../errors';
import { rateLimiters } from './rate-limit';
import type { RateLimitType } from './types';

export async function withRateLimit(key: string, type: RateLimitType): Promise<boolean> {
  const limiter = rateLimiters[type];

  if (!limiter) {
    throw createError('RATE_LIMIT');
  }

  const { success } = await limiter.limit(key);

  return success;
}
