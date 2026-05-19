import { describe, expect, it, beforeEach, vi } from 'vitest';
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
