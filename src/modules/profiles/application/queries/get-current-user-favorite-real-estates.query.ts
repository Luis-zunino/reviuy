import type { VoidQueryHandler } from '@/shared/kernel/contracts/query.contract';
import type { GetCurrentUserFavoriteRealEstatesOutput, ProfileReadRepository } from '../../domain';

export interface GetCurrentUserFavoriteRealEstatesQueryDependencies {
  profileReadRepository: ProfileReadRepository;
}

export const createGetCurrentUserFavoriteRealEstatesQuery = (
  dependencies: GetCurrentUserFavoriteRealEstatesQueryDependencies
): VoidQueryHandler<GetCurrentUserFavoriteRealEstatesOutput> => {
  const { profileReadRepository } = dependencies;

  return async (): Promise<GetCurrentUserFavoriteRealEstatesOutput> => {
    return profileReadRepository.getCurrentUserFavoriteRealEstates();
  };
};
