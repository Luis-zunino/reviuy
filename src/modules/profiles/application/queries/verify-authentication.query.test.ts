import { describe, expect, it, vi } from 'vitest';
import { createVerifyAuthenticationQuery } from './verify-authentication.query';
import type { ProfileAuthReadRepository, VerifyAuthenticationOutput } from '../../domain';

describe('createVerifyAuthenticationQuery', () => {
  it('returns the authentication status from the repository', async () => {
    const expected: VerifyAuthenticationOutput = {
      userId: 'user-1',
      error: null,
    };

    const profileAuthReadRepository: ProfileAuthReadRepository = {
      getSession: vi.fn(),
      verifyAuthentication: vi.fn().mockResolvedValue(expected),
    };

    const handler = createVerifyAuthenticationQuery({ profileAuthReadRepository });

    await expect(handler({})).resolves.toEqual(expected);
    expect(profileAuthReadRepository.verifyAuthentication).toHaveBeenCalledTimes(1);
  });
});
