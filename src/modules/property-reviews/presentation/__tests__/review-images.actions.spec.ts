import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/auth/create-server-action-deps.util', () => ({
  createServerActionDeps: vi.fn(),
}));

const mockUpload = vi.hoisted(() => vi.fn());
const mockDelete = vi.hoisted(() => vi.fn());
const mockGetByReviewId = vi.hoisted(() => vi.fn());

vi.mock('../../infrastructure/repositories/supabase-review-image.repository', () => {
  function SupabaseReviewImageRepository() {
    return { upload: mockUpload, delete: mockDelete, getByReviewId: mockGetByReviewId };
  }
  return { SupabaseReviewImageRepository };
});

const mockProcessImageForUpload = vi.hoisted(() => vi.fn());

vi.mock('@/lib/storage', () => ({
  processImageForUpload: mockProcessImageForUpload,
}));

import { createServerActionDeps } from '@/shared/auth/create-server-action-deps.util';
import {
  uploadReviewImageAction,
  deleteReviewImageAction,
  getReviewImagesAction,
} from '../review-images.actions';

const mockDeps = (overrides = {}) => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null }),
    },
  },
  getCurrentUserId: vi.fn().mockResolvedValue('user-1'),
  rateLimit: vi.fn().mockResolvedValue(undefined),
  ...overrides,
});

function createMockFile(overrides: Partial<File> = {}): File {
  const blob = new Blob(['fake-image-buffer'], { type: overrides.type || 'image/jpeg' });
  return new File([blob], overrides.name || 'photo.jpg', {
    type: overrides.type || 'image/jpeg',
    lastModified: Date.now(),
  });
}

describe('uploadReviewImageAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (createServerActionDeps as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockDeps());
    mockProcessImageForUpload.mockResolvedValue({
      buffer: Buffer.from('processed'),
      filename: 'photo.webp',
      contentType: 'image/webp',
    });
    mockUpload.mockResolvedValue({ url: 'https://images.example.com/photo.webp' });
  });

  it('uploads an image when authenticated', async () => {
    const file = createMockFile();
    const formData = new FormData();
    formData.append('file', file);

    const result = await uploadReviewImageAction('review-1', 'osm-123', formData);

    expect(result).toEqual({ url: 'https://images.example.com/photo.webp' });
    expect(mockUpload).toHaveBeenCalledWith({
      reviewId: 'review-1',
      osmId: 'osm-123',
      file: expect.any(Buffer),
      filename: 'photo.webp',
      contentType: 'image/webp',
    });
  });

  it('throws UNAUTHORIZED when no user', async () => {
    (createServerActionDeps as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockDeps({
        supabase: { auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }) } },
      })
    );

    const formData = new FormData();
    formData.append('file', createMockFile());

    await expect(uploadReviewImageAction('review-1', 'osm-123', formData)).rejects.toThrow(
      'Debés iniciar sesión para subir imágenes.'
    );
    expect(mockUpload).not.toHaveBeenCalled();
  });

  it('throws INVALID_INPUT when no file in form data', async () => {
    const formData = new FormData();

    await expect(uploadReviewImageAction('review-1', 'osm-123', formData)).rejects.toThrow(
      'No se recibió ningún archivo.'
    );
    expect(mockUpload).not.toHaveBeenCalled();
  });

  it('throws INVALID_INPUT when file type is not allowed', async () => {
    const file = createMockFile({ type: 'image/gif' });
    const formData = new FormData();
    formData.append('file', file);

    await expect(uploadReviewImageAction('review-1', 'osm-123', formData)).rejects.toThrow(
      'Solo se permiten imágenes JPG, PNG o WebP.'
    );
    expect(mockUpload).not.toHaveBeenCalled();
  });

  it('throws INVALID_INPUT when file exceeds max input size', async () => {
    const hugeBuffer = new ArrayBuffer(20 * 1024 * 1024);
    const file = new File([hugeBuffer], 'large.jpg', { type: 'image/jpeg' });
    const formData = new FormData();
    formData.append('file', file);

    await expect(uploadReviewImageAction('review-1', 'osm-123', formData)).rejects.toThrow(
      'El archivo no puede superar los 15 MB.'
    );
    expect(mockUpload).not.toHaveBeenCalled();
  });

  it('throws INVALID_INPUT when processed image exceeds max output size', async () => {
    mockProcessImageForUpload.mockResolvedValue({
      buffer: Buffer.alloc(10 * 1024 * 1024),
      filename: 'photo.webp',
      contentType: 'image/webp',
    });

    const file = createMockFile();
    const formData = new FormData();
    formData.append('file', file);

    await expect(uploadReviewImageAction('review-1', 'osm-123', formData)).rejects.toThrow(
      'La imagen optimizada sigue siendo muy pesada.'
    );
    expect(mockUpload).not.toHaveBeenCalled();
  });

  it('calls rate limit with correct key', async () => {
    const rateLimit = vi.fn().mockResolvedValue(undefined);
    (createServerActionDeps as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockDeps({ rateLimit })
    );

    const file = createMockFile();
    const formData = new FormData();
    formData.append('file', file);

    await uploadReviewImageAction('review-1', 'osm-123', formData);

    expect(rateLimit).toHaveBeenCalledWith('upload_review_image:user-1', 'write');
  });

  it('propagates rate limit errors', async () => {
    const rateLimit = vi.fn().mockRejectedValue(new Error('Rate limit exceeded'));
    (createServerActionDeps as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockDeps({ rateLimit })
    );

    const file = createMockFile();
    const formData = new FormData();
    formData.append('file', file);

    await expect(uploadReviewImageAction('review-1', 'osm-123', formData)).rejects.toThrow(
      'Rate limit exceeded'
    );
  });

  it('propagates upload repository errors', async () => {
    mockUpload.mockRejectedValue(new Error('Upload failed'));
    const file = createMockFile();
    const formData = new FormData();
    formData.append('file', file);

    await expect(uploadReviewImageAction('review-1', 'osm-123', formData)).rejects.toThrow(
      'Upload failed'
    );
  });
});

