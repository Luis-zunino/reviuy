import { createError } from '../errors';
import { getRateLimiter, isRedisConfigured } from './rate-limit';
import type { RateLimitType } from './types';

// Scopes que protegen contra abuso (login, reportes): si Redis falla se bloquea
// la request (fail-closed). Una caída de Redis no debe desactivar estos límites.
const FAIL_CLOSED_TYPES: ReadonlySet<RateLimitType> = new Set([
  'sensitive',
  'auth_email',
  'auth_oauth',
  'auth_refresh',
]);

export async function withRateLimit(key: string, type: RateLimitType): Promise<boolean> {
  // Skip rate limiting if Redis is not configured (development/preview environments)
  if (!isRedisConfigured()) {
    return true;
  }

  let success: boolean;

  try {
    const limiter = getRateLimiter(type);
    ({ success } = await limiter.limit(key));
  } catch {
    if (FAIL_CLOSED_TYPES.has(type)) {
      console.error(`[RateLimit] Redis unavailable, blocking "${type}" request (fail-closed)`);
      throw createError('RATE_LIMIT');
    }

    // Scopes de uso normal (vote, write): permitir para no bloquear a los usuarios
    // por un problema de infraestructura. La base aplica su propio rate limit.
    console.warn('[RateLimit] Redis unavailable, allowing request');
    return true;
  }

  if (!success) {
    throw createError('RATE_LIMIT');
  }

  return success;
}
