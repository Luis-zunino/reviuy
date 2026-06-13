import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

const mockRedis = vi.hoisted(() => ({}));
const mockRedisFromEnv = vi.hoisted(() => vi.fn().mockReturnValue(mockRedis));

const mockRatelimitCtor: any = vi.hoisted(() => {
  const ctor: any = vi.fn(function () {
    return {};
  });
  ctor.slidingWindow = vi.fn(() => ({}));
  return ctor;
});

vi.mock('@upstash/redis', () => ({
  Redis: { fromEnv: mockRedisFromEnv },
}));

vi.mock('@upstash/ratelimit', () => ({
  Ratelimit: mockRatelimitCtor,
}));

import { isRedisConfigured } from '../rate-limit';

describe('isRedisConfigured', () => {
  beforeEach(() => {
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
  });

  it('returns false when both env vars are missing', () => {
    expect(isRedisConfigured()).toBe(false);
  });

  it('returns false when only URL is set', () => {
    process.env.UPSTASH_REDIS_REST_URL = 'https://test.redis.com';
    expect(isRedisConfigured()).toBe(false);
  });

  it('returns false when only token is set', () => {
    process.env.UPSTASH_REDIS_REST_TOKEN = 'token';
    expect(isRedisConfigured()).toBe(false);
  });

  it('returns false when URL equals placeholder value', () => {
    process.env.UPSTASH_REDIS_REST_URL = 'your_redis_url_here';
    process.env.UPSTASH_REDIS_REST_TOKEN = 'token';
    expect(isRedisConfigured()).toBe(false);
  });

  it('returns true when both env vars are set with real values', () => {
    process.env.UPSTASH_REDIS_REST_URL = 'https://test.redis.com';
    process.env.UPSTASH_REDIS_REST_TOKEN = 'valid-token';
    expect(isRedisConfigured()).toBe(true);
  });
});

describe('getRateLimiter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    process.env.UPSTASH_REDIS_REST_URL = 'https://test.redis.com';
    process.env.UPSTASH_REDIS_REST_TOKEN = 'valid-token';
  });

  afterEach(() => {
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
  });

  it('builds limiters on first call and caches subsequent', async () => {
    const { getRateLimiter } = await import('../rate-limit');

    const vote = getRateLimiter('vote');
    expect(vote).toBeDefined();
    expect(mockRedisFromEnv).toHaveBeenCalledTimes(1);
    expect(mockRatelimitCtor).toHaveBeenCalledTimes(3);

    vi.clearAllMocks();

    const vote2 = getRateLimiter('vote');
    expect(vote2).toBe(vote);
    expect(mockRedisFromEnv).not.toHaveBeenCalled();
    expect(mockRatelimitCtor).not.toHaveBeenCalled();
  });

  it('returns different limiter instances per type', async () => {
    const { getRateLimiter } = await import('../rate-limit');

    const vote = getRateLimiter('vote');
    const write = getRateLimiter('write');

    expect(vote).toBeDefined();
    expect(write).toBeDefined();
    expect(mockRatelimitCtor).toHaveBeenCalledTimes(3);
  });

  it('throws when Redis is not configured', async () => {
    delete process.env.UPSTASH_REDIS_REST_URL;
    const { getRateLimiter } = await import('../rate-limit');

    expect(() => getRateLimiter('vote')).toThrow('Upstash Redis credentials are not configured');
  });
});
