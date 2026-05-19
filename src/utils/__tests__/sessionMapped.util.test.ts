import { describe, expect, it } from 'vitest';
import { sessionMapped } from '../sessionMapped.util';
import type { Session } from '@supabase/supabase-js';

describe('sessionMapped', () => {
  it('returns null when session is null', () => {
    expect(sessionMapped(null)).toBeNull();
  });

  it('maps session to AppSession with userId and expiresAt', () => {
    const session = {
      user: { id: 'user-123' },
      expires_at: 1234567890,
    } as unknown as Session;

    const result = sessionMapped(session);

    expect(result).toEqual({
      userId: 'user-123',
      expiresAt: 1234567890,
    });
  });

  it('handles session without optional fields', () => {
    const session = {} as Session;

    const result = sessionMapped(session);

    expect(result).toEqual({
      userId: undefined,
      expiresAt: undefined,
    });
  });
});
