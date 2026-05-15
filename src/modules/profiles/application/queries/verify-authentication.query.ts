import type { VoidQueryHandler } from '@/shared/kernel/contracts';
import type { ProfileAuthReadRepository, VerifyAuthenticationOutput } from '../../domain';

export interface VerifyAuthenticationQueryDependencies {
  profileAuthReadRepository: ProfileAuthReadRepository;
}

export const createVerifyAuthenticationQuery = (
  dependencies: VerifyAuthenticationQueryDependencies
): VoidQueryHandler<VerifyAuthenticationOutput> => {
  const { profileAuthReadRepository } = dependencies;

  return async (): Promise<VerifyAuthenticationOutput> => {
    return profileAuthReadRepository.verifyAuthentication();
  };
};
