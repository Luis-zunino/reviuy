import { describe, expect, it, beforeEach, vi } from 'vitest';

const { mockS3Client } = vi.hoisted(() => ({
  mockS3Client: vi.fn(),
}));

vi.mock('@aws-sdk/client-s3', () => ({
  S3Client: mockS3Client,
}));

describe('getR2Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    delete process.env.R2_ACCOUNT_ID;
    delete process.env.R2_ACCESS_KEY_ID;
    delete process.env.R2_SECRET_ACCESS_KEY;
  });

  it('throws when R2_ACCOUNT_ID is not configured', async () => {
    const { getR2Client } = await import('../r2.client');
    expect(() => getR2Client()).toThrow('R2 no está configurado');
  });

  it('creates S3Client with correct configuration', async () => {
    process.env.R2_ACCOUNT_ID = 'test-account';
    process.env.R2_ACCESS_KEY_ID = 'test-key';
    process.env.R2_SECRET_ACCESS_KEY = 'test-secret';

    const { getR2Client } = await import('../r2.client');

    const client = getR2Client();
    expect(client).toBeDefined();
    expect(mockS3Client).toHaveBeenCalledWith(
      expect.objectContaining({
        region: 'auto',
        endpoint: expect.stringContaining('test-account'),
      })
    );
  });

  it('returns cached client on subsequent calls', async () => {
    process.env.R2_ACCOUNT_ID = 'test-account';
    process.env.R2_ACCESS_KEY_ID = 'test-key';
    process.env.R2_SECRET_ACCESS_KEY = 'test-secret';

    const { getR2Client } = await import('../r2.client');

    const first = getR2Client();
    const second = getR2Client();

    expect(mockS3Client).toHaveBeenCalledTimes(1);
    expect(second).toBe(first);
  });
});
