import { describe, expect, it, vi } from 'vitest';
import { createGetCurrentUserFavoriteRealEstatesQuery } from './get-current-user-favorite-real-estates.query';
import type { ProfileReadRepository } from '../../domain';

describe('createGetCurrentUserFavoriteRealEstatesQuery', () => {
  it('returns the current user favorite real estates from the repository', async () => {
    const profileReadRepository: ProfileReadRepository = {
      getCurrentUserReviews: vi.fn(),
      getCurrentUserFavoriteReviews: vi.fn(),
      getCurrentUserFavoriteRealEstates: vi.fn().mockResolvedValue([{ id: 'real-estate-1' }]),
    };

    const query = createGetCurrentUserFavoriteRealEstatesQuery({ profileReadRepository });

    await expect(query({})).resolves.toEqual([{ id: 'real-estate-1' }]);
    expect(profileReadRepository.getCurrentUserFavoriteRealEstates).toHaveBeenCalledTimes(1);
  });
});
