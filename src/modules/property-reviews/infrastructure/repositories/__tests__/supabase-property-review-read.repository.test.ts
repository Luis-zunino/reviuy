import { describe, expect, it, vi, beforeEach } from 'vitest';
import { SupabasePropertyReviewReadRepository } from '../supabase-property-review-read.repository';

const mockSupabaseClient = vi.hoisted(() => ({ from: vi.fn(), rpc: vi.fn() }) as any);
vi.mock('@/lib/supabase/client', () => ({ supabaseClient: mockSupabaseClient }));

const createMockBuilder = (...dataSequence: any[]) => {
  const resolveSequence = dataSequence.map((data) => ({ data, error: null }));
  if (resolveSequence.length === 0) resolveSequence.push({ data: null, error: null });
  let callIndex = 0;

  const chainable = {
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

describe('SupabasePropertyReviewReadRepository', () => {
  let repository: SupabasePropertyReviewReadRepository;
  let mockBuilder: ReturnType<typeof createMockBuilder>;

  beforeEach(() => {
    mockBuilder = createMockBuilder([]);
    mockSupabaseClient.from.mockReturnValue(mockBuilder);
    mockSupabaseClient.rpc.mockReturnValue(mockBuilder);
    repository = new SupabasePropertyReviewReadRepository(mockSupabaseClient);
  });

  describe('getByAddress', () => {
    const mockReviews = [
      { id: 'r1', address_osm_id: 'N123', title: 'Great place', created_at: '2024-01-01' },
    ];

    it('returns reviews for a given OSM address', async () => {
      mockBuilder = createMockBuilder(mockReviews);
      mockSupabaseClient.from.mockReturnValue(mockBuilder);

      const result = await repository.getByAddress({ osmId: 'N123' });

      expect(result).toEqual(mockReviews);
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('reviews_with_votes_public');
    });

    it('throws on Supabase error', async () => {
      const errorBuilder = createMockBuilder(null);
      errorBuilder.then = (onfulfilled: any) =>
        Promise.resolve({ data: null, error: { message: 'DB error', code: 'PGRST116' } }).then(
          onfulfilled
        );
      mockSupabaseClient.from.mockReturnValue(errorBuilder);

      await expect(repository.getByAddress({ osmId: 'N123' })).rejects.toThrow();
    });
  });

  describe('getById', () => {
    const mockReview = { id: 'r1', title: 'Test', review_rooms: [], real_estates: null };

    it('returns the review when found', async () => {
      mockBuilder = createMockBuilder(mockReview);
      mockSupabaseClient.from.mockReturnValue(mockBuilder);

      const result = await repository.getById({ reviewId: 'r1' });

      expect(result).toEqual(mockReview);
    });

    it('returns null when not found (single error)', async () => {
      const errorBuilder = createMockBuilder(null);
      errorBuilder.then = (onfulfilled: any) =>
        Promise.resolve({ data: null, error: { message: 'Not found', code: 'PGRST116' } }).then(
          onfulfilled
        );
      mockSupabaseClient.from.mockReturnValue(errorBuilder);

      const result = await repository.getById({ reviewId: 'nonexistent' });

      expect(result).toBeNull();
    });
  });

  describe('getByUserId', () => {
    const mockReviews = [{ id: 'r1', title: 'My review' }];

    it('returns reviews via RPC', async () => {
      mockBuilder = createMockBuilder(mockReviews);
      mockSupabaseClient.rpc.mockReturnValue(mockBuilder);

      const result = await repository.getByUserId();

      expect(result).toEqual(mockReviews);
      expect(mockSupabaseClient.rpc).toHaveBeenCalledWith('get_reviews_by_current_user');
    });

    it('throws on RPC error', async () => {
      const errorBuilder = createMockBuilder(null);
      errorBuilder.then = (onfulfilled: any) =>
        Promise.resolve({ data: null, error: { message: 'RPC error' } }).then(onfulfilled);
      mockSupabaseClient.rpc.mockReturnValue(errorBuilder);

      await expect(repository.getByUserId()).rejects.toThrow();
    });
  });

  describe('getByRealEstateId', () => {
    const mockReviews = [{ id: 'r1', real_estate_id: 're1' }];

    it('returns reviews for a real estate', async () => {
      mockBuilder = createMockBuilder(mockReviews);
      mockSupabaseClient.from.mockReturnValue(mockBuilder);

      const result = await repository.getByRealEstateId({ realEstateId: 're1' });

      expect(result).toEqual(mockReviews);
    });

    it('returns empty array when data is null', async () => {
      mockBuilder = createMockBuilder(null);
      mockSupabaseClient.from.mockReturnValue(mockBuilder);

      const result = await repository.getByRealEstateId({ realEstateId: 're1' });

      expect(result).toEqual([]);
    });

    it('throws on Supabase error', async () => {
      const errorBuilder = createMockBuilder(null);
      errorBuilder.then = (onfulfilled: any) =>
        Promise.resolve({ data: null, error: { message: 'DB error' } }).then(onfulfilled);
      mockSupabaseClient.from.mockReturnValue(errorBuilder);

      await expect(repository.getByRealEstateId({ realEstateId: 're1' })).rejects.toThrow();
    });
  });

  describe('getUserVote', () => {
    const mockVote = { id: 'v1', vote_type: 'up' };

    it('returns vote via RPC', async () => {
      mockBuilder = createMockBuilder(mockVote);
      mockSupabaseClient.rpc.mockReturnValue(mockBuilder);

      const result = await repository.getUserVote({ reviewId: 'r1' });

      expect(result).toEqual(mockVote);
      expect(mockSupabaseClient.rpc).toHaveBeenCalledWith('get_user_review_vote', {
        p_review_id: 'r1',
      });
    });

    it('throws on RPC error', async () => {
      const errorBuilder = createMockBuilder(null);
      errorBuilder.then = (onfulfilled: any) =>
        Promise.resolve({ data: null, error: { message: 'RPC error' } }).then(onfulfilled);
      mockSupabaseClient.rpc.mockReturnValue(errorBuilder);

      await expect(repository.getUserVote({ reviewId: 'r1' })).rejects.toThrow();
    });
  });

  describe('getUserFavorites', () => {
    const mockFavorites = [{ id: 'r1', title: 'Fav' }];

    it('returns favorites via RPC', async () => {
      mockBuilder = createMockBuilder(mockFavorites);
      mockSupabaseClient.rpc.mockReturnValue(mockBuilder);

      const result = await repository.getUserFavorites();

      expect(result).toEqual(mockFavorites);
    });

    it('returns empty array when data is null', async () => {
      mockBuilder = createMockBuilder(null);
      mockSupabaseClient.rpc.mockReturnValue(mockBuilder);

      const result = await repository.getUserFavorites();

      expect(result).toEqual([]);
    });

    it('throws on RPC error', async () => {
      const errorBuilder = createMockBuilder(null);
      errorBuilder.then = (onfulfilled: any) =>
        Promise.resolve({ data: null, error: { message: 'RPC error' } }).then(onfulfilled);
      mockSupabaseClient.rpc.mockReturnValue(errorBuilder);

      await expect(repository.getUserFavorites()).rejects.toThrow();
    });
  });

  describe('isFavorite', () => {
    it('returns true when favorited via RPC', async () => {
      mockBuilder = createMockBuilder(true);
      mockSupabaseClient.rpc.mockReturnValue(mockBuilder);

      const result = await repository.isFavorite({ reviewId: 'r1' });

      expect(result).toBe(true);
      expect(mockSupabaseClient.rpc).toHaveBeenCalledWith('is_review_favorite', {
        p_review_id: 'r1',
      });
    });

    it('returns false when not favorited', async () => {
      mockBuilder = createMockBuilder(false);
      mockSupabaseClient.rpc.mockReturnValue(mockBuilder);

      const result = await repository.isFavorite({ reviewId: 'r1' });

      expect(result).toBe(false);
    });

    it('throws on RPC error', async () => {
      const errorBuilder = createMockBuilder(null);
      errorBuilder.then = (onfulfilled: any) =>
        Promise.resolve({ data: null, error: { message: 'RPC error' } }).then(onfulfilled);
      mockSupabaseClient.rpc.mockReturnValue(errorBuilder);

      await expect(repository.isFavorite({ reviewId: 'r1' })).rejects.toThrow();
    });
  });

  describe('checkUserReviewForAddress', () => {
    it('returns { id } when review exists', async () => {
      mockBuilder = createMockBuilder('review-123');
      mockSupabaseClient.rpc.mockReturnValue(mockBuilder);

      const result = await repository.checkUserReviewForAddress({ osmId: 'N123' });

      expect(result).toEqual({ id: 'review-123' });
    });

    it('returns null when no review exists', async () => {
      mockBuilder = createMockBuilder(null);
      mockSupabaseClient.rpc.mockReturnValue(mockBuilder);

      const result = await repository.checkUserReviewForAddress({ osmId: 'N123' });

      expect(result).toBeNull();
    });

    it('throws on RPC error', async () => {
      const errorBuilder = createMockBuilder(null);
      errorBuilder.then = (onfulfilled: any) =>
        Promise.resolve({ data: null, error: { message: 'RPC error' } }).then(onfulfilled);
      mockSupabaseClient.rpc.mockReturnValue(errorBuilder);

      await expect(repository.checkUserReviewForAddress({ osmId: 'N123' })).rejects.toThrow();
    });
  });

  describe('hasUserReportedReview', () => {
    it('returns boolean via RPC', async () => {
      mockBuilder = createMockBuilder(true);
      mockSupabaseClient.rpc.mockReturnValue(mockBuilder);

      const result = await repository.hasUserReportedReview({ reviewId: 'r1' });

      expect(result).toBe(true);
      expect(mockSupabaseClient.rpc).toHaveBeenCalledWith('has_user_reported_review', {
        p_review_id: 'r1',
      });
    });

    it('throws on RPC error', async () => {
      const errorBuilder = createMockBuilder(null);
      errorBuilder.then = (onfulfilled: any) =>
        Promise.resolve({ data: null, error: { message: 'RPC error' } }).then(onfulfilled);
      mockSupabaseClient.rpc.mockReturnValue(errorBuilder);

      await expect(repository.hasUserReportedReview({ reviewId: 'r1' })).rejects.toThrow();
    });
  });

  describe('searchByZone', () => {
    it('returns data as-is when normalized query is empty', async () => {
      const mockResults = [{ id: 'r1', address_text: 'Some place' }];
      mockBuilder = createMockBuilder(mockResults);
      mockSupabaseClient.from.mockReturnValue(mockBuilder);

      const result = await repository.searchByZone({ query: '', limit: 10 });

      expect(result).toEqual(mockResults);
    });

    it('filters results by accent-insensitive match when results match', async () => {
      const mockResults = [
        { id: 'r1', address_text: 'Calle Corrientes 1234' },
        { id: 'r2', address_text: 'Avenida Siempre Viva' },
      ];
      mockBuilder = createMockBuilder(mockResults);
      mockSupabaseClient.from.mockReturnValue(mockBuilder);

      const result = await repository.searchByZone({ query: 'corrientes', limit: 10 });

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('r1');
    });

    it('falls back to larger query when first batch has no match', async () => {
      const firstBatch = [{ id: 'r1', address_text: 'Avenida Libertador 1000' }];
      const secondBatch = [{ id: 'r2', address_text: 'Calle Corrientes 1234' }];
      mockBuilder = createMockBuilder(firstBatch, secondBatch);
      mockSupabaseClient.from.mockReturnValue(mockBuilder);

      const result = await repository.searchByZone({ query: 'Corrientes', limit: 10 });

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('r2');
    });

    it('throws on first query error', async () => {
      const errorBuilder = createMockBuilder(null);
      errorBuilder.then = (onfulfilled: any) =>
        Promise.resolve({ data: null, error: { message: 'DB error' } }).then(onfulfilled);
      mockSupabaseClient.from.mockReturnValue(errorBuilder);

      await expect(repository.searchByZone({ query: 'test', limit: 10 })).rejects.toThrow();
    });

    it('throws on fallback query error', async () => {
      const firstBatch = [{ id: 'r1', address_text: 'Avenida Libertador 1000' }];
      const errorBuilder = createMockBuilder(firstBatch);
      let callCount = 0;
      const origThen = errorBuilder.then;
      errorBuilder.then = (onfulfilled: any) => {
        callCount++;
        if (callCount === 2) {
          return Promise.resolve({ data: null, error: { message: 'Fallback DB error' } }).then(
            onfulfilled
          );
        }
        return origThen.call(errorBuilder, onfulfilled);
      };
      mockSupabaseClient.from.mockReturnValue(errorBuilder);

      await expect(repository.searchByZone({ query: 'NoMatch', limit: 10 })).rejects.toThrow();
    });
  });

  describe('searchNearby', () => {
    it('filters by lat/lon bounds and returns data', async () => {
      const mockResults = [{ id: 'r1', latitude: -34.6, longitude: -58.4 }];
      mockBuilder = createMockBuilder(mockResults);
      mockSupabaseClient.from.mockReturnValue(mockBuilder);

      const result = await repository.searchNearby({
        lat: -34.6,
        lon: -58.4,
        radiusDeg: 0.02,
        limit: 20,
      });

      expect(result).toEqual(mockResults);
    });

    it('returns empty array when data is null', async () => {
      mockBuilder = createMockBuilder(null);
      mockSupabaseClient.from.mockReturnValue(mockBuilder);

      const result = await repository.searchNearby({ lat: -34.6, lon: -58.4 });

      expect(result).toEqual([]);
    });

    it('throws on Supabase error', async () => {
      const errorBuilder = createMockBuilder(null);
      errorBuilder.then = (onfulfilled: any) =>
        Promise.resolve({ data: null, error: { message: 'DB error' } }).then(onfulfilled);
      mockSupabaseClient.from.mockReturnValue(errorBuilder);

      await expect(repository.searchNearby({ lat: -34.6, lon: -58.4 })).rejects.toThrow();
    });
  });
});
