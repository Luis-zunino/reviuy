import { describe, expect, it, vi } from 'vitest';
import { ZodError } from 'zod';
import { createSendContactMessageUseCase } from './send-contact-message.use-case';
import type {
  AuthenticatedContactUser,
  ContentCommandRepository,
  SendContactMessageOutput,
} from '../../domain';

describe('createSendContactMessageUseCase', () => {
  const authenticatedUser: AuthenticatedContactUser = {
    id: 'user-1',
    email: 'login@example.com',
  };

  it('rejects when the user is not authenticated', async () => {
    const contentCommandRepository: ContentCommandRepository = {
      sendContactMessage: vi.fn(),
    };

    const useCase = createSendContactMessageUseCase({
      getCurrentUser: vi.fn().mockResolvedValue(null),
      rateLimit: vi.fn(),
      contentCommandRepository,
    });

    await expect(
      useCase({
        name: 'Luis',
        email: 'luis@example.com',
        message: 'Hola equipo',
      })
    ).rejects.toMatchObject({ code: 'UNAUTHORIZED' });
    expect(contentCommandRepository.sendContactMessage).not.toHaveBeenCalled();
  });

  it('rejects when the authenticated user has no email in session', async () => {
    const contentCommandRepository: ContentCommandRepository = {
      sendContactMessage: vi.fn(),
    };

    const useCase = createSendContactMessageUseCase({
      getCurrentUser: vi.fn().mockResolvedValue({ ...authenticatedUser, email: null }),
      rateLimit: vi.fn().mockResolvedValue(undefined),
      contentCommandRepository,
    });

    await expect(
      useCase({
        name: 'Luis',
        email: 'luis@example.com',
        message: 'Hola equipo',
      })
    ).rejects.toMatchObject({ code: 'INVALID_INPUT' });
    expect(contentCommandRepository.sendContactMessage).not.toHaveBeenCalled();
  });

  it('validates the payload and forwards the email payload to the repository', async () => {
    const expected: SendContactMessageOutput = { success: true };
    const contentCommandRepository: ContentCommandRepository = {
      sendContactMessage: vi.fn().mockResolvedValue(expected),
    };
    const rateLimit = vi.fn().mockResolvedValue(undefined);

    const useCase = createSendContactMessageUseCase({
      getCurrentUser: vi.fn().mockResolvedValue(authenticatedUser),
      rateLimit,
      contentCommandRepository,
    });

    const input = {
      name: 'Luis',
      email: 'public@example.com',
      message: 'Quiero reportar un problema en la plataforma.',
    };

    await expect(useCase(input)).resolves.toEqual(expected);
    expect(rateLimit).toHaveBeenCalledWith('api-contact:user-1', 'sensitive');
    expect(contentCommandRepository.sendContactMessage).toHaveBeenCalledWith({
      ...input,
      loginEmail: 'login@example.com',
      replyTo: 'login@example.com',
    });
  });

  it('throws a zod error when the payload is invalid', async () => {
    const contentCommandRepository: ContentCommandRepository = {
      sendContactMessage: vi.fn(),
    };

    const useCase = createSendContactMessageUseCase({
      getCurrentUser: vi.fn().mockResolvedValue(authenticatedUser),
      rateLimit: vi.fn().mockResolvedValue(undefined),
      contentCommandRepository,
    });

    await expect(
      useCase({
        name: '',
        email: 'invalid-email',
        message: '',
      })
    ).rejects.toBeInstanceOf(ZodError);
    expect(contentCommandRepository.sendContactMessage).not.toHaveBeenCalled();
  });
});
