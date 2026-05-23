import { describe, expect, it, vi } from 'vitest';
import { createGetUserFavoriteRealEstatesQuery } from '../get-user-favorite-real-estates.query';
import type { RealEstateReadRepository } from '@/modules/real-estates/domain';

describe('createGetUserFavoriteRealEstatesQuery', () => {
  it('delegates to repository', async () => {
    const expected = [{ id: 're-123', name: 'Test Agency' }];

    const repository: RealEstateReadRepository = {
      getUserFavorites: vi.fn().mockResolvedValue(expected),
      getById: vi.fn(),
      getAllReviews: vi.fn(),
      getReviewById: vi.fn(),
      getReviewByUserId: vi.fn(),
      getUserVote: vi.fn(),
      getUserReviewVote: vi.fn(),
      search: vi.fn(),
      getRealEstatesWithVotesPaginated: vi.fn(),
      isFavorite: vi.fn(),
      hasUserReported: vi.fn(),
      hasUserReportedReview: vi.fn(),
    };

    const handler = createGetUserFavoriteRealEstatesQuery({ repository });

    await expect(handler()).resolves.toEqual(expected);
    expect(repository.getUserFavorites).toHaveBeenCalled();
  });
});
