import { describe, expect, it, vi, beforeEach } from 'vitest';
import { SupabaseRealEstateReadRepository } from '../supabase-real-estate-read.repository';

const mockSupabaseClient = vi.hoisted(() => ({ from: vi.fn(), rpc: vi.fn() } as any));
vi.mock('@/lib/supabase/client', () => ({ supabaseClient: mockSupabaseClient }));

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
      Promise.resolve(resolveSequence[Math.min(callIndex++, resolveSequence.length - 1)]).then(onfulfilled),
  };

  return chainable;
};

describe('SupabaseRealEstateReadRepository', () => {
  let repository: SupabaseRealEstateReadRepository;
  let mockBuilder: ReturnType<typeof createMockBuilder>;

  beforeEach(() => {
    mockBuilder = createMockBuilder(null);
    mockSupabaseClient.from.mockReturnValue(mockBuilder);
    mockSupabaseClient.rpc.mockReturnValue(mockBuilder);
    mockSupabaseClient.auth = {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null }),
    };
    repository = new SupabaseRealEstateReadRepository(mockSupabaseClient);
  });

  describe('getById', () => {
    const mockRealEstate = { id: 're-1', name: 'Test Building', rating: 4.5 };

    it('returns a real estate by id', async () => {
      mockBuilder = createMockBuilder(mockRealEstate);
      mockSupabaseClient.from.mockReturnValue(mockBuilder);

      const result = await repository.getById({ id: 're-1' });

      expect(result).toEqual(mockRealEstate);
    });

    it('throws on error', async () => {
      const errorBuilder = createMockBuilder(null);
      errorBuilder.then = (onfulfilled: any) => Promise.resolve({ data: null, error: { message: 'Not found' } }).then(onfulfilled);
      mockSupabaseClient.from.mockReturnValue(errorBuilder);

      await expect(repository.getById({ id: 'nonexistent' })).rejects.toThrow();
    });
  });

  describe('getAllReviews', () => {
    const mockReviews = [{ id: 'rev-1', title: 'Good', real_estate_id: 're-1' }];

    it('returns reviews for a real estate', async () => {
      mockBuilder = createMockBuilder(mockReviews);
      mockSupabaseClient.from.mockReturnValue(mockBuilder);

      const result = await repository.getAllReviews({ id: 're-1' });

      expect(result).toEqual(mockReviews);
    });

    it('applies limit when provided', async () => {
      mockBuilder = createMockBuilder(mockReviews);
      mockSupabaseClient.from.mockReturnValue(mockBuilder);

      await repository.getAllReviews({ id: 're-1', limit: 5 });

      expect(mockBuilder.limit).toHaveBeenCalledWith(5);
    });

    it('returns empty array when data is null', async () => {
      mockBuilder = createMockBuilder(null);
      mockSupabaseClient.from.mockReturnValue(mockBuilder);

      const result = await repository.getAllReviews({ id: 're-1' });

      expect(result).toEqual([]);
    });

    it('throws on Supabase error', async () => {
      const errorBuilder = createMockBuilder(null);
      errorBuilder.then = (onfulfilled: any) => Promise.resolve({ data: null, error: { message: 'DB error' } }).then(onfulfilled);
      mockSupabaseClient.from.mockReturnValue(errorBuilder);

      await expect(repository.getAllReviews({ id: 're-1' })).rejects.toThrow();
    });
  });

  describe('getReviewById', () => {
    const mockReview = { id: 'rev-1', title: 'Detailed review' };

    it('returns the review when found', async () => {
      mockBuilder = createMockBuilder(mockReview);
      mockSupabaseClient.from.mockReturnValue(mockBuilder);

      const result = await repository.getReviewById({ reviewId: 'rev-1' });

      expect(result).toEqual(mockReview);
    });

    it('returns null via maybeSingle when not found', async () => {
      mockBuilder = createMockBuilder(null);
      mockSupabaseClient.from.mockReturnValue(mockBuilder);

      const result = await repository.getReviewById({ reviewId: 'nonexistent' });

      expect(result).toBeNull();
    });

    it('throws on Supabase error', async () => {
      const errorBuilder = createMockBuilder(null);
      errorBuilder.then = (onfulfilled: any) => Promise.resolve({ data: null, error: { message: 'DB error' } }).then(onfulfilled);
      mockSupabaseClient.from.mockReturnValue(errorBuilder);

      await expect(repository.getReviewById({ reviewId: 'rev-1' })).rejects.toThrow();
    });
  });

  describe('getReviewByUserId', () => {
    const mockData = [{ id: 'rev-1' }];

    it('returns first review via RPC', async () => {
      mockBuilder = createMockBuilder(mockData);
      mockSupabaseClient.rpc.mockReturnValue(mockBuilder);

      const result = await repository.getReviewByUserId({ realEstateId: 're-1' });

      expect(result).toEqual({ id: 'rev-1' });
      expect(mockSupabaseClient.rpc).toHaveBeenCalledWith('get_real_estate_review_by_user', { p_real_estate_id: 're-1' });
    });

    it('returns null when RPC returns empty', async () => {
      mockBuilder = createMockBuilder([]);
      mockSupabaseClient.rpc.mockReturnValue(mockBuilder);

      const result = await repository.getReviewByUserId({ realEstateId: 're-1' });

      expect(result).toBeNull();
    });

    it('throws on RPC error', async () => {
      const errorBuilder = createMockBuilder(null);
      errorBuilder.then = (onfulfilled: any) => Promise.resolve({ data: null, error: { message: 'RPC error' } }).then(onfulfilled);
      mockSupabaseClient.rpc.mockReturnValue(errorBuilder);

      await expect(repository.getReviewByUserId({ realEstateId: 're-1' })).rejects.toThrow();
    });
  });

  describe('getUserVote', () => {
    const mockVote = { vote_type: 'up' };

    it('returns user vote via RPC', async () => {
      mockBuilder = createMockBuilder(mockVote);
      mockSupabaseClient.rpc.mockReturnValue(mockBuilder);

      const result = await repository.getUserVote({ realEstateId: 're-1' });

      expect(result).toEqual(mockVote);
    });

    it('throws on RPC error', async () => {
      const errorBuilder = createMockBuilder(null);
      errorBuilder.then = (onfulfilled: any) => Promise.resolve({ data: null, error: { message: 'RPC error' } }).then(onfulfilled);
      mockSupabaseClient.rpc.mockReturnValue(errorBuilder);

      await expect(repository.getUserVote({ realEstateId: 're-1' })).rejects.toThrow();
    });
  });

  describe('getUserReviewVote', () => {
    const mockVote = { vote_type: 'down' };

    it('returns user review vote via RPC', async () => {
      mockBuilder = createMockBuilder(mockVote);
      mockSupabaseClient.rpc.mockReturnValue(mockBuilder);

      const result = await repository.getUserReviewVote({ reviewId: 'rev-1' });

      expect(result).toEqual(mockVote);
    });

    it('throws on RPC error', async () => {
      const errorBuilder = createMockBuilder(null);
      errorBuilder.then = (onfulfilled: any) => Promise.resolve({ data: null, error: { message: 'RPC error' } }).then(onfulfilled);
      mockSupabaseClient.rpc.mockReturnValue(errorBuilder);

      await expect(repository.getUserReviewVote({ reviewId: 'rev-1' })).rejects.toThrow();
    });
  });

  describe('search', () => {
    const mockResults = [{ id: 're-1', name: 'Test Building' }];

    it('returns results for valid query', async () => {
      mockBuilder = createMockBuilder(mockResults);
      mockSupabaseClient.from.mockReturnValue(mockBuilder);

      const result = await repository.search({ query: 'Test', limit: 10 });

      expect(result).toEqual(mockResults);
    });

    it('returns empty array for short query', async () => {
      const result = await repository.search({ query: 'ab' });

      expect(result).toEqual([]);
    });

    it('throws on error', async () => {
      const errorBuilder = createMockBuilder(null);
      errorBuilder.then = (onfulfilled: any) => Promise.resolve({ data: null, error: { message: 'Search failed' } }).then(onfulfilled);
      mockSupabaseClient.from.mockReturnValue(errorBuilder);

      await expect(repository.search({ query: 'Test', limit: 10 })).rejects.toThrow();
    });
  });

  describe('getRealEstatesWithVotesPaginated', () => {
    const mockData = [{ id: 're-1', name: 'A' }, { id: 're-2', name: 'B' }];

    it('returns paginated results with nextOffset when items >= limit', async () => {
      const tenItems = Array.from({ length: 10 }, (_, i) => ({ id: `re-${i}`, name: `Item ${i}` }));
      mockBuilder = createMockBuilder(tenItems);
      mockSupabaseClient.from.mockReturnValue(mockBuilder);

      const result = await repository.getRealEstatesWithVotesPaginated({ limit: 10, offset: 0 });

      expect(result.data).toHaveLength(10);
      expect(result.nextOffset).toBe(10);
    });

    it('returns null nextOffset when fewer items than limit', async () => {
      mockBuilder = createMockBuilder(mockData);
      mockSupabaseClient.from.mockReturnValue(mockBuilder);

      const result = await repository.getRealEstatesWithVotesPaginated({ limit: 10, offset: 0 });

      expect(result.nextOffset).toBeNull();
    });

    it('applies search filter when query is 3+ chars', async () => {
      mockBuilder = createMockBuilder(mockData);
      mockSupabaseClient.from.mockReturnValue(mockBuilder);

      await repository.getRealEstatesWithVotesPaginated({ limit: 10, offset: 0, search: 'Test' });

      expect(mockBuilder.ilike).toHaveBeenCalledWith('name', '%Test%');
    });

    it('applies rating filter when provided', async () => {
      mockBuilder = createMockBuilder(mockData);
      mockSupabaseClient.from.mockReturnValue(mockBuilder);

      await repository.getRealEstatesWithVotesPaginated({ limit: 10, offset: 0, rating: 4 });

      expect(mockBuilder.gte).toHaveBeenCalledWith('rating', 4);
    });

    it('does not apply filters for short search', async () => {
      mockBuilder = createMockBuilder(mockData);
      mockSupabaseClient.from.mockReturnValue(mockBuilder);

      await repository.getRealEstatesWithVotesPaginated({ limit: 10, offset: 0, search: 'ab' });

      expect(mockBuilder.ilike).not.toHaveBeenCalled();
    });

    it('throws on Supabase error', async () => {
      const errorBuilder = createMockBuilder(null);
      errorBuilder.then = (onfulfilled: any) => Promise.resolve({ data: null, error: { message: 'DB error' } }).then(onfulfilled);
      mockSupabaseClient.from.mockReturnValue(errorBuilder);

      await expect(repository.getRealEstatesWithVotesPaginated({ limit: 10, offset: 0 })).rejects.toThrow();
    });
  });

  describe('getUserFavorites', () => {
    const mockFavorites = [
      { real_estate_id: 're-1', real_estates: { id: 're-1', name: 'Fav 1' } },
      { real_estate_id: 're-2', real_estates: { id: 're-2', name: 'Fav 2' } },
    ];

    it('returns favorite real estates for authenticated user', async () => {
      mockBuilder = createMockBuilder(mockFavorites);
      mockSupabaseClient.from.mockReturnValue(mockBuilder);

      const result = await repository.getUserFavorites();

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Fav 1');
    });

    it('throws UNAUTHORIZED when no user', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({ data: { user: null }, error: null });

      await expect(repository.getUserFavorites()).rejects.toThrow('Usuario no autenticado');
    });

    it('filters out null real_estates', async () => {
      const mixedFavorites = [
        { real_estate_id: 're-1', real_estates: { id: 're-1', name: 'Exists' } },
        { real_estate_id: 're-2', real_estates: null },
      ];
      mockBuilder = createMockBuilder(mixedFavorites);
      mockSupabaseClient.from.mockReturnValue(mockBuilder);

      const result = await repository.getUserFavorites();

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Exists');
    });

    it('throws on Supabase select error', async () => {
      const errorBuilder = createMockBuilder(null);
      errorBuilder.then = (onfulfilled: any) => Promise.resolve({ data: null, error: { message: 'DB error' } }).then(onfulfilled);
      mockSupabaseClient.from.mockReturnValue(errorBuilder);

      await expect(repository.getUserFavorites()).rejects.toThrow();
    });
  });

  describe('isFavorite', () => {
    it('returns true via RPC', async () => {
      mockBuilder = createMockBuilder(true);
      mockSupabaseClient.rpc.mockReturnValue(mockBuilder);

      const result = await repository.isFavorite({ realEstateId: 're-1' });

      expect(result).toBe(true);
    });

    it('returns false via RPC', async () => {
      mockBuilder = createMockBuilder(false);
      mockSupabaseClient.rpc.mockReturnValue(mockBuilder);

      const result = await repository.isFavorite({ realEstateId: 're-1' });

      expect(result).toBe(false);
    });

    it('throws on RPC error', async () => {
      const errorBuilder = createMockBuilder(null);
      errorBuilder.then = (onfulfilled: any) => Promise.resolve({ data: null, error: { message: 'RPC error' } }).then(onfulfilled);
      mockSupabaseClient.rpc.mockReturnValue(errorBuilder);

      await expect(repository.isFavorite({ realEstateId: 're-1' })).rejects.toThrow();
    });
  });

  describe('hasUserReported', () => {
    it('returns true via RPC', async () => {
      mockBuilder = createMockBuilder(true);
      mockSupabaseClient.rpc.mockReturnValue(mockBuilder);

      const result = await repository.hasUserReported({ realEstateId: 're-1' });

      expect(result).toBe(true);
    });

    it('returns false when realEstateId is falsy', async () => {
      const result = await repository.hasUserReported({ realEstateId: '' });

      expect(result).toBe(false);
    });

    it('throws on RPC error', async () => {
      const errorBuilder = createMockBuilder(null);
      errorBuilder.then = (onfulfilled: any) => Promise.resolve({ data: null, error: { message: 'RPC error' } }).then(onfulfilled);
      mockSupabaseClient.rpc.mockReturnValue(errorBuilder);

      await expect(repository.hasUserReported({ realEstateId: 're-1' })).rejects.toThrow();
    });
  });

  describe('hasUserReportedReview', () => {
    it('returns boolean via RPC', async () => {
      mockBuilder = createMockBuilder(true);
      mockSupabaseClient.rpc.mockReturnValue(mockBuilder);

      const result = await repository.hasUserReportedReview({ reviewId: 'rev-1' });

      expect(result).toBe(true);
    });

    it('throws on RPC error', async () => {
      const errorBuilder = createMockBuilder(null);
      errorBuilder.then = (onfulfilled: any) => Promise.resolve({ data: null, error: { message: 'RPC error' } }).then(onfulfilled);
      mockSupabaseClient.rpc.mockReturnValue(errorBuilder);

      await expect(repository.hasUserReportedReview({ reviewId: 'rev-1' })).rejects.toThrow();
    });
  });
});
