import { describe, it, expect, vi, beforeEach } from 'vitest';

const limitMock = vi.fn();
const getRateLimiterMock = vi.fn(() => ({ limit: limitMock }));
const isRedisConfiguredMock = vi.fn();

vi.mock('./rate-limit', () => ({
  getRateLimiter: getRateLimiterMock,
  isRedisConfigured: isRedisConfiguredMock,
}));

describe('withRateLimit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns true when redis is not configured', async () => {
    isRedisConfiguredMock.mockReturnValue(false);
    const { withRateLimit } = await import('./with-rate-limit');

    await expect(withRateLimit('user-1', 'write')).resolves.toBe(true);
    expect(getRateLimiterMock).not.toHaveBeenCalled();
  });

  it('returns true when limiter throws (fail-open)', async () => {
    isRedisConfiguredMock.mockReturnValue(true);
    limitMock.mockRejectedValueOnce(new Error('redis down'));
    const { withRateLimit } = await import('./with-rate-limit');

    await expect(withRateLimit('user-1', 'write')).resolves.toBe(true);
  });

  it('throws RATE_LIMIT AppError when quota is exceeded', async () => {
    isRedisConfiguredMock.mockReturnValue(true);
    limitMock.mockResolvedValueOnce({ success: false });
    const { withRateLimit } = await import('./with-rate-limit');

    await expect(withRateLimit('user-1', 'write')).rejects.toMatchObject({
      code: 'RATE_LIMIT',
      statusCode: 429,
    });
  });

  it('returns true when limiter allows the request', async () => {
    isRedisConfiguredMock.mockReturnValue(true);
    limitMock.mockResolvedValueOnce({ success: true });
    const { withRateLimit } = await import('./with-rate-limit');

    await expect(withRateLimit('user-1', 'vote')).resolves.toBe(true);
  });
});
