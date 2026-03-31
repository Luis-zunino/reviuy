import type { QueryHandler } from '@/shared/kernel/contracts';
import type { GetUserFavoriteRealEstatesOutput } from '../../domain';
import { RealEstateQueryBase } from './interfaces';

export const createGetUserFavoriteRealEstatesQuery = (
  dependencies: RealEstateQueryBase
): QueryHandler<Record<string, never>, GetUserFavoriteRealEstatesOutput> => {
  const { repository } = dependencies;

  return async (): Promise<GetUserFavoriteRealEstatesOutput> => {
    return repository.getUserFavorites();
  };
};
