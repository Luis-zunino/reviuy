import { describe, expect, it, vi } from 'vitest';
import { createGetSessionQuery } from './get-session.query';
import type { GetSessionOutput, ProfileAuthReadRepository } from '../../domain';

describe('createGetSessionQuery', () => {
  it('returns the current session from the repository', async () => {
    const expected: GetSessionOutput = {
      session: {
        userId: 'user-1',
        expiresAt: 123456,
      },
      error: null,
    };

    const profileAuthReadRepository: ProfileAuthReadRepository = {
      getSession: vi.fn().mockResolvedValue(expected),
      verifyAuthentication: vi.fn(),
    };

    const handler = createGetSessionQuery({ profileAuthReadRepository });

    await expect(handler({})).resolves.toEqual(expected);
    expect(profileAuthReadRepository.getSession).toHaveBeenCalledTimes(1);
  });
});
