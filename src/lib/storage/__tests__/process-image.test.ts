import { describe, expect, it, vi, beforeEach } from 'vitest';

const mockSharpInstance = {
  rotate: vi.fn().mockReturnThis(),
  resize: vi.fn().mockReturnThis(),
  webp: vi.fn().mockReturnThis(),
  toBuffer: vi.fn().mockResolvedValue(Buffer.from('processed-image-data')),
};

const mockSharp = vi.fn(() => mockSharpInstance);

vi.mock('sharp', () => ({
  default: mockSharp,
}));

vi.mock('server-only', () => ({}));

describe('processImageForUpload', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('processes image to webp with default options', async () => {
    const { processImageForUpload } = await import('../process-image');

    const result = await processImageForUpload({
      buffer: Buffer.from('original-image'),
      filename: 'photo.jpg',
    });

    expect(mockSharp).toHaveBeenCalledWith(Buffer.from('original-image'));
    expect(mockSharpInstance.rotate).toHaveBeenCalled();
    expect(mockSharpInstance.resize).toHaveBeenCalledWith({
      width: 2560,
      height: 2560,
      fit: 'inside',
      withoutEnlargement: true,
    });
    expect(mockSharpInstance.webp).toHaveBeenCalledWith({
      quality: 85,
      effort: 5,
    });
    expect(result).toEqual({
      buffer: Buffer.from('processed-image-data'),
      filename: 'photo.webp',
      contentType: 'image/webp',
    });
  });

  it('uses custom maxWidth and quality when provided', async () => {
    const { processImageForUpload } = await import('../process-image');

    await processImageForUpload({
      buffer: Buffer.from('image'),
      filename: 'test.jpg',
      maxWidth: 1920,
      quality: 70,
    });

    expect(mockSharpInstance.resize).toHaveBeenCalledWith({
      width: 1920,
      height: 1920,
      fit: 'inside',
      withoutEnlargement: true,
    });
    expect(mockSharpInstance.webp).toHaveBeenCalledWith({
      quality: 70,
      effort: 5,
    });
  });

  it('sanitizes filename by removing extension and special chars', async () => {
    const { processImageForUpload } = await import('../process-image');

    const result1 = await processImageForUpload({
      buffer: Buffer.from('img'),
      filename: 'héllo wôrld!.jpg',
    });
    expect(result1.filename).toBe('h-llo-w-rld-.webp');

    const result2 = await processImageForUpload({
      buffer: Buffer.from('img'),
      filename: 'image.name.with.dots.jpg',
    });
    expect(result2.filename).toBe('image-name-with-dots.webp');
  });
});
