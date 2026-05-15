import { describe, expect, it, vi } from 'vitest';
import { createGetCurrentUserFavoriteReviewsQuery } from './get-current-user-favorite-reviews.query';
import type { ProfileReadRepository } from '../../domain';

describe('createGetCurrentUserFavoriteReviewsQuery', () => {
  it('returns the current user favorite reviews from the repository', async () => {
    const profileReadRepository: ProfileReadRepository = {
      getCurrentUserReviews: vi.fn(),
      getCurrentUserFavoriteReviews: vi.fn().mockResolvedValue([{ id: 'review-1' }]),
      getCurrentUserFavoriteRealEstates: vi.fn(),
    };

    const query = createGetCurrentUserFavoriteReviewsQuery({ profileReadRepository });

    await expect(query({})).resolves.toEqual([{ id: 'review-1' }]);
    expect(profileReadRepository.getCurrentUserFavoriteReviews).toHaveBeenCalledTimes(1);
  });
});
