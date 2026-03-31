import type { QueryHandler } from '@/shared/kernel/contracts';
import type { SearchRealEstatesInput, SearchRealEstatesOutput } from '../../domain';
import { RealEstateQueryBase } from './interfaces';

export const createSearchRealEstatesQuery = (
  dependencies: RealEstateQueryBase
): QueryHandler<SearchRealEstatesInput, SearchRealEstatesOutput> => {
  const { repository } = dependencies;

  return async (input: SearchRealEstatesInput): Promise<SearchRealEstatesOutput> => {
    return repository.search(input);
  };
};
