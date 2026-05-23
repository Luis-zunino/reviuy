import { describe, expect, it, vi } from 'vitest';
import { createGetCurrentUserSummaryQuery } from '../get-current-user-summary.query';
import type { ProfileReadRepository } from '../../../domain';

describe('createGetCurrentUserSummaryQuery', () => {
  it('returns the aggregated summary with all 3 data arrays and correct stats', async () => {
    const reviews = [{ id: 'review-1' }, { id: 'review-2' }];
    const favoriteReviews = [{ id: 'fav-review-1' }];
    const favoriteRealEstates = [{ id: 're-1' }, { id: 're-2' }, { id: 're-3' }];

    const repository: ProfileReadRepository = {
      getCurrentUserReviews: vi.fn().mockResolvedValue(reviews),
      getCurrentUserFavoriteReviews: vi.fn().mockResolvedValue(favoriteReviews),
      getCurrentUserFavoriteRealEstates: vi.fn().mockResolvedValue(favoriteRealEstates),
    } as any;

    const handler = createGetCurrentUserSummaryQuery({ profileReadRepository: repository });

    await expect(handler()).resolves.toEqual({
      reviews,
      favoriteReviews,
      favoriteRealEstates,
      stats: {
        reviewsCount: 2,
        favoriteReviewsCount: 1,
        favoriteRealEstatesCount: 3,
      },
    });

    expect(repository.getCurrentUserReviews).toHaveBeenCalledTimes(1);
    expect(repository.getCurrentUserFavoriteReviews).toHaveBeenCalledTimes(1);
    expect(repository.getCurrentUserFavoriteRealEstates).toHaveBeenCalledTimes(1);
  });

  it('handles null reviews (reviewsCount should be 0)', async () => {
    const repository: ProfileReadRepository = {
      getCurrentUserReviews: vi.fn().mockResolvedValue(null),
      getCurrentUserFavoriteReviews: vi.fn().mockResolvedValue([]),
      getCurrentUserFavoriteRealEstates: vi.fn().mockResolvedValue([]),
    } as any;

    const handler = createGetCurrentUserSummaryQuery({ profileReadRepository: repository });
    const result = await handler();

    expect(result.reviews).toBeNull();
    expect(result.stats.reviewsCount).toBe(0);
    expect(result.stats.favoriteReviewsCount).toBe(0);
    expect(result.stats.favoriteRealEstatesCount).toBe(0);
  });
});
