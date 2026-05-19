import { describe, expect, it, beforeEach, vi } from 'vitest';

const mockSend = vi.fn();
const mockGetR2Client = vi.fn(() => ({ send: mockSend }));

vi.mock('../r2.client', () => ({
  getR2Client: mockGetR2Client,
}));

vi.mock('@aws-sdk/client-s3', () => ({
  PutObjectCommand: vi.fn(),
}));

describe('uploadImage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.R2_BUCKET_NAME;
    delete process.env.R2_PUBLIC_URL;
  });

  it('throws when R2_BUCKET_NAME is not configured', async () => {
    process.env.R2_PUBLIC_URL = 'https://cdn.example.com';
    const { uploadImage } = await import('../upload-image');

    await expect(
      uploadImage({ path: 'test.jpg', file: Buffer.from('data'), contentType: 'image/jpeg' })
    ).rejects.toThrow('R2 no está configurado');
  });

  it('throws when R2_PUBLIC_URL is not configured', async () => {
    process.env.R2_BUCKET_NAME = 'test-bucket';
    const { uploadImage } = await import('../upload-image');

    await expect(
      uploadImage({ path: 'test.jpg', file: Buffer.from('data'), contentType: 'image/jpeg' })
    ).rejects.toThrow('R2 no está configurado');
  });

  it('uploads image and returns url and path', async () => {
    process.env.R2_BUCKET_NAME = 'test-bucket';
    process.env.R2_PUBLIC_URL = 'https://cdn.example.com';

    mockSend.mockResolvedValueOnce({});

    const { uploadImage } = await import('../upload-image');

    const result = await uploadImage({
      path: 'images/test.jpg',
      file: Buffer.from('fake-image-data'),
      contentType: 'image/jpeg',
    });

    expect(result).toEqual({
      url: 'https://cdn.example.com/images/test.jpg',
      path: 'images/test.jpg',
    });

    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockGetR2Client).toHaveBeenCalledTimes(1);
  });

  it('normalizes public URL by removing trailing slash', async () => {
    process.env.R2_BUCKET_NAME = 'test-bucket';
    process.env.R2_PUBLIC_URL = 'https://cdn.example.com/';

    mockSend.mockResolvedValueOnce({});

    const { uploadImage } = await import('../upload-image');

    const result = await uploadImage({
      path: 'images/test.jpg',
      file: Buffer.from('data'),
      contentType: 'image/jpeg',
    });

    expect(result.url).toBe('https://cdn.example.com/images/test.jpg');
  });
});
