import { describe, expect, it, vi } from 'vitest';
import { createGetAllRealEstatesPaginatedQuery } from '../get-all-real-estates-paginated.query';
import type { RealEstateReadRepository } from '@/modules/real-estates/domain';

describe('createGetAllRealEstatesPaginatedQuery', () => {
  it('delegates to repository', async () => {
    const expected = { data: [], total: 0, page: 1, limit: 10 };
    const input = { page: 1, limit: 10 };

    const repository: RealEstateReadRepository = {
      getRealEstatesWithVotesPaginated: vi.fn().mockResolvedValue(expected),
      getById: vi.fn(),
      getAllReviews: vi.fn(),
      getReviewById: vi.fn(),
      getReviewByUserId: vi.fn(),
      getUserVote: vi.fn(),
      getUserReviewVote: vi.fn(),
      search: vi.fn(),
      getUserFavorites: vi.fn(),
      isFavorite: vi.fn(),
      hasUserReported: vi.fn(),
      hasUserReportedReview: vi.fn(),
    };

    const handler = createGetAllRealEstatesPaginatedQuery({ repository });

    await expect(handler(input)).resolves.toEqual(expected);
    expect(repository.getRealEstatesWithVotesPaginated).toHaveBeenCalledWith(input);
  });
});
