import type { QueryHandler } from '@/shared/kernel/contracts';
import type { ProfileAuthReadRepository, VerifyAuthenticationOutput } from '../../domain';

export interface VerifyAuthenticationQueryDependencies {
  profileAuthReadRepository: ProfileAuthReadRepository;
}

export const createVerifyAuthenticationQuery = (
  dependencies: VerifyAuthenticationQueryDependencies
): QueryHandler<Record<string, never>, VerifyAuthenticationOutput> => {
  const { profileAuthReadRepository } = dependencies;

  return async (): Promise<VerifyAuthenticationOutput> => {
    return profileAuthReadRepository.verifyAuthentication();
  };
};
