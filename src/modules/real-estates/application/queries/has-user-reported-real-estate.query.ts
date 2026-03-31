import type { QueryHandler } from '@/shared/kernel/contracts';
import type { HasUserReportedRealEstateInput } from '../../domain';
import { RealEstateQueryBase } from './interfaces';

export const createHasUserReportedRealEstateQuery = (
  dependencies: RealEstateQueryBase
): QueryHandler<HasUserReportedRealEstateInput, boolean> => {
  const { repository } = dependencies;

  return async (input: HasUserReportedRealEstateInput): Promise<boolean> => {
    return repository.hasUserReported(input);
  };
};
