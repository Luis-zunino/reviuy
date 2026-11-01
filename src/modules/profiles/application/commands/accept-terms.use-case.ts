import { CURRENT_TERMS_VERSION } from '@/constants/legal-terms.constant';
import { assertAuthenticated } from '@/shared/auth/assert-authenticated.util';
import type { UseCaseHandler } from '@/shared/kernel/contracts/use-case.contract';
import type { RateLimitType } from '@/lib/redis';
import type {
  AcceptTermsCommand,
  AcceptTermsInput,
  AcceptTermsOutput,
  ProfileCommandRepository,
} from '../../domain';

export interface AcceptTermsUseCaseDependencies {
  getCurrentUserId: () => Promise<string | null>;
  rateLimit: (key: string, scope: RateLimitType) => Promise<void>;
  profileCommandRepository: ProfileCommandRepository;
}

export const createAcceptTermsUseCase = (
  dependencies: AcceptTermsUseCaseDependencies
): UseCaseHandler<AcceptTermsInput, AcceptTermsOutput> => {
  return async () => {
    const userId = await assertAuthenticated(
      dependencies.getCurrentUserId,
      'Debes iniciar sesión para aceptar los términos.'
    );

    await dependencies.rateLimit(`accept-terms:${userId}`, 'write');

    const command: AcceptTermsCommand = {
      userId,
      version: CURRENT_TERMS_VERSION,
    };

    return dependencies.profileCommandRepository.acceptTerms(command);
  };
};
