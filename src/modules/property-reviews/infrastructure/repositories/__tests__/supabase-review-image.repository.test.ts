import { describe, expect, it, vi, beforeEach } from 'vitest';
import { SupabaseReviewImageRepository } from '../supabase-review-image.repository';
import { uploadImage, deleteImage } from '@/lib/storage';

vi.mock('@/lib/storage', () => ({
  uploadImage: vi.fn(),
  deleteImage: vi.fn(),
}));

const createMockBuilder = (...dataSequence: any[]) => {
  const resolveSequence = dataSequence.map((data) => ({ data, error: null }));
  if (resolveSequence.length === 0) resolveSequence.push({ data: null, error: null });
  let callIndex = 0;

  const chainable: any = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    is: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    lte: vi.fn().mockReturnThis(),
    ilike: vi.fn().mockReturnThis(),
    or: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    textSearch: vi.fn().mockReturnThis(),
    not: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    csv: vi.fn().mockResolvedValue({ data: null, error: null }),
    then: (onfulfilled: any) =>
      Promise.resolve(resolveSequence[Math.min(callIndex++, resolveSequence.length - 1)]).then(
        onfulfilled
      ),
  };

  return chainable;
};

describe('SupabaseReviewImageRepository', () => {
  let repository: SupabaseReviewImageRepository;
  let mockBuilder: ReturnType<typeof createMockBuilder>;
  let mockSupabase: any;

  const baseFile = Buffer.from('test');

  beforeEach(() => {
    mockBuilder = createMockBuilder(null);
    mockSupabase = {
      from: vi.fn().mockReturnValue(mockBuilder),
      rpc: vi.fn().mockReturnValue(mockBuilder),
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null }),
      },
    };
    repository = new SupabaseReviewImageRepository(mockSupabase);

    vi.mocked(uploadImage).mockResolvedValue({
      url: 'https://r2.example.com/path/photo.jpg',
      path: 'reviews/N123/review-1/xxx.jpg',
    });
    vi.mocked(deleteImage).mockResolvedValue(undefined);
  });

  describe('upload', () => {
    const validInput = {
      reviewId: 'review-1',
      osmId: 'N123',
      filename: 'photo.jpg',
      file: baseFile,
      contentType: 'image/jpeg',
    };

    it('uploads an image successfully', async () => {
      const countBuilder = createMockBuilder(null);
      const countResolve: any = { data: null, error: null, count: 0 };
      countBuilder.then = (onfulfilled: any) => Promise.resolve(countResolve).then(onfulfilled);

      const insertBuilder = createMockBuilder({
        id: 'img-1',
        url: 'https://r2.example.com/path/photo.jpg',
        path: 'reviews/N123/review-1/xxx.jpg',
        order: 0,
      });
      mockSupabase.from
        .mockReturnValueOnce(createMockBuilder({ id: 'review-1', user_id: 'user-1' }))
        .mockReturnValueOnce(countBuilder)
        .mockReturnValueOnce(insertBuilder);

      const result = await repository.upload(validInput);

      expect(result.success).toBe(true);
      expect(result.data!.id).toBe('img-1');
    });

    it('throws NOT_FOUND when review does not exist', async () => {
      mockSupabase.from.mockReturnValueOnce(createMockBuilder(null));

      await expect(repository.upload(validInput)).rejects.toThrow('Reseña no encontrada');
    });

    it('throws VALIDATION_ERROR when image limit exceeded', async () => {
      const countBuilder = createMockBuilder(null);
      const countResolve: any = { data: null, error: null, count: 5 };
      countBuilder.then = (onfulfilled: any) => Promise.resolve(countResolve).then(onfulfilled);

      mockSupabase.from
        .mockReturnValueOnce(createMockBuilder({ id: 'review-1', user_id: 'user-1' }))
        .mockReturnValueOnce(countBuilder);

      await expect(repository.upload(validInput)).rejects.toThrow('límite máximo es 5');
    });

    it('throws INTERNAL_ERROR on count query error', async () => {
      const countErrorBuilder = createMockBuilder(null);
      countErrorBuilder.then = (onfulfilled: any) =>
        Promise.resolve({ data: null, error: { message: 'Count error' } }).then(onfulfilled);

      mockSupabase.from
        .mockReturnValueOnce(createMockBuilder({ id: 'review-1', user_id: 'user-1' }))
        .mockReturnValueOnce(countErrorBuilder);

      await expect(repository.upload(validInput)).rejects.toThrow('Error al verificar el límite');
    });

    it('cleans up R2 file when DB insert fails', async () => {
      const countBuilder = createMockBuilder(null);
      const countResolve: any = { data: null, error: null, count: 0 };
      countBuilder.then = (onfulfilled: any) => Promise.resolve(countResolve).then(onfulfilled);

      const failedInsertBuilder = createMockBuilder(null);
      failedInsertBuilder.then = (onfulfilled: any) =>
        Promise.resolve({ data: null, error: { message: 'Insert failed' } }).then(onfulfilled);

      mockSupabase.from
        .mockReturnValueOnce(createMockBuilder({ id: 'review-1', user_id: 'user-1' }))
        .mockReturnValueOnce(countBuilder)
        .mockReturnValueOnce(failedInsertBuilder);

      await expect(repository.upload(validInput)).rejects.toThrow();
      expect(deleteImage).toHaveBeenCalled();
    });

    it('uploads a file without extension', async () => {
      const countBuilder = createMockBuilder(null);
      const countResolve: any = { data: null, error: null, count: 0 };
      countBuilder.then = (onfulfilled: any) => Promise.resolve(countResolve).then(onfulfilled);

      const insertBuilder = createMockBuilder({
        id: 'img-noext',
        url: 'https://r2.example.com/path/photo.jpg',
        path: 'reviews/N123/review-1/xxx.jpg',
        order: 0,
      });
      mockSupabase.from
        .mockReturnValueOnce(createMockBuilder({ id: 'review-1', user_id: 'user-1' }))
        .mockReturnValueOnce(countBuilder)
        .mockReturnValueOnce(insertBuilder);

      const result = await repository.upload({ ...validInput, filename: 'photo' });

      expect(result.success).toBe(true);
      expect(result.data!.id).toBe('img-noext');
    });

    it('uploads with null count', async () => {
      const countBuilder = createMockBuilder(null);
      const countResolve: any = { data: null, error: null, count: null };
      countBuilder.then = (onfulfilled: any) => Promise.resolve(countResolve).then(onfulfilled);

      const insertBuilder = createMockBuilder({
        id: 'img-nullcount',
        url: 'https://r2.example.com/path/photo.jpg',
        path: 'reviews/N123/review-1/xxx.jpg',
        order: 0,
      });
      mockSupabase.from
        .mockReturnValueOnce(createMockBuilder({ id: 'review-1', user_id: 'user-1' }))
        .mockReturnValueOnce(countBuilder)
        .mockReturnValueOnce(insertBuilder);

      const result = await repository.upload(validInput);

      expect(result.success).toBe(true);
      expect(result.data!.id).toBe('img-nullcount');
    });
  });

  describe('delete', () => {
    const validInput = { imageId: 'img-1', reviewId: 'review-1' };

    it('deletes an image successfully', async () => {
      mockBuilder = createMockBuilder({
        id: 'img-1',
        path: 'reviews/path/img.jpg',
        review_id: 'review-1',
      });
      mockSupabase.from.mockReturnValue(mockBuilder);

      const result = await repository.delete(validInput);

      expect(result.success).toBe(true);
      expect(deleteImage).toHaveBeenCalledWith('reviews/path/img.jpg');
    });

    it('throws NOT_FOUND when image does not exist', async () => {
      mockBuilder = createMockBuilder(null);
      mockSupabase.from.mockReturnValue(mockBuilder);

      await expect(repository.delete(validInput)).rejects.toThrow('Imagen no encontrada');
    });

    it('throws INTERNAL_ERROR on DB delete error', async () => {
      const errorBuilder = createMockBuilder({
        id: 'img-1',
        path: 'reviews/path/img.jpg',
        review_id: 'review-1',
      });
      const origThen = errorBuilder.then;
      let callCount = 0;
      errorBuilder.then = (onfulfilled: any) => {
        callCount++;
        if (callCount === 2) {
          return Promise.resolve({ data: null, error: { message: 'Delete DB error' } }).then(
            onfulfilled
          );
        }
        return origThen.call(errorBuilder, onfulfilled);
      };
      mockSupabase.from.mockReturnValue(errorBuilder);

      await expect(repository.delete(validInput)).rejects.toThrow('Error al eliminar el registro');
    });
  });

  describe('getByReviewId', () => {
    const mockImages = [
      { id: 'img-1', url: 'https://example.com/1.jpg', order: 0 },
      { id: 'img-2', url: 'https://example.com/2.jpg', order: 1 },
    ];

    it('returns images for a review', async () => {
      mockBuilder = createMockBuilder(mockImages);
      mockSupabase.from.mockReturnValue(mockBuilder);

      const result = await repository.getByReviewId({ reviewId: 'review-1' });

      expect(result).toEqual(mockImages);
    });

    it('returns empty array when data is null', async () => {
      mockBuilder = createMockBuilder(null);
      mockSupabase.from.mockReturnValue(mockBuilder);

      const result = await repository.getByReviewId({ reviewId: 'review-1' });

      expect(result).toEqual([]);
    });

    it('throws on DB error', async () => {
      const errorBuilder = createMockBuilder(null);
      errorBuilder.then = (onfulfilled: any) =>
        Promise.resolve({ data: null, error: { message: 'DB error' } }).then(onfulfilled);
      mockSupabase.from.mockReturnValue(errorBuilder);

      await expect(repository.getByReviewId({ reviewId: 'review-1' })).rejects.toThrow(
        'Error al obtener las imágenes'
      );
    });
  });
});
