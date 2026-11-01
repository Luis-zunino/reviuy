import { describe, expect, it, vi } from 'vitest';
import { createAcceptTermsUseCase } from '../accept-terms.use-case';
import { CURRENT_TERMS_VERSION } from '@/constants/legal-terms.constant';
import type { AcceptTermsOutput, ProfileCommandRepository } from '../../../domain';

const buildRepository = (
  acceptTerms: ProfileCommandRepository['acceptTerms']
): ProfileCommandRepository => ({
  deleteAccount: vi.fn(),
  acceptTerms,
});

describe('createAcceptTermsUseCase', () => {
  it('rejects when the user is not authenticated', async () => {
    const profileCommandRepository = buildRepository(vi.fn());

    const useCase = createAcceptTermsUseCase({
      getCurrentUserId: vi.fn().mockResolvedValue(null),
      rateLimit: vi.fn(),
      profileCommandRepository,
    });

    await expect(useCase({})).rejects.toMatchObject({ code: 'UNAUTHORIZED' });
    expect(profileCommandRepository.acceptTerms).not.toHaveBeenCalled();
  });

  it('applies the rate limit before accepting', async () => {
    const acceptTerms = vi.fn().mockResolvedValue({ success: true });
    const rateLimit = vi.fn().mockResolvedValue(undefined);
    const useCase = createAcceptTermsUseCase({
      getCurrentUserId: vi.fn().mockResolvedValue('user-1'),
      rateLimit,
      profileCommandRepository: buildRepository(acceptTerms),
    });

    await useCase({});

    expect(rateLimit).toHaveBeenCalledWith('accept-terms:user-1', 'write');
  });

  it('accepts the current terms version for the authenticated user', async () => {
    const expected: AcceptTermsOutput = { success: true };
    const acceptTerms = vi.fn().mockResolvedValue(expected);
    const useCase = createAcceptTermsUseCase({
      getCurrentUserId: vi.fn().mockResolvedValue('user-1'),
      rateLimit: vi.fn().mockResolvedValue(undefined),
      profileCommandRepository: buildRepository(acceptTerms),
    });

    await expect(useCase({})).resolves.toEqual(expected);
    expect(acceptTerms).toHaveBeenCalledWith({
      userId: 'user-1',
      version: CURRENT_TERMS_VERSION,
    });
  });
});
