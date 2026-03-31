import type { QueryHandler } from '@/shared/kernel/contracts';
import type { IsRealEstateFavoriteInput } from '../../domain';
import { RealEstateQueryBase } from './interfaces';

export const createIsRealEstateFavoriteQuery = (
  dependencies: RealEstateQueryBase
): QueryHandler<IsRealEstateFavoriteInput, boolean> => {
  const { repository } = dependencies;

  return async (input: IsRealEstateFavoriteInput): Promise<boolean> => {
    return repository.isFavorite(input);
  };
};
