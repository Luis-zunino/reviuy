import { describe, expect, it, vi, beforeEach } from 'vitest';
import { SupabasePropertyReviewCommandRepository } from '../supabase-property-review-command.repository';
import { VoteType } from '@/types/vote-type';

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

describe('SupabasePropertyReviewCommandRepository', () => {
  let repository: SupabasePropertyReviewCommandRepository;
  let mockBuilder: ReturnType<typeof createMockBuilder>;
  let mockSupabase: any;

  const defaultUser = { id: 'user-1' };

  beforeEach(() => {
    mockBuilder = createMockBuilder(null);
    mockSupabase = {
      from: vi.fn().mockReturnValue(mockBuilder),
      rpc: vi.fn().mockReturnValue(mockBuilder),
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: defaultUser }, error: null }),
      },
    };
    repository = new SupabasePropertyReviewCommandRepository(mockSupabase);
  });

  describe('create', () => {
    const validInput = {
      title: 'Great place',
      description: 'Loved it',
      rating: 5,
      address_text: 'Calle Falsa 123',
      address_osm_id: 'N456',
      latitude: -34.6,
      longitude: -58.4,
    };

    const insertedBase = { id: 'new-review-1', ...validInput };

    it('creates a review without rooms successfully', async () => {
      const completeReview = { ...insertedBase, review_rooms: [] };
      mockBuilder = createMockBuilder(true, insertedBase, completeReview);
      mockSupabase.from.mockReturnValue(mockBuilder);
      mockSupabase.rpc.mockReturnValue(mockBuilder);

      const result = await repository.create(validInput);

      expect(result.success).toBe(true);
      expect(result.data?.id).toBe('new-review-1');
      expect(result.data?.review_rooms).toEqual([]);
    });

    it('creates a review with rooms successfully', async () => {
      const completeReview = {
        ...insertedBase,
        review_rooms: [{ id: 'rm1', room_type: 'bedroom', area_m2: 20 }],
      };
      mockBuilder = createMockBuilder(true, insertedBase, null, completeReview);
      mockSupabase.from.mockReturnValue(mockBuilder);
      mockSupabase.rpc.mockReturnValue(mockBuilder);

      const result = await repository.create({
        ...validInput,
        review_rooms: [{ room_type: 'bedroom', area_m2: 20 }],
      });

      expect(result.success).toBe(true);
      expect(result.message).toContain('1 habitaciones');
    });

    it('throws UNAUTHORIZED when no user', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null }, error: null });

      await expect(repository.create(validInput)).rejects.toThrow();
    });

    it('throws RATE_LIMIT when rate limited', async () => {
      mockBuilder = createMockBuilder(false);
      mockSupabase.rpc.mockReturnValue(mockBuilder);

      await expect(repository.create(validInput)).rejects.toThrow('Demasiadas reseñas');
    });

    it('throws on insert error', async () => {
      const errorBuilder = createMockBuilder(true);
      const origThen = errorBuilder.then;
      let callCount = 0;
      errorBuilder.then = (onfulfilled: any) => {
        callCount++;
        if (callCount === 2) {
          return Promise.resolve({ data: null, error: { message: 'Insert failed' } }).then(
            onfulfilled
          );
        }
        return origThen.call(errorBuilder, onfulfilled);
      };
      mockSupabase.from.mockReturnValue(errorBuilder);
      mockSupabase.rpc.mockReturnValue(errorBuilder);

      await expect(repository.create(validInput)).rejects.toThrow();
    });

    it('rolls back review when rooms insert fails', async () => {
      const errorBuilder = createMockBuilder(true);
      const origThen = errorBuilder.then;
      let callCount = 0;
      errorBuilder.then = (onfulfilled: any) => {
        callCount++;
        if (callCount === 2) {
          return Promise.resolve({ data: null, error: { message: 'Rooms insert failed' } }).then(
            onfulfilled
          );
        }
        return origThen.call(errorBuilder, onfulfilled);
      };
      mockSupabase.from.mockReturnValue(errorBuilder);
      mockSupabase.rpc.mockReturnValue(errorBuilder);

      await expect(
        repository.create({ ...validInput, review_rooms: [{ room_type: 'bedroom', area_m2: 20 }] })
      ).rejects.toThrow();
    });

    it('throws on final review fetch error', async () => {
      const errorBuilder = createMockBuilder(true);
      const origThen = errorBuilder.then;
      let callCount = 0;
      errorBuilder.then = (onfulfilled: any) => {
        callCount++;
        if (callCount === 2) {
          return Promise.resolve({ data: null, error: null }).then(onfulfilled);
        }
        if (callCount === 3) {
          return Promise.resolve({ data: null, error: { message: 'Fetch failed' } }).then(
            onfulfilled
          );
        }
        return origThen.call(errorBuilder, onfulfilled);
      };
      mockSupabase.from.mockReturnValue(errorBuilder);
      mockSupabase.rpc.mockReturnValue(errorBuilder);

      await expect(repository.create(validInput)).rejects.toThrow();
    });
  });

  describe('update', () => {
    const existingReview = { id: 'review-1', user_id: 'user-1' };
    const updateData = { title: 'Updated title' };

    it('updates a review successfully', async () => {
      const completeReview = { id: 'review-1', title: 'Updated title', review_rooms: [] };
      mockBuilder = createMockBuilder(existingReview, null, completeReview);
      mockSupabase.from.mockReturnValue(mockBuilder);

      const result = await repository.update({ reviewId: 'review-1', ...updateData });

      expect(result.success).toBe(true);
      expect(result.data?.title).toBe('Updated title');
    });

    it('returns NOT_FOUND when review does not exist', async () => {
      const errorBuilder = createMockBuilder(null);
      errorBuilder.then = (onfulfilled: any) =>
        Promise.resolve({ data: null, error: { message: 'Not found' } }).then(onfulfilled);
      mockSupabase.from.mockReturnValue(errorBuilder);

      const result = await repository.update({ reviewId: 'nonexistent', ...updateData });

      expect(result.success).toBe(false);
      expect(result.error).toBe('NOT_FOUND');
    });

    it('returns FORBIDDEN when user does not own review', async () => {
      const otherUserReview = { id: 'review-2', user_id: 'other-user' };
      mockBuilder = createMockBuilder(otherUserReview);
      mockSupabase.from.mockReturnValue(mockBuilder);

      const result = await repository.update({ reviewId: 'review-2', ...updateData });

      expect(result.success).toBe(false);
      expect(result.error).toBe('FORBIDDEN');
    });

    it('updates rooms when provided', async () => {
      const completeReview = {
        id: 'review-1',
        title: 'Updated',
        review_rooms: [{ id: 'rm1', room_type: 'kitchen', area_m2: 15 }],
      };
      mockBuilder = createMockBuilder(existingReview, null, completeReview);
      mockSupabase.from.mockReturnValue(mockBuilder);

      const result = await repository.update({
        reviewId: 'review-1',
        ...updateData,
        review_rooms: [{ room_type: 'kitchen', area_m2: 15 }],
      });

      expect(result.success).toBe(true);
    });

    it('throws on update error', async () => {
      const errorBuilder = createMockBuilder(existingReview);
      const origThen = errorBuilder.then;
      let callCount = 0;
      errorBuilder.then = (onfulfilled: any) => {
        callCount++;
        if (callCount === 2) {
          return Promise.resolve({ data: null, error: { message: 'Update failed' } }).then(
            onfulfilled
          );
        }
        return origThen.call(errorBuilder, onfulfilled);
      };
      mockSupabase.from.mockReturnValue(errorBuilder);

      await expect(repository.update({ reviewId: 'review-1', ...updateData })).rejects.toThrow();
    });

    it('throws on rooms insert error during update', async () => {
      const errorBuilder = createMockBuilder(existingReview);
      const origThen = errorBuilder.then;
      let callCount = 0;
      errorBuilder.then = (onfulfilled: any) => {
        callCount++;
        if (callCount === 2) {
          return Promise.resolve({ data: null, error: null }).then(onfulfilled);
        }
        if (callCount === 3) {
          return origThen.call(errorBuilder, onfulfilled);
        }
        if (callCount === 4) {
          return Promise.resolve({ data: null, error: { message: 'Rooms insert failed' } }).then(
            onfulfilled
          );
        }
        return origThen.call(errorBuilder, onfulfilled);
      };
      mockSupabase.from.mockReturnValue(errorBuilder);

      await expect(
        repository.update({
          reviewId: 'review-1',
          ...updateData,
          review_rooms: [{ room_type: 'kitchen', area_m2: 15 }],
        })
      ).rejects.toThrow();
    });

    it('throws on final review fetch error after update', async () => {
      const errorBuilder = createMockBuilder(existingReview);
      const origThen = errorBuilder.then;
      let callCount = 0;
      errorBuilder.then = (onfulfilled: any) => {
        callCount++;
        if (callCount === 2) {
          return Promise.resolve({ data: null, error: null }).then(onfulfilled);
        }
        if (callCount === 3) {
          return Promise.resolve({ data: null, error: { message: 'Fetch review failed' } }).then(
            onfulfilled
          );
        }
        return origThen.call(errorBuilder, onfulfilled);
      };
      mockSupabase.from.mockReturnValue(errorBuilder);

      await expect(repository.update({ reviewId: 'review-1', ...updateData })).rejects.toThrow();
    });
  });

  describe('delete', () => {
    const existingReview = { id: 'review-1', user_id: 'user-1', title: 'Test' };

    it('deletes a review successfully', async () => {
      mockBuilder = createMockBuilder(existingReview, null);
      mockSupabase.from.mockReturnValue(mockBuilder);

      const result = await repository.delete({ reviewId: 'review-1' });

      expect(result.success).toBe(true);
      expect(result.message).toContain('eliminada');
    });

    it('throws on fetch error', async () => {
      const errorBuilder = createMockBuilder(null);
      errorBuilder.then = (onfulfilled: any) =>
        Promise.resolve({ data: null, error: { message: 'DB error' } }).then(onfulfilled);
      mockSupabase.from.mockReturnValue(errorBuilder);

      await expect(repository.delete({ reviewId: 'nonexistent' })).rejects.toThrow();
    });

    it('returns NOT_FOUND when review does not exist', async () => {
      mockBuilder = createMockBuilder(null);
      mockSupabase.from.mockReturnValue(mockBuilder);

      const result = await repository.delete({ reviewId: 'ghost' });

      expect(result.success).toBe(false);
      expect(result.error).toBe('NOT_FOUND');
    });

    it('returns FORBIDDEN when user does not own review', async () => {
      const otherReview = { id: 'review-2', user_id: 'other-user', title: 'Test' };
      mockBuilder = createMockBuilder(otherReview);
      mockSupabase.from.mockReturnValue(mockBuilder);

      const result = await repository.delete({ reviewId: 'review-2' });

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

      await expect(repository.delete({ reviewId: 'review-1' })).rejects.toThrow();
    });
  });

  describe('vote', () => {
    it('calls vote_review RPC and returns result', async () => {
      const rpcResult = { likes: 10, dislikes: 2 };
      mockBuilder = createMockBuilder(rpcResult);
      mockSupabase.rpc.mockReturnValue(mockBuilder);

      const result = await repository.vote({ reviewId: 'r1', voteType: VoteType.LIKE });

      expect(result.success).toBe(true);
      expect(mockSupabase.rpc).toHaveBeenCalledWith('vote_review', {
        p_review_id: 'r1',
        p_vote_type: VoteType.LIKE,
      });
    });

    it('throws on RPC error', async () => {
      const errorBuilder = createMockBuilder(null);
      errorBuilder.then = (onfulfilled: any) =>
        Promise.resolve({ data: null, error: { message: 'RPC error' } }).then(onfulfilled);
      mockSupabase.rpc.mockReturnValue(errorBuilder);

      await expect(repository.vote({ reviewId: 'r1', voteType: VoteType.LIKE })).rejects.toThrow();
    });
  });

  describe('toggleFavorite', () => {
    it('calls toggle_favorite_review RPC and returns result', async () => {
      const rpcResult = { favorited: true };
      mockBuilder = createMockBuilder(rpcResult);
      mockSupabase.rpc.mockReturnValue(mockBuilder);

      const result = await repository.toggleFavorite({ reviewId: 'r1' });

      expect(result.success).toBe(true);
      expect(result.favorited).toBe(true);
      expect(mockSupabase.rpc).toHaveBeenCalledWith('toggle_favorite_review', {
        p_review_id: 'r1',
      });
    });

    it('throws on RPC error', async () => {
      const errorBuilder = createMockBuilder(null);
      errorBuilder.then = (onfulfilled: any) =>
        Promise.resolve({ data: null, error: { message: 'RPC error' } }).then(onfulfilled);
      mockSupabase.rpc.mockReturnValue(errorBuilder);

      await expect(repository.toggleFavorite({ reviewId: 'r1' })).rejects.toThrow();
    });
  });
});
