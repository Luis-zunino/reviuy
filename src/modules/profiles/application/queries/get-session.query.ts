import type { VoidQueryHandler } from '@/shared/kernel/contracts/query.contract';
import type { GetSessionOutput, ProfileAuthReadRepository } from '../../domain';

export interface GetSessionQueryDependencies {
  profileAuthReadRepository: ProfileAuthReadRepository;
}

export const createGetSessionQuery = (
  dependencies: GetSessionQueryDependencies
): VoidQueryHandler<GetSessionOutput> => {
  const { profileAuthReadRepository } = dependencies;

  return async (): Promise<GetSessionOutput> => profileAuthReadRepository.getSession();
};
