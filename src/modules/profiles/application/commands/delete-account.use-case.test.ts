import { describe, expect, it, vi } from 'vitest';
import { createDeleteAccountUseCase } from './delete-account.use-case';
import type { DeleteAccountOutput, ProfileCommandRepository } from '../../domain';

describe('createDeleteAccountUseCase', () => {
  it('rejects when the user is not authenticated', async () => {
    const profileCommandRepository: ProfileCommandRepository = {
      deleteAccount: vi.fn(),
    };

    const useCase = createDeleteAccountUseCase({
      getCurrentUserId: vi.fn().mockResolvedValue(null),
      rateLimit: vi.fn(),
      profileCommandRepository,
    });

    await expect(useCase({ lastSignInAt: new Date().toISOString() })).rejects.toMatchObject({
      code: 'UNAUTHORIZED',
    });
    expect(profileCommandRepository.deleteAccount).not.toHaveBeenCalled();
  });

  it('rejects when the last sign-in is stale', async () => {
    const rateLimit = vi.fn().mockResolvedValue(undefined);
    const profileCommandRepository: ProfileCommandRepository = {
      deleteAccount: vi.fn(),
    };

    const useCase = createDeleteAccountUseCase({
      getCurrentUserId: vi.fn().mockResolvedValue('user-1'),
      rateLimit,
      profileCommandRepository,
    });

    const staleDate = new Date(Date.now() - 31 * 60 * 1000).toISOString();

    await expect(useCase({ lastSignInAt: staleDate })).rejects.toMatchObject({
      code: 'UNAUTHORIZED',
    });
    expect(rateLimit).toHaveBeenCalledWith('delete-account:user-1', 'sensitive');
    expect(profileCommandRepository.deleteAccount).not.toHaveBeenCalled();
  });

  it('deletes the authenticated user account with a recent session', async () => {
    const expected: DeleteAccountOutput = { success: true };
    const profileCommandRepository: ProfileCommandRepository = {
      deleteAccount: vi.fn().mockResolvedValue(expected),
    };

    const useCase = createDeleteAccountUseCase({
      getCurrentUserId: vi.fn().mockResolvedValue('user-1'),
      rateLimit: vi.fn().mockResolvedValue(undefined),
      profileCommandRepository,
    });

    const lastSignInAt = new Date().toISOString();

    await expect(useCase({ lastSignInAt })).resolves.toEqual(expected);
    expect(profileCommandRepository.deleteAccount).toHaveBeenCalledWith({
      userId: 'user-1',
      lastSignInAt,
    });
  });
});
