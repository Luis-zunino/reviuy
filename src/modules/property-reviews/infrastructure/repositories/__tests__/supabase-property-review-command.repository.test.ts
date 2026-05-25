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

    const publicReview = {
      id: 'new-review-1',
      title: 'Great place',
      description: 'Loved it',
      rating: 5,
      property_type: null,
      address_text: 'Calle Falsa 123',
      address_osm_id: 'N456',
      latitude: -34.6,
      longitude: -58.4,
      zone_rating: null,
      winter_comfort: null,
      summer_comfort: null,
      humidity: null,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      apartment_number: null,
      real_estate_experience: null,
    };

    it('creates a review without rooms successfully', async () => {
      // Sequence: RPC create_review → {success:true, review_id}, SELECT reviews_public → publicReview, SELECT review_rooms → []
      mockBuilder = createMockBuilder(
        { success: true, review_id: 'new-review-1', message: 'Reseña creada exitosamente' },
        publicReview,
        []
      );
      mockSupabase.from.mockReturnValue(mockBuilder);
      mockSupabase.rpc.mockReturnValue(mockBuilder);

      const result = await repository.create(validInput);

      expect(result.success).toBe(true);
      expect(result.data?.id).toBe('new-review-1');
      expect(result.data?.review_rooms).toEqual([]);
    });

    it('creates a review with rooms successfully', async () => {
      const roomsData = [
        { id: 'rm1', review_id: 'new-review-1', room_type: 'bedroom', area_m2: 20 },
      ];
      // Sequence: RPC create_review, SELECT reviews_public → publicReview, SELECT review_rooms → roomsData
      mockBuilder = createMockBuilder(
        { success: true, review_id: 'new-review-1', message: 'Reseña creada exitosamente' },
        publicReview,
        roomsData
      );
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

    it('throws VALIDATION_ERROR when RPC rejects (rate limit / duplicate)', async () => {
      mockBuilder = createMockBuilder({
        success: false,
        error: 'Demasiadas reseñas. Intenta más tarde.',
      });
      mockSupabase.rpc.mockReturnValue(mockBuilder);

      await expect(repository.create(validInput)).rejects.toThrow(
        'Demasiadas reseñas. Intenta más tarde.'
      );
    });

    it('throws on RPC error', async () => {
      const errorBuilder = createMockBuilder(null);
      const origThen = errorBuilder.then;
      let callCount = 0;
      errorBuilder.then = (onfulfilled: any) => {
        callCount++;
        // Call 1: RPC create_review → error
        if (callCount === 1) {
          return Promise.resolve({ data: null, error: { message: 'RPC failed', code: 'PGRST116' } }).then(
            onfulfilled
          );
        }
        return origThen.call(errorBuilder, onfulfilled);
      };
      mockSupabase.rpc.mockReturnValue(errorBuilder);

      await expect(repository.create(validInput)).rejects.toThrow();
    });

    it('returns fallback data when public view fetch fails', async () => {
      const errorBuilder = createMockBuilder({ success: true, review_id: 'new-review-1' });
      const origThen = errorBuilder.then;
      let callCount = 0;
      errorBuilder.then = (onfulfilled: any) => {
        callCount++;
        // Call 1: RPC create_review → success
        // Call 2: SELECT reviews_public → error, Call 3: SELECT review_rooms → []
        if (callCount === 2) {
          return Promise.resolve({ data: null, error: { message: 'Not found' } }).then(onfulfilled);
        }
        if (callCount === 3) {
          return Promise.resolve({ data: [], error: null }).then(onfulfilled);
        }
        return origThen.call(errorBuilder, onfulfilled);
      };
      mockSupabase.from.mockReturnValue(errorBuilder);
      mockSupabase.rpc.mockReturnValue(errorBuilder);

      const result = await repository.create(validInput);

      expect(result.success).toBe(true);
      expect(result.data?.id).toBeDefined();
      expect(result.data?.review_rooms).toEqual([]);
    });
  });

  describe('update', () => {
    const updateData = { title: 'Updated title' };
    const publicReview = {
      id: 'review-1',
      title: 'Updated title',
      description: 'Loved it',
      rating: 5,
      property_type: null,
      address_text: 'Calle Falsa 123',
      address_osm_id: 'N456',
      latitude: -34.6,
      longitude: -58.4,
      zone_rating: null,
      winter_comfort: null,
      summer_comfort: null,
      humidity: null,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      apartment_number: null,
      real_estate_experience: null,
    };

    it('updates a review successfully', async () => {
      // Sequence: reviews_public(ownership) → {is_mine:true}, RPC → {success:true}, reviews_public(select) → publicReview, review_rooms → []
      mockBuilder = createMockBuilder(
        { id: 'review-1', is_mine: true },
        { success: true },
        publicReview,
        []
      );
      mockSupabase.from.mockReturnValue(mockBuilder);
      mockSupabase.rpc.mockReturnValue(mockBuilder);

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
      mockBuilder = createMockBuilder({ id: 'review-2', is_mine: false });
      mockSupabase.from.mockReturnValue(mockBuilder);

      const result = await repository.update({ reviewId: 'review-2', ...updateData });

      expect(result.success).toBe(false);
      expect(result.error).toBe('FORBIDDEN');
    });

    it('updates rooms when provided', async () => {
      const roomsData = [{ id: 'rm1', review_id: 'review-1', room_type: 'kitchen', area_m2: 15 }];
      // Sequence: ownership, RPC, delete rooms, insert rooms, reviews_public SELECT, review_rooms SELECT
      mockBuilder = createMockBuilder(
        { id: 'review-1', is_mine: true },
        { success: true },
        null,
        null,
        publicReview,
        roomsData
      );
      mockSupabase.from.mockReturnValue(mockBuilder);
      mockSupabase.rpc.mockReturnValue(mockBuilder);

      const result = await repository.update({
        reviewId: 'review-1',
        ...updateData,
        review_rooms: [{ room_type: 'kitchen', area_m2: 15 }],
      });

      expect(result.success).toBe(true);
    });

    it('throws on update error', async () => {
      const errorBuilder = createMockBuilder({ id: 'review-1', is_mine: true });
      const origThen = errorBuilder.then;
      let callCount = 0;
      errorBuilder.then = (onfulfilled: any) => {
        callCount++;
        if (callCount === 2) {
          return Promise.resolve({
            data: { success: false, error: 'Update failed' },
            error: null,
          }).then(onfulfilled);
        }
        return origThen.call(errorBuilder, onfulfilled);
      };
      mockSupabase.from.mockReturnValue(errorBuilder);
      mockSupabase.rpc.mockReturnValue(errorBuilder);

      await expect(repository.update({ reviewId: 'review-1', ...updateData })).rejects.toThrow();
    });

    it('throws on rooms insert error during update', async () => {
      const errorBuilder = createMockBuilder({ id: 'review-1', is_mine: true });
      const origThen = errorBuilder.then;
      let callCount = 0;
      errorBuilder.then = (onfulfilled: any) => {
        callCount++;
        // Call 1: ownership, Call 2: RPC success, Call 3: delete rooms ok, Call 4: insert rooms error
        if (callCount === 2) {
          return Promise.resolve({ data: { success: true }, error: null }).then(onfulfilled);
        }
        if (callCount === 3) {
          return Promise.resolve({ data: null, error: null }).then(onfulfilled);
        }
        if (callCount === 4) {
          return Promise.resolve({ data: null, error: { message: 'Rooms insert failed' } }).then(
            onfulfilled
          );
        }
        return origThen.call(errorBuilder, onfulfilled);
      };
      mockSupabase.from.mockReturnValue(errorBuilder);
      mockSupabase.rpc.mockReturnValue(errorBuilder);

      await expect(
        repository.update({
          reviewId: 'review-1',
          ...updateData,
          review_rooms: [{ room_type: 'kitchen', area_m2: 15 }],
        })
      ).rejects.toThrow();
    });

    it('returns partial data on final review fetch error after update', async () => {
      // Sequence: ownership {is_mine:true}, RPC {success:true}, reviews_public SELECT → error, review_rooms → []
      const errorBuilder = createMockBuilder({ id: 'review-1', is_mine: true });
      const origThen = errorBuilder.then;
      let callCount = 0;
      errorBuilder.then = (onfulfilled: any) => {
        callCount++;
        if (callCount === 2) {
          return Promise.resolve({ data: { success: true }, error: null }).then(onfulfilled);
        }
        if (callCount === 3) {
          return Promise.resolve({ data: null, error: { message: 'Fetch review failed' } }).then(
            onfulfilled
          );
        }
        if (callCount === 4) {
          return Promise.resolve({ data: [], error: null }).then(onfulfilled);
        }
        return origThen.call(errorBuilder, onfulfilled);
      };
      mockSupabase.from.mockReturnValue(errorBuilder);
      mockSupabase.rpc.mockReturnValue(errorBuilder);

      const result = await repository.update({ reviewId: 'review-1', ...updateData });
      expect(result.success).toBe(true);
      expect(result.message).toContain('actualizada');
    });
  });

  describe('delete', () => {
    it('deletes a review successfully', async () => {
      // Sequence: reviews_public(ownership) → {is_mine:true}, DELETE → null
      mockBuilder = createMockBuilder({ id: 'review-1', is_mine: true }, null);
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
      mockBuilder = createMockBuilder({ id: 'review-2', is_mine: false });
      mockSupabase.from.mockReturnValue(mockBuilder);

      const result = await repository.delete({ reviewId: 'review-2' });

      expect(result.success).toBe(false);
      expect(result.error).toBe('FORBIDDEN');
    });

    it('throws on delete error', async () => {
      const ownershipBuilder = createMockBuilder({ id: 'review-1', is_mine: true });
      mockSupabase.from.mockReturnValue(ownershipBuilder);

      const errorBuilder = createMockBuilder(null);
      errorBuilder.then = (onfulfilled: any) =>
        Promise.resolve({ data: null, error: { message: 'Delete failed' } }).then(onfulfilled);
      mockSupabase.rpc.mockReturnValue(errorBuilder);

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
