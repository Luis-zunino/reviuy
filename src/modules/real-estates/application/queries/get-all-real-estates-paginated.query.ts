import type { QueryHandler } from '@/shared/kernel/contracts';
import type {
  GetAllRealEstatesPaginatedInput,
  GetAllRealEstatesPaginatedOutput,
} from '../../domain';
import { RealEstateQueryBase } from './interfaces';

export const createGetAllRealEstatesPaginatedQuery = (
  dependencies: RealEstateQueryBase
): QueryHandler<GetAllRealEstatesPaginatedInput, GetAllRealEstatesPaginatedOutput> => {
  const { repository } = dependencies;

  return async (
    input: GetAllRealEstatesPaginatedInput
  ): Promise<GetAllRealEstatesPaginatedOutput> =>
    repository.getRealEstatesWithVotesPaginated(input);
};
