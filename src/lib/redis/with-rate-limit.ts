'use server';

import { createError } from '../errors';
import { getRateLimiter } from './rate-limit';
import type { RateLimitType } from './types';

export async function withRateLimit(key: string, type: RateLimitType): Promise<boolean> {
  let success = false;

  try {
    const limiter = getRateLimiter(type);
    ({ success } = await limiter.limit(key));
  } catch {
    throw createError('INTERNAL_ERROR', 'Servicio temporalmente no disponible');
  }

  if (!success) {
    throw createError('RATE_LIMIT');
  }

  return success;
}
