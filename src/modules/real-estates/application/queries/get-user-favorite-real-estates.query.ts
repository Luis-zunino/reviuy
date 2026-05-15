import type { VoidQueryHandler } from '@/shared/kernel/contracts';
import type { GetUserFavoriteRealEstatesOutput } from '../../domain';
import { RealEstateQueryBase } from './interfaces';

export const createGetUserFavoriteRealEstatesQuery = (
  dependencies: RealEstateQueryBase
): VoidQueryHandler<GetUserFavoriteRealEstatesOutput> => {
  const { repository } = dependencies;

  return async (): Promise<GetUserFavoriteRealEstatesOutput> => {
    return repository.getUserFavorites();
  };
};
