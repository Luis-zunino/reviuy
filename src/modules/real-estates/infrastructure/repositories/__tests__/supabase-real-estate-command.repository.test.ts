import { describe, expect, it, vi, beforeEach } from 'vitest';
import { SupabaseRealEstateCommandRepository } from '../supabase-real-estate-command.repository';
import { VoteType } from '@/types';

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

describe('SupabaseRealEstateCommandRepository', () => {
  let repository: SupabaseRealEstateCommandRepository;
  let mockBuilder: ReturnType<typeof createMockBuilder>;
  let mockSupabase: any;

  beforeEach(() => {
    mockBuilder = createMockBuilder(null);
    mockSupabase = {
      from: vi.fn().mockReturnValue(mockBuilder),
      rpc: vi.fn().mockReturnValue(mockBuilder),
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null }),
      },
    };
    repository = new SupabaseRealEstateCommandRepository(mockSupabase);
  });

  describe('create', () => {
    it('creates a real estate successfully', async () => {
      const created = { id: 're-1', name: 'Edificio Test', created_by: 'user-1' };
      mockBuilder = createMockBuilder(created);
      mockSupabase.from.mockReturnValue(mockBuilder);

      const result = await repository.create({ real_estate_name: 'Edificio Test' });

      expect(result).toEqual(created);
      expect(mockSupabase.from).toHaveBeenCalledWith('real_estates');
    });

    it('throws UNAUTHORIZED when no user', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null }, error: null });

      await expect(repository.create({ real_estate_name: 'Test' })).rejects.toThrow(
        'No autorizado'
      );
    });

    it('throws on insert error', async () => {
      const errorBuilder = createMockBuilder(null);
      errorBuilder.then = (onfulfilled: any) =>
        Promise.resolve({ data: null, error: { message: 'Insert failed' } }).then(onfulfilled);
      mockSupabase.from.mockReturnValue(errorBuilder);

      await expect(repository.create({ real_estate_name: 'Test' })).rejects.toThrow();
    });
  });

  describe('vote', () => {
    const rpcResult = { likes: 5, dislikes: 1 };

    it('calls vote_real_estate RPC', async () => {
      mockBuilder = createMockBuilder(rpcResult);
      mockSupabase.rpc.mockReturnValue(mockBuilder);

      const result = await repository.vote({ realEstateId: 're-1', voteType: VoteType.LIKE });

      expect(result).toEqual(rpcResult);
      expect(mockSupabase.rpc).toHaveBeenCalledWith('vote_real_estate', {
        p_real_estate_id: 're-1',
        p_vote_type: VoteType.LIKE,
      });
    });

    it('returns empty object when RPC returns null', async () => {
      mockBuilder = createMockBuilder(null);
      mockSupabase.rpc.mockReturnValue(mockBuilder);

      const result = await repository.vote({ realEstateId: 're-1', voteType: VoteType.LIKE });

      expect(result).toEqual({});
    });

    it('throws on RPC error', async () => {
      const errorBuilder = createMockBuilder(null);
      errorBuilder.then = (onfulfilled: any) =>
        Promise.resolve({ data: null, error: { message: 'RPC error' } }).then(onfulfilled);
      mockSupabase.rpc.mockReturnValue(errorBuilder);

      await expect(
        repository.vote({ realEstateId: 're-1', voteType: VoteType.LIKE })
      ).rejects.toThrow();
    });
  });

  describe('toggleFavorite', () => {
    it('returns RPC result when it is an object', async () => {
      const rpcResult = { favorited: true };
      mockBuilder = createMockBuilder(rpcResult);
      mockSupabase.rpc.mockReturnValue(mockBuilder);

      const result = await repository.toggleFavorite({ realEstateId: 're-1' });

      expect(result).toEqual(rpcResult);
    });

    it('returns error object when RPC result is not an object', async () => {
      mockBuilder = createMockBuilder(true);
      mockSupabase.rpc.mockReturnValue(mockBuilder);

      const result = await repository.toggleFavorite({ realEstateId: 're-1' });

      expect(result.success).toBe(false);
    });

    it('throws on RPC error', async () => {
      const errorBuilder = createMockBuilder(null);
      errorBuilder.then = (onfulfilled: any) =>
        Promise.resolve({ data: null, error: { message: 'RPC error' } }).then(onfulfilled);
      mockSupabase.rpc.mockReturnValue(errorBuilder);

      await expect(repository.toggleFavorite({ realEstateId: 're-1' })).rejects.toThrow();
    });
  });

  describe('createReview', () => {
    const reviewInput = {
      title: 'Great building',
      description: 'Loved it',
      rating: 5,
    };
    const createdReview = {
      id: 'rev-1',
      real_estate_id: 're-1',
      title: 'Great building',
      description: 'Loved it',
      rating: 5,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    };

    it('creates a review successfully', async () => {
      mockBuilder = createMockBuilder(createdReview);
      mockSupabase.from.mockReturnValue(mockBuilder);

      const result = await repository.createReview({
        ...reviewInput,
        real_estate_id: 're-1',
      });

      expect(result.success).toBe(true);
      expect(result.data?.id).toBe('rev-1');
    });

    it('returns UNAUTHORIZED when no user', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null }, error: null });

      const result = await repository.createReview({
        ...reviewInput,
        real_estate_id: 're-1',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('UNAUTHORIZED');
    });

    it('throws on insert error', async () => {
      const errorBuilder = createMockBuilder(null);
      errorBuilder.then = (onfulfilled: any) =>
        Promise.resolve({ data: null, error: { message: 'Insert failed' } }).then(onfulfilled);
      mockSupabase.from.mockReturnValue(errorBuilder);

      await expect(
        repository.createReview({
          ...reviewInput,
          real_estate_id: 're-1',
        })
      ).rejects.toThrow();
    });
  });

  describe('updateReview', () => {
    const updatedReview = {
      id: 'rev-1',
      title: 'Updated title',
      description: 'Better now',
      rating: 4,
      created_at: '2024-01-01',
      updated_at: '2024-01-02',
    };

    it('updates a review successfully', async () => {
      mockBuilder = createMockBuilder(updatedReview);
      mockSupabase.from.mockReturnValue(mockBuilder);

      const result = await repository.updateReview({
        reviewId: 'rev-1',
        title: 'Updated title',
        description: 'Better now',
        rating: 4,
      });

      expect(result.success).toBe(true);
      expect(result.data?.title).toBe('Updated title');
    });

    it('returns UNAUTHORIZED when no user', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null }, error: null });

      const result = await repository.updateReview({
        reviewId: 'rev-1',
        title: 'Updated',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('UNAUTHORIZED');
    });

    it('throws on update error', async () => {
      const errorBuilder = createMockBuilder(null);
      errorBuilder.then = (onfulfilled: any) =>
        Promise.resolve({ data: null, error: { message: 'Update failed' } }).then(onfulfilled);
      mockSupabase.from.mockReturnValue(errorBuilder);

      await expect(
        repository.updateReview({
          reviewId: 'rev-1',
          title: 'Updated',
        })
      ).rejects.toThrow();
    });
  });

  describe('deleteReview', () => {
    const existingReview = { id: 'rev-1', user_id: 'user-1', title: 'Test review' };

    it('deletes a review successfully', async () => {
      mockBuilder = createMockBuilder(existingReview, null);
      mockSupabase.from.mockReturnValue(mockBuilder);

      const result = await repository.deleteReview({ reviewId: 'rev-1' });

      expect(result.success).toBe(true);
    });

    it('returns UNAUTHORIZED when no user', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null }, error: null });

      const result = await repository.deleteReview({ reviewId: 'rev-1' });

      expect(result.success).toBe(false);
      expect(result.error).toBe('UNAUTHORIZED');
    });

    it('throws on fetch error', async () => {
      const errorBuilder = createMockBuilder(null);
      errorBuilder.then = (onfulfilled: any) =>
        Promise.resolve({ data: null, error: { message: 'DB error' } }).then(onfulfilled);
      mockSupabase.from.mockReturnValue(errorBuilder);

      await expect(repository.deleteReview({ reviewId: 'nonexistent' })).rejects.toThrow();
    });

    it('returns NOT_FOUND when review does not exist', async () => {
      mockBuilder = createMockBuilder(null);
      mockSupabase.from.mockReturnValue(mockBuilder);

      const result = await repository.deleteReview({ reviewId: 'nonexistent' });

      expect(result.success).toBe(false);
      expect(result.error).toBe('NOT_FOUND');
    });

    it('returns FORBIDDEN when user does not own review', async () => {
      const otherReview = { id: 'rev-2', user_id: 'other-user', title: 'Test' };
      mockBuilder = createMockBuilder(otherReview);
      mockSupabase.from.mockReturnValue(mockBuilder);

      const result = await repository.deleteReview({ reviewId: 'rev-2' });

      expect(result.success).toBe(false);
      expect(result.error).toBe('FORBIDDEN');
    });

    it('throws on delete error', async () => {
      const errorBuilder = createMockBuilder(existingReview);
      const origThen = errorBuilder.then;
      let callCount = 0;
      errorBuilder.then = (onfulfilled: any) => {
        callCount++;
        if (callCount === 2) {
          return Promise.resolve({ data: null, error: { message: 'Delete failed' } }).then(
            onfulfilled
          );
        }
        return origThen.call(errorBuilder, onfulfilled);
      };
      mockSupabase.from.mockReturnValue(errorBuilder);

      await expect(repository.deleteReview({ reviewId: 'rev-1' })).rejects.toThrow();
    });
  });

  describe('voteReview', () => {
    const rpcResult = { likes: 3, dislikes: 0 };

    it('calls vote_real_estate_review RPC', async () => {
      mockBuilder = createMockBuilder(rpcResult);
      mockSupabase.rpc.mockReturnValue(mockBuilder);

      const result = await repository.voteReview({ reviewId: 'rev-1', voteType: VoteType.LIKE });

      expect(result).toEqual(rpcResult);
      expect(mockSupabase.rpc).toHaveBeenCalledWith('vote_real_estate_review', {
        p_real_estate_review_id: 'rev-1',
        p_vote_type: VoteType.LIKE,
      });
    });

    it('throws on RPC error', async () => {
      const errorBuilder = createMockBuilder(null);
      errorBuilder.then = (onfulfilled: any) =>
        Promise.resolve({ data: null, error: { message: 'RPC error' } }).then(onfulfilled);
      mockSupabase.rpc.mockReturnValue(errorBuilder);

      await expect(
        repository.voteReview({ reviewId: 'rev-1', voteType: VoteType.LIKE })
      ).rejects.toThrow();
    });
  });
});
