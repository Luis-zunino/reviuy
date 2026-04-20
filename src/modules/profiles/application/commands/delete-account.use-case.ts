import { createError } from '@/lib/errors';
import type { UseCaseHandler } from '@/shared/kernel/contracts';
import type {
  DeleteAccountCommand,
  DeleteAccountInput,
  DeleteAccountOutput,
  ProfileCommandRepository,
} from '../../domain';
import { RateLimitType } from '@/lib';

const MAX_SESSION_AGE_MS = 30 * 60 * 1000;

export interface DeleteAccountUseCaseDependencies {
  getCurrentUserId: () => Promise<string | null>;
  rateLimit: (key: string, scope: RateLimitType) => Promise<void>;
  profileCommandRepository: ProfileCommandRepository;
}

export const createDeleteAccountUseCase = (
  dependencies: DeleteAccountUseCaseDependencies
): UseCaseHandler<DeleteAccountInput, DeleteAccountOutput> => {
  return async (input) => {
    const userId = await dependencies.getCurrentUserId();

    if (!userId) {
      throw createError('UNAUTHORIZED', 'Debes iniciar sesión para eliminar tu cuenta.');
    }

    await dependencies.rateLimit(`delete-account:${userId}`, 'sensitive');

    const lastSignInAt = input.lastSignInAt ? new Date(input.lastSignInAt) : null;
    const hasRecentSession =
      lastSignInAt instanceof Date &&
      !Number.isNaN(lastSignInAt.getTime()) &&
      Date.now() - lastSignInAt.getTime() <= MAX_SESSION_AGE_MS;

    if (!hasRecentSession) {
      throw createError(
        'UNAUTHORIZED',
        'Por seguridad, vuelve a iniciar sesión y reintenta eliminar tu cuenta.'
      );
    }

    const command: DeleteAccountCommand = {
      userId,
      lastSignInAt: input.lastSignInAt,
    };

    return dependencies.profileCommandRepository.deleteAccount(command);
  };
};