describe('deleteReviewImageAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (createServerActionDeps as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockDeps());
    mockDelete.mockResolvedValue({ success: true });
  });

  it('deletes an image when authenticated', async () => {
    const result = await deleteReviewImageAction('image-1', 'review-1');

    expect(result).toEqual({ success: true });
    expect(mockDelete).toHaveBeenCalledWith({ imageId: 'image-1', reviewId: 'review-1' });
  });

  it('throws UNAUTHORIZED when no user', async () => {
    (createServerActionDeps as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockDeps({
        supabase: { auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }) } },
      })
    );

    await expect(deleteReviewImageAction('image-1', 'review-1')).rejects.toThrow(
      'Debés iniciar sesión para eliminar imágenes.'
    );
    expect(mockDelete).not.toHaveBeenCalled();
  });
});

describe('getReviewImagesAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (createServerActionDeps as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockDeps());
    mockGetByReviewId.mockResolvedValue([{ id: 'img-1', url: 'https://images.example.com/1.webp' }]);
  });

  it('gets images when authenticated', async () => {
    const result = await getReviewImagesAction('review-1');

    expect(result).toEqual([{ id: 'img-1', url: 'https://images.example.com/1.webp' }]);
    expect(mockGetByReviewId).toHaveBeenCalledWith({ reviewId: 'review-1' });
  });

  it('throws UNAUTHORIZED when no user', async () => {
    (createServerActionDeps as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockDeps({
        supabase: { auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }) } },
      })
    );

    await expect(getReviewImagesAction('review-1')).rejects.toThrow(
      'Debés iniciar sesión para ver imágenes.'
    );
    expect(mockGetByReviewId).not.toHaveBeenCalled();
  });
});
