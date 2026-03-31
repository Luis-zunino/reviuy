import type { QueryHandler } from '@/shared/kernel/contracts';
import type { GetSessionOutput, ProfileAuthReadRepository } from '../../domain';

export interface GetSessionQueryDependencies {
  profileAuthReadRepository: ProfileAuthReadRepository;
}

export const createGetSessionQuery = (
  dependencies: GetSessionQueryDependencies
): QueryHandler<Record<string, never>, GetSessionOutput> => {
  const { profileAuthReadRepository } = dependencies;

  return async (): Promise<GetSessionOutput> => profileAuthReadRepository.getSession();
};
