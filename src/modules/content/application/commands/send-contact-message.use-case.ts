import { createError } from '@/lib/errors';
import { contactApiSchema } from '@/schemas/api-request.schema';
import type { UseCaseHandler } from '@/shared/kernel/contracts';
import type {
  AuthenticatedContactUser,
  ContentCommandRepository,
  SendContactMessageInput,
  SendContactMessageOutput,
} from '../../domain';
import { RateLimitType } from '@/lib';

export interface SendContactMessageUseCaseDependencies {
  getCurrentUser: () => Promise<AuthenticatedContactUser | null>;
  rateLimit: (key: string, scope: RateLimitType) => Promise<void>;
  contentCommandRepository: ContentCommandRepository;
}

export const createSendContactMessageUseCase = (
  dependencies: SendContactMessageUseCaseDependencies
): UseCaseHandler<unknown, SendContactMessageOutput> => {
  return async (input) => {
    const user = await dependencies.getCurrentUser();

    if (!user) {
      throw createError('UNAUTHORIZED', 'No autorizado');
    }

    await dependencies.rateLimit(`api-contact:${user.id}`, 'sensitive');

    const payload = contactApiSchema.parse(input) as SendContactMessageInput;

    if (!user.email) {
      throw createError('INVALID_INPUT', 'El email de sesión no se encontró');
    }

    return dependencies.contentCommandRepository.sendContactMessage({
      ...payload,
      loginEmail: user.email,
      replyTo: user.email,
    });
  };
};
