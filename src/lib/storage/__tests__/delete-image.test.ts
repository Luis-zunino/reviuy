import { describe, expect, it, beforeEach, vi } from 'vitest';

const mockSend = vi.fn();
const mockGetR2Client = vi.fn(() => ({ send: mockSend }));

vi.mock('../r2.client', () => ({
  getR2Client: mockGetR2Client,
}));

vi.mock('@aws-sdk/client-s3', () => ({
  DeleteObjectCommand: vi.fn(),
}));

describe('deleteImage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.R2_BUCKET_NAME;
  });

  it('throws when R2_BUCKET_NAME is not configured', async () => {
    const { deleteImage } = await import('../delete-image');

    await expect(deleteImage('test.jpg')).rejects.toThrow('R2 no está configurado');
  });

  it('sends delete command with correct path', async () => {
    process.env.R2_BUCKET_NAME = 'test-bucket';
    mockSend.mockResolvedValueOnce({});

    const { deleteImage } = await import('../delete-image');

    await deleteImage('images/to-delete.jpg');

    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockGetR2Client).toHaveBeenCalledTimes(1);
  });
});
