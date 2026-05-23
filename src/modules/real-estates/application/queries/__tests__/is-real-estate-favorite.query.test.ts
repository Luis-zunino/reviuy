import { describe, expect, it, vi } from 'vitest';
import { createIsRealEstateFavoriteQuery } from '../is-real-estate-favorite.query';
import type { RealEstateReadRepository } from '@/modules/real-estates/domain';

describe('createIsRealEstateFavoriteQuery', () => {
  it('delegates to repository', async () => {
    const input = { realEstateId: 're-123' };

    const repository: RealEstateReadRepository = {
      isFavorite: vi.fn().mockResolvedValue(true),
      getById: vi.fn(),
      getAllReviews: vi.fn(),
      getReviewById: vi.fn(),
      getReviewByUserId: vi.fn(),
      getUserVote: vi.fn(),
      getUserReviewVote: vi.fn(),
      search: vi.fn(),
      getRealEstatesWithVotesPaginated: vi.fn(),
      getUserFavorites: vi.fn(),
      hasUserReported: vi.fn(),
      hasUserReportedReview: vi.fn(),
    };

    const handler = createIsRealEstateFavoriteQuery({ repository });

    await expect(handler(input)).resolves.toBe(true);
    expect(repository.isFavorite).toHaveBeenCalledWith(input);
  });
});
