import { describe, expect, it, vi } from 'vitest';
import { createGetCurrentUserReviewsQuery } from './get-current-user-reviews.query';
import type { ProfileReadRepository } from '../../domain';

describe('createGetCurrentUserReviewsQuery', () => {
  it('returns the current user reviews from the repository', async () => {
    const profileReadRepository: ProfileReadRepository = {
      getCurrentUserReviews: vi.fn().mockResolvedValue([{ id: 'review-1' }]),
      getCurrentUserFavoriteReviews: vi.fn(),
      getCurrentUserFavoriteRealEstates: vi.fn(),
    };

    const query = createGetCurrentUserReviewsQuery({ profileReadRepository });

    await expect(query({})).resolves.toEqual([{ id: 'review-1' }]);
    expect(profileReadRepository.getCurrentUserReviews).toHaveBeenCalledTimes(1);
  });
});
