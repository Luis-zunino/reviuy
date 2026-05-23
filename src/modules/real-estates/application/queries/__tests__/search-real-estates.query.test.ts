import { describe, expect, it, vi } from 'vitest';
import { createSearchRealEstatesQuery } from '../search-real-estates.query';
import type { RealEstateReadRepository } from '@/modules/real-estates/domain';

describe('createSearchRealEstatesQuery', () => {
  it('delegates to repository', async () => {
    const expected = [{ id: 're-123', name: 'Test Agency' }];
    const input = { query: 'test', limit: 5 };

    const repository: RealEstateReadRepository = {
      search: vi.fn().mockResolvedValue(expected),
      getById: vi.fn(),
      getAllReviews: vi.fn(),
      getReviewById: vi.fn(),
      getReviewByUserId: vi.fn(),
      getUserVote: vi.fn(),
      getUserReviewVote: vi.fn(),
      getRealEstatesWithVotesPaginated: vi.fn(),
      getUserFavorites: vi.fn(),
      isFavorite: vi.fn(),
      hasUserReported: vi.fn(),
      hasUserReportedReview: vi.fn(),
    };

    const handler = createSearchRealEstatesQuery({ repository });

    await expect(handler(input)).resolves.toEqual(expected);
    expect(repository.search).toHaveBeenCalledWith(input);
  });
});
