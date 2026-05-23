import { describe, expect, it, vi } from 'vitest';
import { createGetAllRealEstateReviewsQuery } from '../get-all-real-estate-reviews.query';
import type { RealEstateReadRepository } from '@/modules/real-estates/domain';

describe('createGetAllRealEstateReviewsQuery', () => {
  it('delegates to repository', async () => {
    const expected = { reviews: [], total: 0 };
    const input = { id: 're-123', limit: 10 };

    const repository: RealEstateReadRepository = {
      getAllReviews: vi.fn().mockResolvedValue(expected),
      getById: vi.fn(),
      getReviewById: vi.fn(),
      getReviewByUserId: vi.fn(),
      getUserVote: vi.fn(),
      getUserReviewVote: vi.fn(),
      search: vi.fn(),
      getRealEstatesWithVotesPaginated: vi.fn(),
      getUserFavorites: vi.fn(),
      isFavorite: vi.fn(),
      hasUserReported: vi.fn(),
      hasUserReportedReview: vi.fn(),
    };

    const handler = createGetAllRealEstateReviewsQuery({ repository });

    await expect(handler(input)).resolves.toEqual(expected);
    expect(repository.getAllReviews).toHaveBeenCalledWith(input);
  });
});
