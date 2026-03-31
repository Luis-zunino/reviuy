import type { QueryHandler } from '@/shared/kernel/contracts';
import type { GetRealEstateByIdInput, GetRealEstateByIdOutput } from '../../domain';
import { RealEstateQueryBase } from './interfaces';

export const createGetRealEstateByIdQuery = (
  dependencies: RealEstateQueryBase
): QueryHandler<GetRealEstateByIdInput, GetRealEstateByIdOutput> => {
  const { repository } = dependencies;

  return async (input: GetRealEstateByIdInput): Promise<GetRealEstateByIdOutput> => {
    return repository.getById(input);
  };
};
